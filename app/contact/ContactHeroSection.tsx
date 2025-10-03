const ContactHeroSection = () => {
    return (
        <section className="hero-section text-light relative flex items-center justify-between overflow-hidden" style={{ backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity, 1))' }}>
            <div className="container mx-auto py-20 px-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">Contact Us</h1>
                <nav className="text-sm">
                    <a href="#" className="hover:text-white transition-colors duration-200">Home</a> /
                    <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
                </nav>
            </div>
        </section>
    );
};

export default ContactHeroSection;