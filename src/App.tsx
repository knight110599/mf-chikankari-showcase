import Hero from "./sections/Hero";
import Collections from "./sections/Collections";
import WhyChoose from "./sections/WhyChoose";
import Navbar from "./components/Navbar";
import FeaturedCollections from "./sections/FeaturedCollections";

function App() {
  return (
    <main className="bg-[#F8F5F0] min-h-screen">
      <Navbar />
      <Hero />
      <Collections />
      <WhyChoose />
      <FeaturedCollections />
      <Navbar />
    </main>
  );
}

export default App;