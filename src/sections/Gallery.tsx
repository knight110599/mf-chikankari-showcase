import { motion } from "framer-motion";
import SectionTitle from "../components/ui/SectionTitle";
import GalleryCard from "../components/ui/GalleryCard";

import blueSuit from "../assets/Images/Gallery/blue-suit.png";
import brownSuit from "../assets/Images/Gallery/brown-suit.jpg";
import darkRedSuit from "../assets/Images/Gallery/dark-red-suit.jpg";
import greenSuit from "../assets/Images/Gallery/green-suit.jpg";
import lightGreenSuit from "../assets/Images/Gallery/light-green-suit.jpg";
import purpleSuit from "../assets/Images/Gallery/purple-suit.jpg";
import whiteSuit from "../assets/Images/Gallery/white-suit.jpg";

const gallery = [
  {
    image: blueSuit,
    title: "Blue Chikankari Suit",
  },
  {
    image: brownSuit,
    title: "Brown Chikankari Suit",
  },
  {
    image: darkRedSuit,
    title: "Dark Red Chikankari Suit",
  },
  {
    image: greenSuit,
    title: "Green Chikankari Suit",
  },
  {
    image: lightGreenSuit,
    title: "Light Green Chikankari Suit",
  },
  {
    image: purpleSuit,
    title: "Purple Chikankari Suit",
  },
  {
    image: whiteSuit,
    title: "White Chikankari Suit",
  },
];

function Gallery() {
  return (
    <section
      id="gallery"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-12">

        <SectionTitle
          subtitle="Gallery"
          title="Our Latest Collection"
          description="A glimpse of our handcrafted Lucknowi Chikankari collections designed with elegance and tradition."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {gallery.map((item) => (
            <GalleryCard
              key={item.title}
              image={item.image}
              title={item.title}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Gallery;