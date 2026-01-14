// Chain of Custody Event Logging System
import { generateHashFromString } from './hash'
import { createClient } from '@/lib/supabase/server'

export type EventType =
  | 'upload_received'
  | 'hash_computed'
  | 'frames_extracted'
  | 'audio_extracted'
  | 'timestamp_requested'
  | 'timestamp_received'
  | 'anchored_on_chain'
  | 'certificate_issued'

export interface EventLogData {
  event_type: EventType
  event_data?: Record<string, any>
  previous_log_hash?: string | null
}

/**
 * Log an event to the chain of custody
 */
export async function logEvent(
  certificationId: string,
  eventType: EventType,
  eventData?: Record<string, any>
): Promise<string> {
  const supabase = await createClient()

  // Get the previous log hash (last event for this certification)
  const { data: previousLogs } = await supabase
    .from('event_logs')
    .select('log_hash')
    .eq('certification_id', certificationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const previousLogHash = previousLogs?.log_hash || null

  // Create event payload
  const eventPayload = {
    certification_id: certificationId,
    event_type: eventType,
    event_data: eventData || {},
    previous_log_hash: previousLogHash,
    timestamp: new Date().toISOString(),
  }

  // Generate hash for this log entry
  const logHash = await generateHashFromString(JSON.stringify(eventPayload))

  // Insert event log
  const { error } = await supabase.from('event_logs').insert({
    certification_id: certificationId,
    event_type: eventType,
    event_data: eventData || {},
    previous_log_hash: previousLogHash,
    log_hash: logHash,
  })

  if (error) {
    throw new Error(`Failed to log event: ${error.message}`)
  }

  return logHash
}

/**
 * Get all event logs for a certification (chain of custody)
 */
export async function getEventLogs(certificationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('event_logs')
    .select('*')
    .eq('certification_id', certificationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to get event logs: ${error.message}`)
  }

  return data || []
}

/**
 * Verify chain of custody integrity
 */
export async function verifyChainOfCustody(
  certificationId: string
): Promise<{ valid: boolean; errors: string[] }> {
  const logs = await getEventLogs(certificationId)
  const errors: string[] = []

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i]

    // Verify hash
    const eventPayload = {
      certification_id: log.certification_id,
      event_type: log.event_type,
      event_data: log.event_data,
      previous_log_hash: log.previous_log_hash,
      timestamp: log.created_at,
    }

    const expectedHash = await generateHashFromString(JSON.stringify(eventPayload))

    if (log.log_hash !== expectedHash) {
      errors.push(`Log ${i} hash mismatch`)
    }

    // Verify chain link
    if (i > 0) {
      const previousLog = logs[i - 1]
      if (log.previous_log_hash !== previousLog.log_hash) {
        errors.push(`Log ${i} chain link broken`)
      }
    } else {
      // First log should have null previous_log_hash
      if (log.previous_log_hash !== null) {
        errors.push('First log should have null previous_log_hash')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
