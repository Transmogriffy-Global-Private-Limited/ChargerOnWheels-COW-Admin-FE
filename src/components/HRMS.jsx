import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaUserShield, FaRegLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
const HRMSPage = () => {
  const navigate = useNavigate();
  const [showDemoForm, setShowDemoForm] = useState(false);

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleDemoClick = () => {
    setShowDemoForm(true);
  };

  const closeModal = () => {
    setShowDemoForm(false);
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    // Add backend logic here if needed
    alert("Demo request submitted!");
    setShowDemoForm(false);
  };
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-100">
      <Helmet>
        <title>HRMS Software | Streamline HR, Payroll & Employee Management</title>
        <meta
          name="description"
          content="Manage your HR processes efficiently with our HRMS software. Employee management, payroll, attendance, recruitment, and more."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://transev.site/" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="HRMS Software | Streamline HR, Payroll & Employee Management" />
        <meta
          property="og:description"
          content="Empower your organization with a complete HRMS solution for employee management, payroll, attendance tracking, and recruitment."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/" />
        <meta property="og:image" content="https://transev.site/images/hrms-og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HRMS Software | Streamline HR, Payroll & Employee Management" />
        <meta
          name="twitter:description"
          content="Simplify HR management with our complete HRMS software. Manage employees, payroll, attendance, and recruitment easily."
        />
        <meta name="twitter:image" content="https://transev.site/images/hrms-og-image.jpg" />

        {/* Optional Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-teal-500 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Our HRMS Solutions</h1>
        <p className="text-lg mb-6">Empowering organizations with seamless HR management. Get started today!</p>
        <button className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all">Get Started</button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaUserShield className="text-4xl text-teal-500" />}
            title="Employee Management"
            description="Streamline employee records, performance, and tracking."
          />
          <FeatureCard
            icon={<FaRegLightbulb className="text-4xl text-teal-500" />}
            title="Payroll Management"
            description="Simplify payroll calculations and ensure compliance."
          />
          <FeatureCard
            icon={<FaPhoneAlt className="text-4xl text-teal-500" />}
            title="Attendance Tracking"
            description="Monitor attendance, working hours, and leaves effortlessly."
          />
        </div>
      </section>

      {/* Solutions and Services Section */}
      <section className="bg-white py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">Our Solutions & Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <SolutionCard
            title="Custom HR Solutions"
            description="We provide tailored HR solutions according to your company’s needs."
            actionText="Request Customization"
          />
          <SolutionCard
            title="Employee Benefits Management"
            description="Managing employee benefits made easy, including insurance and incentives."
            actionText="Learn More"
          />
          <SolutionCard
            title="Recruitment & Onboarding"
            description="Automate and streamline recruitment and onboarding processes."
            actionText="Start Now"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-teal-100 py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <Testimonial
            name="John Doe"
            position="HR Manager"
            company="TechCorp"
            feedback="This HRMS has completely revolutionized how we manage employee records. It's easy to use, efficient, and has saved us hours every week."
          />
          <Testimonial
            name="Jane Smith"
            position="CEO"
            company="FinanceCo"
            feedback="The custom HR solutions helped us streamline our processes and improve employee satisfaction. Great service and great results!"
          />
        </div>
      </section>

      {/* Contact/Inquiry Section */}
      <section className="py-20 px-4 sm:px-12 bg-teal-500 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Get in Touch</h2>
        <p className="text-lg mb-6">Have questions or need a custom solution? Contact us and let’s discuss how we can help!</p>
        <div className="space-x-4">
          <button
            onClick={handleContactClick}
            className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all"
          >
            Contact Us
          </button>
          <button
            onClick={handleDemoClick}
            className="bg-teal-700 px-6 py-3 rounded-full text-xl hover:bg-teal-600 transition-all"
          >
            Request a Demo
          </button>
        </div>
      </section>

      {/* Demo Request Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Request a Demo</h2>
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <textarea
                placeholder="What are you looking for?"
                rows="4"
                className="w-full border border-gray-300 rounded px-4 py-2"
              ></textarea>
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Reusable Solution Card Component
const SolutionCard = ({ title, description, actionText }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{title}</h3>
    <p className="text-gray-700 mb-4">{description}</p>
    <button className="bg-teal-500 text-white px-6 py-3 rounded-full text-lg hover:bg-teal-600 transition-all">{actionText}</button>
  </div>
);

// Reusable Testimonial Component
const Testimonial = ({ name, position, company, feedback }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs">
    <p className="text-xl italic text-gray-700 mb-4">"{feedback}"</p>
    <p className="font-semibold text-teal-500">{name}</p>
    <p className="text-sm text-gray-500">{position} at {company}</p>
  </div>
);

export default HRMSPage;
