import { motion } from "framer-motion";
import SectionTitle from "../components/ui/SectionTitle";
import ProcessCard from "../components/ui/ProcessCard";

function WholesaleProcess() {
  return (
    <section
      id="process"
      className="bg-[#F8F5F0] py-24"
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <SectionTitle
          subtitle="How It Works"
          title="Simple Wholesale Process"
          description="From selecting your favorite Chikankari collection to doorstep delivery, we've made the ordering process simple, transparent and reliable."
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-5"
        >
          <ProcessCard
            step="Step 01"
            icon="🛍️"
            title="Browse Collection"
            description="Explore our premium handcrafted Chikankari collections."
          />

          <ProcessCard
            step="Step 02"
            icon="💬"
            title="Share Requirement"
            description="Tell us your quantity, designs and wholesale requirements."
          />

          <ProcessCard
            step="Step 03"
            icon="📦"
            title="Order Confirmation"
            description="We confirm availability, pricing and delivery timeline."
          />

          <ProcessCard
            step="Step 04"
            icon="🧵"
            title="Quality Check"
            description="Every product is carefully inspected before dispatch."
          />

          <ProcessCard
            step="Step 05"
            icon="🚚"
            title="Fast Delivery"
            description="Secure Pan India delivery for retailers and resellers."
          />
        </motion.div>
      </div>
    </section>
  );
}

export default WholesaleProcess;