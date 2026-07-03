// Create the database schema (idempotent). Run once against a fresh DB/Turso:
//   node scripts/init-db.mjs
import { ensureSchema } from "./_db.mjs";

await ensureSchema();
console.log("Schema ready (users, posts, post_links, settings).");
