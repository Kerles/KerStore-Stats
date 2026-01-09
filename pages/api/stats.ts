// import fetch from "node-fetch"


const UPSTASH_URL = process.env.UPSTASH_REST_URL?.replace(/\/$/, "");
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.error("Missing UPSTASH_REST_URL or UPSTASH_REST_TOKEN env vars");
}

async function upstashCmd(cmdArray) {
  const res = await fetch(`${UPSTASH_URL}/rest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cmd: cmdArray }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

export default async function handler(req, res) {
  try {
    
    const scanRes = await upstashCmd(["SCAN", "0", "MATCH", "stats:*", "COUNT", "1000"]);
    
    const cursor = scanRes.result?.[0] ?? "0";
    const keys = scanRes.result?.[1] ?? scanRes?.result ?? [];

    
    const data = {};
    if (keys.length > 0) {
      const mgetRes = await upstashCmd(["MGET", ...keys]);
      const values = mgetRes.result ?? mgetRes;
      keys.forEach((k, i) => (data[k] = values[i]));
    }

    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("API /api/stats error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
}
