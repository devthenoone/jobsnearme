// Create an admin/editor account (public sign-up is disabled).
// Usage:  node scripts/create-user.mjs <email> <password> "<name>"
import bcrypt from "bcryptjs";
import { db, ensureSchema } from "./_db.mjs";

const [, , email, password, name = "Admin"] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/create-user.mjs <email> <password> "<name>"');
  process.exit(1);
}

await ensureSchema();
const normEmail = email.trim().toLowerCase();
const hash = bcrypt.hashSync(password, 10);

const existing = await db.execute({
  sql: "SELECT id FROM users WHERE email = ?",
  args: [normEmail],
});

if (existing.rows.length) {
  await db.execute({
    sql: "UPDATE users SET password = ?, name = ? WHERE email = ?",
    args: [hash, name, normEmail],
  });
  console.log(`Updated existing account: ${normEmail}`);
} else {
  await db.execute({
    sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    args: [name, normEmail, hash],
  });
  console.log(`Created account: ${normEmail}`);
}
console.log("Log in at /admin");
