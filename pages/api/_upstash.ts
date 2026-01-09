// ./pages/api/_upstash.ts
export const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
export const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
}

export async function upstashCommand(command: string[]) {
  console.log('upstashCommand — UPSTASH_URL set?', !!UPSTASH_URL)

  const res = await fetch(UPSTASH_URL as string, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command })
  })

  const text = await res.text().catch(() => '')
  let body: any = text
  try { body = text ? JSON.parse(text) : null } catch (e) {}

  if (!res.ok) {
    console.error('Upstash non-OK response:', res.status, body)
    throw new Error(`Upstash error: ${res.status} ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  }

  console.log('Upstash response (debug):', body)
  return body
}
