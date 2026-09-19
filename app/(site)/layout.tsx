import "../../styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="noise" aria-hidden="true"></div>
      <Header />
      <main>{children}</main>
      <Footer />
      <RevealOnScroll />
    </>
  );
}
