import { motion } from "framer-motion";
import SectionTitle from "../components/ui/SectionTitle";
import ProcessCard from "../components/ui/ProcessCard";

const processSteps = [
  {
    step: "Step 01",
    icon: "🛍️",
    title: "Browse Collection",
    description:
      "Explore our premium handcrafted Chikankari collections.",
  },
  {
    step: "Step 02",
    icon: "💬",
    title: "Share Requirement",
    description:
      "Tell us your preferred designs, quantity and wholesale requirements.",
  },
  {
    step: "Step 03",
    icon: "📦",
    title: "Order Confirmation",
    description:
      "We confirm product availability, pricing and the delivery timeline.",
  },
  {
    step: "Step 04",
    icon: "🧵",
    title: "Quality Check",
    description:
      "Every product is carefully inspected before it is dispatched.",
  },
  {
    step: "Step 05",
    icon: "🚚",
    title: "Fast Delivery",
    description:
      "Your wholesale order is securely delivered anywhere across India.",
  },
];

function WholesaleProcess() {
  return (
    <section id="process" className="bg-[#F8F5F0] py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionTitle
          subtitle="How It Works"
          title="Simple Wholesale Process"
          description="From selecting your favorite Chikankari collection to doorstep delivery, we've made the ordering process simple, transparent and reliable."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid items-stretch gap-0 md:mt-14 md:grid-cols-2 md:gap-6 xl:grid-cols-5"
        >
          {processSteps.map((item, index) => (
            <div key={item.step} className="relative h-full">
              <ProcessCard
                step={item.step}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />

              {index < processSteps.length - 1 && (
                <>
                  {/* Mobile connector */}
                  <div
                    aria-hidden="true"
                    className="mx-auto h-10 w-px bg-[#D9C6A6] md:hidden"
                  />

                  {/* Desktop connector */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-6 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-[#D9C6A6] xl:block"
                  />
                </>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center md:mt-12"
        >
          <a
            href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20am%20interested%20in%20your%20wholesale%20collection.%20Please%20share%20the%20catalogue%20and%20pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#075A46] px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064B3B] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#075A46] focus:ring-offset-4"
          >
            Start Wholesale Order
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default WholesaleProcess;