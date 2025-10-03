
import type { Metadata } from "next";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import BackToTopButton from "../components/BackToTopButton";
import ContactHeroSection from "./ContactHeroSection";
import ContactDetails from "./ContactDetails";

export const metadata: Metadata = {
    title: "Blurb - Contact Us",
};

const ContactPage = () => {
    return (
        <div className="bg-gray-100 font-sans">
            <Header />
            <Navbar />
            <ContactHeroSection />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto contact-card">
                    <ContactDetails />
                </div>
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default ContactPage;
