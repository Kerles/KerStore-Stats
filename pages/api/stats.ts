const UPSTASH_URL = process.env.UPSTASH_REST_URL?.replace(/\/$/, "") ?? "";
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN ?? "";
if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.error("Missing UPSTASH_REST_URL or UPSTASH_REST_TOKEN env vars");
}
   res.status(500).json({ error: error.message }); 


async function upstashCmd(cmdArray: (string | number)[]): Promise<any> {
  const res = await fetch(`${UPSTASH_URL}/rest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cmd: cmdArray }),
  });
  if (!res.ok) throw new Error(`Upstash error ${res.status}`);
  return res.json();
}
