import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeedPreview from "@/components/FeedPreview";
import CreatorSpotlight from "@/components/CreatorSpotlight";
import Trending from "@/components/Trending";
import WaitlistCTA from "@/components/WaitlistCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FeedPreview />
        <CreatorSpotlight />
        <Trending />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
