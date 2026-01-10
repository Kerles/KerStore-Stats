// pages/api/save.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const upstashUrl = process.env.KV_URL;
  const upstashToken = process.env.KV_REST_API_READ_ONLY_TOKEN;

  if (!upstashUrl || !upstashToken) {
    console.error("Missing KV_URL or KV_REST_API_READ_ONLY_TOKEN env vars");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (req.method === 'POST') {
    const dataToStore = req.body; 

    try {
      const response = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${upstashToken}`,
        },
        body: JSON.stringify(dataToStore),
      });

      if (!response.ok) {
        throw new Error(`Failed to store data in Upstash: ${response.status}`);
      }

      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      console.error('Error storing data:', errorMessage);
      return res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
