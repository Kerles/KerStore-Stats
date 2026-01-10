// pages/api/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const response = await fetch(upstashUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${upstashToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Upstash: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: error.message });
  }
}
