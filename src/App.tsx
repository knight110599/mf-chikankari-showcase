import Hero from "./sections/Hero";
import Collections from "./sections/Collections";
import WhyChoose from "./sections/WhyChoose";
import Navbar from "./components/Navbar";
import FeaturedCollections from "./sections/FeaturedCollections";
import BrandStory from "./sections/BrandStory";
import WholesaleProcess from "./sections/WholesaleProcess";
import Gallery from "./sections/Gallery";
import Footer from "./sections/Footer";
function App() {
  return (
    <main className="bg-[#F8F5F0] min-h-screen">
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="collections">
        <Collections />
      </section>

      <section id="about">
        <BrandStory />
      </section>

      <WhyChoose />

      <FeaturedCollections />

      <section id="wholesale">
        <WholesaleProcess />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}

export default App;