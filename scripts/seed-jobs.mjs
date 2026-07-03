// Replace all posts with 4 "jobs near me" articles.
// Run with:  node scripts/seed-jobs.mjs
import Database from "better-sqlite3";
import path from "node:path";

const db = new Database(path.join(process.cwd(), "data", "app.db"));

// Ensure an author exists (reuse first user, else create one).
let author = db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get();
if (!author) {
  const info = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run("Editor", "editor@example.com", "seeded-no-login");
  author = { id: Number(info.lastInsertRowid) };
}

// Remove all existing blogs (and their keyword links).
db.prepare("DELETE FROM post_links").run();
db.prepare("DELETE FROM posts").run();
console.log("Removed all existing posts.");

const posts = [
  {
    title: "Jobs Near Me: How to Find Local Jobs Fast in 2026",
    slug: "jobs-near-me-how-to-find-local-jobs-fast",
    excerpt:
      "A practical guide to finding jobs near me — where to search, how to apply, and tips to get hired quickly for local roles in your area.",
    tags: "jobs near me, hiring near me, local jobs near me, full time jobs near me",
    content: `Searching for "jobs near me" is one of the fastest ways to find work in your own city or neighbourhood. Local employers want people who can start soon and travel a short distance, which means your application often moves to the top of the pile.

Start with the big job boards and set your location filter to your postcode or city. Turn on alerts so new roles near you land in your inbox the moment they are posted.

Where to look for local jobs
Check company career pages, local Facebook groups, and community notice boards. Many small businesses hire through word of mouth before they ever post online, so let friends and family know you are looking.

How to apply and stand out
Keep your CV short and tailored to each role. Mention that you live locally and can start quickly — reliability and availability matter a lot for nearby jobs. Follow up politely a few days after applying.

Getting hired quickly
Apply the same day a job is posted, keep your phone on for interview calls, and prepare a two-minute answer about why you are a good fit. Local, high-demand roles can fill within days.`,
  },
  {
    title: "Part-Time Jobs Near Me: Best Options for Students and Beginners",
    slug: "part-time-jobs-near-me-students-beginners",
    excerpt:
      "The best part-time jobs near me for students and beginners — flexible hours, no experience needed, and how to apply this week.",
    tags: "part time jobs near me, student jobs near me, weekend jobs near me, evening jobs near me",
    content: `Part-time jobs near me are perfect if you are a student, returning to work, or just want extra income around your schedule. They offer flexible hours and are often open to people with little or no experience.

Popular part-time roles
Retail assistants, cafe and restaurant staff, delivery riders, tutoring, and customer service are all common part-time roles that hire locally and train you on the job.

Best options for students
Look for evening and weekend shifts that fit around classes. Campus jobs, supermarkets, and food outlets are used to student timetables and will often work around your exams.

No experience? No problem
Many employers care more about attitude and availability than experience. Highlight teamwork, punctuality, and a willingness to learn on your application.

How to apply this week
Walk in with a printed CV during quiet hours, apply online the same day roles appear, and say clearly which days and times you can work.`,
  },
  {
    title: "Warehouse Jobs Near Me: Immediate Hiring and How to Apply",
    slug: "warehouse-jobs-near-me-immediate-hiring",
    excerpt:
      "Warehouse jobs near me with immediate start — packing, picking, and delivery roles that hire fast, often with no experience required.",
    tags: "warehouse jobs near me, delivery jobs near me, packing jobs near me, no experience jobs near me",
    content: `Warehouse jobs near me are among the fastest-hiring roles you can find, especially during busy seasons. Many offer immediate starts, flexible shifts, and pay weekly.

Common warehouse roles
Order pickers, packers, forklift operators, loaders, and delivery drivers are always in demand. Most provide on-site training, so previous experience is often optional.

Immediate-start hiring
Distribution centres and logistics companies scale up quickly. Agencies place workers within days, and many warehouses run open interview days where you can apply in person.

What you need
Comfortable footwear, the ability to stand and lift, and reliable attendance. A basic CV listing any manual or team work helps, but many roles accept first-time workers.

How to apply
Register with local recruitment agencies, apply directly on logistics company websites, and be ready for a quick phone screen and a same-week start.`,
  },
  {
    title: "Remote Jobs Near Me: Work From Home Roles You Can Start Now",
    slug: "remote-jobs-near-me-work-from-home",
    excerpt:
      "Remote jobs near me and work-from-home roles you can start now — legit options, required skills, and how to avoid scams.",
    tags: "remote jobs near me, work from home jobs near me, online jobs near me, freelance jobs near me",
    content: `Remote jobs near me let you work from home while still being hired by companies in your region. They combine the flexibility of working online with the trust of a local employer.

Popular remote roles
Customer support, data entry, virtual assistance, content writing, and online tutoring are widely available and often beginner-friendly.

Skills that help
Reliable internet, clear written communication, and basic computer skills go a long way. Many roles provide training and a set schedule.

Avoiding scams
Never pay to get a job. Be cautious of listings that promise huge pay for little work or ask for money up front. Stick to reputable job boards and verify the company.

How to start now
Set up a simple, tidy CV, apply to several roles the same day, and prepare for a short video interview. Remote roles move quickly, so apply as soon as you see them.`,
  },
];

const insert = db.prepare(
  `INSERT INTO posts (author_id, title, slug, excerpt, content, tags, published)
   VALUES (?, ?, ?, ?, ?, ?, 1)`
);
for (const p of posts) {
  insert.run(author.id, p.title, p.slug, p.excerpt, p.content, p.tags);
  console.log("Inserted:", p.slug);
}

console.log(`\nDone. ${posts.length} 'jobs near me' articles added.`);
