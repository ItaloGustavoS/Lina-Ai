import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
      }
      console.error('Supabase sign up error:', signUpError);
      return NextResponse.json({ error: 'An unexpected error occurred during sign up.' }, { status: 500 });
    }

    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, email: data.user.email, name }]);

      if (insertError) {
        console.error("Orphaned user created. Auth user created but profile insertion failed. User ID:", data.user.id, "Error:", insertError);
        return NextResponse.json({ error: "Your account was created, but we couldn't set up your profile. Please contact support." }, { status: 500 });
      }

      return NextResponse.json({ message: 'Registration successful! Please check your email to confirm your account.' }, { status: 201 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred. No user data returned from Supabase.' }, { status: 500 });

  } catch (error: any) {
    console.error('Registration API error:', error);
    if (error.name === 'SyntaxError') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
