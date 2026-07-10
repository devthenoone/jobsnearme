import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About JobsNearMe — helping people find local, part-time, warehouse, and remote jobs near them.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">About JobsNearMe</h1>

      <div className="article mt-6 text-[17px] text-gray-800">
        <p>
          JobsNearMe helps people find work close to home. Whether you are searching for
          your first part-time role, a warehouse job with an immediate start, or a
          work-from-home position, our guides make the local job hunt simpler and faster.
        </p>

        <h2>What we do</h2>
        <p>
          We publish clear, no-nonsense guides on how to search, apply, and get hired for
          jobs near you. Every article focuses on real steps you can take today — where to
          look, how to stand out, and how to avoid common mistakes and scams.
        </p>

        <h2>Who it&apos;s for</h2>
        <ul>
          <li>Students looking for flexible, part-time and weekend work</li>
          <li>Job seekers who want immediate-start warehouse and delivery roles</li>
          <li>Anyone exploring remote and work-from-home opportunities nearby</li>
          <li>People returning to work who need clear, practical guidance</li>
        </ul>

        <h2>Our promise</h2>
        <p>
          Honest, up-to-date advice — no fluff. We keep our guides focused on what actually
          helps you get hired near you.
        </p>

        <p>
          Have a question or a topic you&apos;d like us to cover?{" "}
          <Link href="/contact" className="text-brand hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
