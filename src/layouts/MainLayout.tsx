import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

export default MainLayout;