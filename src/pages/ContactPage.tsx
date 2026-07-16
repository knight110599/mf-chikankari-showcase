import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const contactDetails = [
  {
    icon: <Phone size={22} />,
    title: "Call Us",
    value: "+91 63868 26199",
    href: "tel:+916386826199",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp",
    value: "Chat with our team",
    href: "https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections.",
  },
  {
    icon: <Mail size={22} />,
    title: "Email",
    value: "info@mfchikankari.com",
    href: "mailto:info@mfchikankari.com",
  },
  {
    icon: <MapPin size={22} />,
    title: "Location",
    value: "Lucknow, Uttar Pradesh, India",
  },
];

function ContactPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const enquiryType = String(formData.get("enquiryType") || "");
    const message = String(formData.get("message") || "");

    const whatsappMessage = encodeURIComponent(
      `Hello MF Chikankari,

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Enquiry Type: ${enquiryType}

Message:
${message}`,
    );

    window.open(
      `https://wa.me/916386826199?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#E8DCC5] bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <p
            className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
            style={{ fontFamily: "Poppins" }}
          >
            Get in Touch
          </p>

          <h1
            className="mt-4 max-w-4xl text-5xl leading-tight text-[#0F4C3A] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Let&apos;s Discuss Your Chikankari Requirements
          </h1>

          <p
            className="mt-8 max-w-3xl text-lg leading-8 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Contact us for retail enquiries, wholesale pricing, bulk orders,
            product availability and customised requirements.
          </p>
        </div>
      </section>

      {/* Contact details and form */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left side */}
          <div>
            <p
              className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
              style={{ fontFamily: "Poppins" }}
            >
              Contact Information
            </p>

            <h2
              className="mt-3 text-5xl leading-tight text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              We&apos;re Here to Help
            </h2>

            <p
              className="mt-5 max-w-xl leading-8 text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              Our team can help you choose products, understand wholesale
              pricing and place bulk orders.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactDetails.map((item) => {
                const content = (
                  <>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#C9A86A]">
                      {item.icon}
                    </div>

                    <div>
                      <h3
                        className="font-semibold text-[#0F4C3A]"
                        style={{ fontFamily: "Poppins" }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="mt-1 text-sm leading-6 text-gray-600"
                        style={{ fontFamily: "Poppins" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </>
                );

                return item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target={
                      item.href.startsWith("https://") ? "_blank" : undefined
                    }
                    rel={
                      item.href.startsWith("https://")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-4 rounded-[22px] border border-[#E8DCC5] bg-white p-5 transition hover:-translate-y-1 hover:border-[#D8C29A] hover:shadow-lg"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-[22px] border border-[#E8DCC5] bg-white p-5"
                  >
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E8DCC5] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#C9A86A]">
                  <Clock3 size={22} />
                </div>

                <div>
                  <h3
                    className="font-semibold text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Business Hours
                  </h3>

                  <div
                    className="mt-3 space-y-2 text-sm text-gray-600"
                    style={{ fontFamily: "Poppins" }}
                  >
                    <p>Monday – Saturday: 10:00 AM – 7:00 PM</p>
                    <p>Sunday: By appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[32px] border border-[#E8DCC5] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <p
              className="text-sm uppercase tracking-[0.3em] text-[#C9A86A]"
              style={{ fontFamily: "Poppins" }}
            >
              Send an Enquiry
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Tell Us What You Need
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Full Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-[16px] border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
                    style={{ fontFamily: "Poppins" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91"
                    className="h-12 w-full rounded-[16px] border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
                    style={{ fontFamily: "Poppins" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-[16px] border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>

              <div>
                <label
                  htmlFor="enquiryType"
                  className="mb-2 block text-sm font-medium text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Enquiry Type *
                </label>

                <select
                  id="enquiryType"
                  name="enquiryType"
                  required
                  defaultValue=""
                  className="h-12 w-full rounded-[16px] border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
                  style={{ fontFamily: "Poppins" }}
                >
                  <option value="" disabled>
                    Select an enquiry type
                  </option>

                  <option value="Retail Product Enquiry">
                    Retail Product Enquiry
                  </option>

                  <option value="Wholesale Enquiry">Wholesale Enquiry</option>

                  <option value="Bulk Order">Bulk Order</option>

                  <option value="Product Availability">
                    Product Availability
                  </option>

                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us about your product, quantity or wholesale requirements..."
                  className="w-full resize-none rounded-[16px] border border-[#D9C8A8] bg-[#F8F5F0] px-4 py-4 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-8 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg sm:w-auto"
                style={{ fontFamily: "Poppins" }}
              >
                Send via WhatsApp
                <Send size={18} />
              </button>

              <p
                className="text-xs leading-6 text-gray-500"
                style={{ fontFamily: "Poppins" }}
              >
                Submitting this form will open WhatsApp with your enquiry
                details. No message will be sent automatically.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-y border-[#E8DCC5] bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p
                className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
                style={{ fontFamily: "Poppins" }}
              >
                Our Location
              </p>

              <h2
                className="mt-3 text-5xl leading-tight text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Based in Lucknow
              </h2>

              <p
                className="mt-5 leading-8 text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                Located in the heart of Lucknow, the home of authentic
                Chikankari craftsmanship.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-[#EFE8DB]">
              <iframe
                title="MF Chikankari location in Lucknow"
                src="https://www.google.com/maps?q=Lucknow%2C%20Uttar%20Pradesh&output=embed"
                className="h-[380px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F4C3A] py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2
            className="text-5xl leading-tight text-white"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Looking for Wholesale Pricing?
          </h2>

          <p
            className="mt-6 text-lg leading-8 text-white/80"
            style={{ fontFamily: "Poppins" }}
          >
            Share your preferred products and required quantity with our team
            to receive availability and wholesale pricing.
          </p>

          <a
            href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20am%20interested%20in%20your%20wholesale%20collection.%20Please%20share%20the%20catalogue%20and%20pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 font-semibold text-[#0F4C3A] transition hover:scale-105"
            style={{ fontFamily: "Poppins" }}
          >
            Request Wholesale Catalogue
          </a>
        </div>
      </section>
    </>
  );
}

export default ContactPage;