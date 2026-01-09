// ./api/_upstash.ts
import fetch from 'node-fetch'

export const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
export const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
}

/**
 * Execute an Upstash REST command and return parsed JSON.
 * Throws with detailed message on non-OK responses.
 */
export async function upstashCommand(command: string[]) {
  // lightweight debug (will show true/false in logs, never the token)
  console.log('upstashCommand — UPSTASH_URL set?', !!UPSTASH_URL)

  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command })
  })

  const text = await res.text().catch(() => '')
  // try parse JSON if possible for better debugging
  let body: any = text
  try { body = text ? JSON.parse(text) : null } catch (e) { /* keep raw text */ }

  if (!res.ok) {
    console.error('Upstash non-OK response:', res.status, body)
    throw new Error(`Upstash error: ${res.status} ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  }

  console.log('Upstash response (debug):', body)
  return body
}
