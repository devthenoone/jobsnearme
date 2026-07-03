// Create an admin/editor account (public sign-up is disabled).
// Usage:  node scripts/create-user.mjs <email> <password> "<name>"
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";

const [, , email, password, name = "Admin"] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/create-user.mjs <email> <password> "<name>"');
  process.exit(1);
}

const db = new Database(path.join(process.cwd(), "data", "app.db"));
const normEmail = email.trim().toLowerCase();

const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(normEmail);
if (exists) {
  // Update the password instead of erroring, so this doubles as a reset tool.
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("UPDATE users SET password = ?, name = ? WHERE email = ?").run(
    hash,
    name,
    normEmail
  );
  console.log(`Updated existing account: ${normEmail}`);
} else {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
    name,
    normEmail,
    hash
  );
  console.log(`Created account: ${normEmail}`);
}

console.log("Log in at /admin");
