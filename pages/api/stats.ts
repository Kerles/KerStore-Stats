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
