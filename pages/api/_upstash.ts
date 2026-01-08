// helper shared
export const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!
export const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

export async function upstashCommand(command: string[]) {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upstash error: ${res.status} ${text}`)
  }
  return res.json()
}
