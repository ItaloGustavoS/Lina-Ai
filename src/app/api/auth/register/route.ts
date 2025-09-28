import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientIp } from '@/lib/utils';
import { registrationSchema } from './validation';

// Simple in-memory rate limiter (for demonstration purposes)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

async function insertUserProfile(userId: string, email: string, name: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .insert([{ id: userId, email, name }]);
  return error;
}

// Trust proxy configuration (set via environment variable or config)
const TRUST_PROXY = process.env.TRUST_PROXY === 'true';

export async function POST(request: Request) {
  // 1. Rate Limiting
  // Only trust x-forwarded-for if TRUST_PROXY is enabled
  // This is important for security in production environments
  const ip = getClientIp(request, { trustProxy: TRUST_PROXY });

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    );
  }

  // 2. Validate input
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { name, email, password } = parsed.data;

  // 3. Sign up the user (using public client)
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    const isConflict = signUpError.message.includes('User already registered');
    const status = isConflict ? 409 : 500;
    const message = isConflict
      ? 'This email is already registered.'
      : 'An unexpected error occurred during sign up.';
    return NextResponse.json({ error: message }, { status });
  }

  if (!data.user) {
    console.error('No user data returned from Supabase after sign up.');
    return NextResponse.json(
      { error: 'An unexpected error occurred. No user data returned from Supabase.' },
      { status: 500 }
    );
  }

  // 4. Insert user profile (using admin client)
  const insertError = await insertUserProfile(data.user.id, email, name);
  if (insertError) {
    // This is a critical error. An auth user exists but their profile is missing.
    console.error(
      "Orphaned user created. Auth user created but profile insertion failed. User ID:",
      data.user.id,
      "Error:",
      insertError
    );
    return NextResponse.json(
      {
        error: "Your account was created, but we couldn't set up your profile. Please contact support.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'Registration successful! Please check your email to confirm your account.' },
    { status: 201 }
  );
}
