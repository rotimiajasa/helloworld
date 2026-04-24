/**
 * Sends a notification to ClickUp.
 * Usage: node scripts/notify_clickup.js "<title>" "<body>" [list_id]
 */

import fetch from "node-fetch";

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const DEFAULT_LIST_ID = process.env.CLICKUP_LIST_ID;

if (!CLICKUP_API_TOKEN) {
  console.error("Missing CLICKUP_API_TOKEN environment variable");
  process.exit(1);
}

const [, , title, body, listId] = process.argv;

if (!title || !body) {
  console.error("Usage: node notify_clickup.js <title> <body> [list_id]");
  process.exit(1);
}

const targetList = listId || DEFAULT_LIST_ID;
if (!targetList) {
  console.error("No ClickUp list ID provided. Set CLICKUP_LIST_ID env var or pass as argument.");
  process.exit(1);
}

try {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${targetList}/task`, {
    method: "POST",
    headers: {
      Authorization: CLICKUP_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: title,
      description: body,
      status: "complete",
      priority: 3,
      due_date: Date.now(),
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }

  const task = await response.json();
  console.log(`✅ ClickUp task created: ${task.url}`);
} catch (err) {
  console.error(`❌ ClickUp notification failed: ${err.message}`);
  process.exit(1);
}
