// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWaitlistConfirmation } from '@/lib/resend';

// Lazy-initialize Supabase client to avoid build-time errors
// when environment variables are not yet available
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { email, signup_type = 'general', source = 'organic' } = body;

    // Validate email format
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Insert into database (will fail silently if duplicate due to UNIQUE constraint)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase
      .from('waitlist_signups') as any)
      .insert({
        email: normalizedEmail,
        signup_type,
        source,
      });

    // If duplicate email and this is a founding_seller signup, upgrade the existing record
    if (insertError && insertError.message.includes('duplicate')) {
      if (signup_type === 'founding_seller') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase
          .from('waitlist_signups') as any)
          .update({ signup_type: 'founding_seller', source })
          .eq('email', normalizedEmail);
      }
      // Either way, return success (don't reveal the email already exists)
    } else if (insertError) {
      console.error('Waitlist insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Get total count
    const { count } = await (supabase
      .from('waitlist_signups') as any)
      .select('*', { count: 'exact', head: true });

    // Send confirmation email (awaited so Vercel doesn't kill the function early)
    try {
      await sendWaitlistConfirmation({
        email: normalizedEmail,
        position: count || 0,
        signupType: signup_type as 'general' | 'founding_seller',
      });
    } catch (err) {
      console.error('Waitlist email failed:', err);
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    // Get total count for public display
    const { count, error } = await (supabase
      .from('waitlist_signups') as any)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Waitlist count error:', error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json({ count: 0 });
  }
}
