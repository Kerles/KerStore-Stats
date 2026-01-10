// pages/api/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const upstashUrl = process.env.KV_URL;
  const upstashToken = process.env.KV_REST_API_READ_ONLY_TOKEN;
  if (!upstashUrl || !upstashToken) {
    console.error("Missing KV_URL or KV_REST_API_READ_ONLY_TOKEN env vars");
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

    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('Error fetching stats:', errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
}
