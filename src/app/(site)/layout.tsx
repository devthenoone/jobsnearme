import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

// Wraps the normal website pages with the header + footer. Pages OUTSIDE this
// group (e.g. /search) render without any site chrome — a clean blank page.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
