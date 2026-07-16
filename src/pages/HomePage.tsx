import Hero from "../sections/Hero";
import Collections from "../sections/Collections";
import WhyChoose from "../sections/WhyChoose";
import FeaturedCollections from "../sections/FeaturedCollections";
import BrandStory from "../sections/BrandStory";
import WholesaleProcess from "../sections/WholesaleProcess";
import Gallery from "../sections/Gallery";

function HomePage() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>

      <Collections />

      <section id="about">
        <BrandStory />
      </section>

      <WhyChoose />

      <FeaturedCollections />

      <WholesaleProcess />

      <Gallery />
    </>
  );
}

export default HomePage;