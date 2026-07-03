// One-off seed: add the "Business Registration in Qatar" article as a post.
// Run with:  node scripts/seed-qatar.mjs
import Database from "better-sqlite3";
import path from "node:path";

const db = new Database(path.join(process.cwd(), "data", "app.db"));

// Ensure an author exists (reuse the first user, or create a Tejwaans author).
let author = db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get();
if (!author) {
  const info = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run("Tejwaans Corporate Group", "blog@tejwaansgroup.com", "seeded-no-login");
  author = { id: Number(info.lastInsertRowid) };
}

const title = "Business Registration in Qatar: Complete Guide for 2025";
const slug = "business-registration-in-qatar-complete-guide-for-2025";
const excerpt =
  "Start a small business in Qatar with expert guidance on registration, company formation, licensing, and 100% foreign ownership. Full business setup support.";
const tags =
  "business registration qatar, company formation qatar, business setup qatar, small business license qatar, foreign ownership qatar";

// Plain-text content; the app splits on blank lines into paragraphs and drops
// the live keyword panel in the middle automatically.
const content = `Starting a business in Qatar is a golden opportunity for entrepreneurs looking to tap into one of the world's fastest-growing economies. Qatar's government has streamlined the business registration process, making it accessible and efficient. Whether you want to establish a small enterprise or a large corporation, the journey begins with registering your business.

By partnering with Tejwaans Corporate Group, you gain access to a team of experts who guide you through every step — from selecting the right business activity to completing the necessary paperwork. Starting cost for business registration: from QAR 5,600.

Company Registration in Qatar
Company registration in Qatar is an essential step for anyone planning to conduct business in the country. Qatar's pro-business environment and supportive legal framework ensure that local and foreign investors can register their companies with ease. The process involves obtaining approvals from the Ministry of Commerce and Industry, drafting articles of association, and fulfilling any sector-specific requirements.

Business Setup in Qatar
Setting up a business in Qatar involves more than just registration — it's about building a foundation for success. From choosing a business structure to obtaining the required licenses, every step must be carefully planned and executed. Tejwaans Corporate Group simplifies the process by providing documentation, approvals, post-setup support, and securing a corporate bank account.

Company Formation in Qatar
Company formation in Qatar is an exciting opportunity, especially with the option for 100% foreign ownership in many sectors. The process includes selecting the appropriate business structure, registering with the Ministry of Commerce and Industry, and complying with local regulations.

Business License in Qatar
Obtaining a business license is a crucial step in setting up any business in Qatar. Licenses vary based on your business activity — including trade, industrial, or professional licenses. Expert guidance ensures that you meet all the legal and regulatory standards required for your specific industry.

Small Business License in Qatar
Small businesses play a vital role in Qatar's economy. Obtaining a small business license is straightforward and ideal for entrepreneurs looking to establish a venture with minimal overhead costs, with comprehensive support from selecting the right license to ensuring full compliance.

Home-Based Business in Qatar
The concept of home-based businesses is gaining traction in Qatar, thanks to supportive regulations that make it easier for entrepreneurs to start small ventures from their homes. A home-based business license allows you to operate legally while enjoying the benefits of low operational costs.

Company Formation — 100% Foreign Owned
Qatar's government actively supports foreign investment, allowing 100% ownership in several sectors. The process includes registering with the Ministry of Commerce and Industry, selecting a business activity, and fulfilling all legal requirements for a smooth and fully compliant formation.

Why Choose Tejwaans Corporate Group?
End-to-end business setup support in Qatar — from registration to operations. Comprehensive services include company formation, visa processing, attestation, and translation. Our experienced professionals are well-versed in Qatar's local regulations, we offer 24/7 support, and we have served Qatar since 2018 with 4000+ satisfied clients.

Frequently Asked Questions
Can foreigners own businesses in Qatar? Yes, Qatar allows foreign ownership in several business sectors, offering opportunities for 100% ownership through various legal structures. What is the cost of registering a business in Qatar? Costs start at QAR 5,600, with additional fees depending on the business type and licensing requirements. How long does it take? Typically a few weeks, depending on the business structure and documentation.

Ready to register your business in Qatar? Get a free consultation with our experts today — starting from QAR 5,600.`;

// Upsert by slug so re-running doesn't create duplicates.
const existing = db.prepare("SELECT id FROM posts WHERE slug = ?").get(slug);
if (existing) {
  db.prepare(
    `UPDATE posts SET title=?, excerpt=?, content=?, tags=?, published=1, updated_at=datetime('now') WHERE slug=?`
  ).run(title, excerpt, content, tags, slug);
  console.log("Updated existing post:", slug);
} else {
  db.prepare(
    `INSERT INTO posts (author_id, title, slug, excerpt, content, tags, published)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).run(author.id, title, slug, excerpt, content, tags);
  console.log("Inserted post:", slug);
}

console.log("Done. View at /blog/" + slug);
