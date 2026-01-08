import type { NextApiRequest, NextApiResponse } from 'next'
import { upstashCommand } from './_upstash'

type DayItem = { date: string; count: number }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalRes = await upstashCommand(['GET', 'site:visits:total'])
    const total = Number(totalRes.result ?? 0)

    const days: DayItem[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      const r = await upstashCommand(['GET', `site:visits:day:${d}`])
      days.push({ date: d, count: Number(r.result ?? 0) })
    }

    return res.status(200).json({ total, days })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'failed to read from Upstash' })
  }
}
