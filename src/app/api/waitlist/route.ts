// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { error: insertError } = await supabase
      .from('waitlist_signups')
      .insert({
        email: normalizedEmail,
        signup_type,
        source,
      });

    // If duplicate email, still return success (don't reveal it exists)
    // Only throw error if it's NOT a duplicate key violation
    if (insertError && !insertError.message.includes('duplicate')) {
      console.error('Waitlist insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Get total count
    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

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
    const { count, error } = await supabase
      .from('waitlist_signups')
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
