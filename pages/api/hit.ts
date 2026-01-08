import type { NextApiRequest, NextApiResponse } from 'next'
import { upstashCommand } from './_upstash'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    // increment total
    await upstashCommand(['INCR', 'site:visits:total'])

    // increment day key
    const day = new Date().toISOString().slice(0, 10)
    await upstashCommand(['INCR', `site:visits:day:${day}`])

    return res.status(204).end()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'failed to write to Upstash' })
  }
}
