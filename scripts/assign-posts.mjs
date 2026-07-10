// Reassign ALL posts to a given user (so they show in that user's dashboard).
// Usage:  node scripts/assign-posts.mjs <email>
import { db, ensureSchema } from "./_db.mjs";

const email = (process.argv[2] || "").trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/assign-posts.mjs <email>");
  process.exit(1);
}

await ensureSchema();

const u = await db.execute({ sql: "SELECT id, name FROM users WHERE email = ?", args: [email] });
if (!u.rows.length) {
  console.error(`No user with email ${email}. Create one first with scripts/create-user.mjs`);
  process.exit(1);
}
const userId = Number(u.rows[0].id);

const res = await db.execute({ sql: "UPDATE posts SET author_id = ?", args: [userId] });
console.log(`Reassigned ${res.rowsAffected} post(s) to ${u.rows[0].name} <${email}> (id ${userId}).`);
