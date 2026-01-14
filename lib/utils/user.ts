/**
 * Utility functions for user management
 */

import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Ensures a user exists in the public.users table.
 * Creates the user if they don't exist (fallback if trigger didn't fire).
 * Returns the user profile.
 */
export async function ensureUserExists(
  supabase: SupabaseClient,
  authUser: { id: string; email?: string | null; user_metadata?: Record<string, any> | null }
) {
  // First, try to get the user
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  // If user exists, return it
  if (existingUser && !fetchError) {
    return existingUser
  }

  // User doesn't exist, create it
  console.log('User not found in public.users, creating...', { userId: authUser.id })
  
  // Try insert first
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      id: authUser.id,
      email: authUser.email || '',
      display_name: authUser.user_metadata?.display_name || null,
      account_type: 'creator',
    })
    .select()
    .single()

  if (insertError) {
    // If insert fails, try upsert (handles race conditions)
    console.warn('Insert failed, trying upsert:', insertError.message)
    const { data: upsertUser, error: upsertError } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        email: authUser.email || '',
        display_name: authUser.user_metadata?.display_name || null,
        account_type: 'creator',
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Failed to create user in public.users (both insert and upsert failed):', upsertError)
      throw new Error(`Failed to ensure user exists: ${upsertError.message}`)
    }

    return upsertUser
  }

  return newUser
}
