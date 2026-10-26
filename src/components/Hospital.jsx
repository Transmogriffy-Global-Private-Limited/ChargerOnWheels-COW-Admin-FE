
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
const HospitalLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDemoRequest = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
        <Helmet>
        {/* Page Title */}
        <title>Hospital Management Software | Streamline Patient Care & Operations</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Elevate patient care and streamline hospital operations with our integrated hospital management system. Manage patients, staff, billing, and more."
        />
<meta name="robots" content="index, follow" />
        {/* Canonical URL */}
        <link rel="canonical" href="https://transev.site/" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Hospital Management Software | Streamline Care & Operations" />
        <meta
          property="og:description"
          content="Comprehensive hospital management system for patient records, staff scheduling, billing, telemedicine, and analytics."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/" />
        <meta property="og:image" content="https://transev.site/images/hospital-og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hospital Management Software | Streamline Care & Operations" />
        <meta
          name="twitter:description"
          content="Manage patients, staff, billing, and telemedicine with our comprehensive hospital management system."
        />
        <meta name="twitter:image" content="https://transev.site/images/hospital-og-image.jpg" />

        {/* Optional Robots Tag */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-teal-600 text-white text-center py-20 px-4">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Elevating Patient Care with Integrated Hospital Management</h2>
        <p className="text-xl sm:text-2xl mb-6 max-w-2xl mx-auto">
          Streamline operations, enhance patient experience, and ensure seamless healthcare delivery with our comprehensive hospital management system.
        </p>
        <button
          onClick={handleDemoRequest}
          className="bg-yellow-400 text-teal-900 px-8 py-3 rounded-full text-xl hover:bg-yellow-500 transition-all"
        >
          Request a Demo
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-12 bg-white">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard title="Patient Management" description="Manage patient records, history, and appointments with ease." />
          <FeatureCard title="Staff Scheduling" description="Optimize staff shifts and availability for maximum efficiency." />
          <FeatureCard title="Billing & Invoicing" description="Automated billing with real-time invoice generation." />
          <FeatureCard title="Inventory Management" description="Track medicine, equipment, and consumables." />
          <FeatureCard title="Telemedicine Integration" description="Enable remote consultations through secure video sessions." />
          <FeatureCard title="Reports & Analytics" description="Gain insights with customizable reports and dashboards." />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 px-4 sm:px-12">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-12">Why Choose Our Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <BenefitCard
            title="Customizable Modules"
            description="Tailor the system to your hospital’s specific workflows and departments."
            icon="⚙️"
          />
          <BenefitCard
            title="Secure & Compliant"
            description="HIPAA-compliant with advanced data encryption to protect patient records."
            icon="🔒"
          />
          <BenefitCard
            title="24/7 Support"
            description="Our team is available around the clock to ensure smooth operation."
            icon="🕐"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-100 py-20 px-4 sm:px-12">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-12">Affordable Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard plan="Basic" price="₹9,999/mo" features={["100 Patients", "Basic Modules", "Email Support"]} />
          <PricingCard plan="Standard" price="₹19,999/mo" features={["500 Patients", "All Modules", "Priority Support"]} />
          <PricingCard plan="Enterprise" price="Custom Pricing" features={["Unlimited Patients", "Custom Features", "Dedicated Manager"]} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-teal-600 text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Need a customized solution? We offer complete hospital system customization tailored to your specific workflow.
        </p>
        <a
          href="/contact"
          className="bg-yellow-400 text-teal-900 px-8 py-3 rounded-full text-xl hover:bg-yellow-500 transition-all"
        >
          Contact
        </a>
      </section>

      {/* Modal for Demo Request */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">Request a Demo</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Request submitted!');
                closeModal();
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Hospital Name"
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <textarea
                placeholder="What features do you need?"
                className="w-full border border-gray-300 rounded px-4 py-2"
                rows="4"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable FeatureCard Component
const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center border hover:shadow-md transition-all">
    <h3 className="text-xl font-semibold text-teal-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Reusable PricingCard Component
const PricingCard = ({ plan, price, features }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center border hover:shadow-md transition-all">
    <h3 className="text-2xl font-bold text-teal-600 mb-2">{plan}</h3>
    <p className="text-xl text-gray-800 mb-4">{price}</p>
    <ul className="text-gray-600 mb-6 space-y-1">
      {features.map((feature, index) => (
        <li key={index}>✔ {feature}</li>
      ))}
    </ul>
    <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700">Choose Plan</button>
  </div>
);

// Reusable BenefitCard Component
const BenefitCard = ({ title, description, icon }) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow text-center border hover:shadow-md transition-all">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-teal-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default HospitalLandingPage;
