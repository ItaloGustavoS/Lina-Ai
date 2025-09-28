import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

interface GetClientIpOptions {
  trustProxy?: boolean;
}

export const getClientIp = (request: Request, options: GetClientIpOptions = {}): string => {
  const { trustProxy = false } = options;

  if (trustProxy) {
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) {
      // x-forwarded-for may contain multiple IPs, take the first one
      const ip = xForwardedFor.split(',')[0].trim();
      // Simple IPv4/IPv6 validation
      const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^[a-fA-F0-9:]+$/;
      if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
        return ip;
      }
    }
  }

  // Fallback to localhost if no valid IP found or proxy is not trusted
  return '127.0.0.1';
};
