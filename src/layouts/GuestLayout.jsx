import Navbar from "../partials/Navbar";
import Footer from "../partials/Footer";

const GuestLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default GuestLayout;
