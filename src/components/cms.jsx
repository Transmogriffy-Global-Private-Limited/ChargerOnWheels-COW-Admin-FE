import React from "react";
import { FaCog, FaChartLine, FaDollarSign, FaSyncAlt, FaUserShield,FaUsers, FaPlug,FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Helmet } from "react-helmet";
const ChargingManagementPage = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact"); // Navigate to contact page for inquiries
  };
 useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-50">
 <Helmet>
         <title>Advanced Charging Management System | Smart EV Billing & Payments</title>

         <meta
          name="description"
          content="Advanced Charging Management System for EV businesses. Automate billing, manage chargers, optimize revenue, and integrate seamless payment solutions."
        />

        <meta
          name="keywords"
          content="Charging Management System, EV Charging Software, EV Billing System, Charger Management, EV Payment Platform"
        />
<meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/charging-management" />

        {/* Open Graph */}
        <meta property="og:title" content="Advanced Charging Management System" />
        <meta
          property="og:description"
          content="Automated EV charging, billing, analytics, and payment management platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/charging-management" />
        <meta property="og:image" content="https://yourdomain.com/images/charging-management.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Charging Management System" />
        <meta
          name="twitter:description"
          content="Smart EV charging management with real-time analytics and automated billing."
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/charging-management.png" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Charging Management System",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "EV Charging Management System with automated billing, real-time analytics, and payment integration.",
            "offers": {
              "@type": "Offer",
              "price": "Contact for pricing",
              "priceCurrency": "INR"
            }
          }
          `}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="bg-teal-500 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Advanced Charging Management System</h1>
        <p className="text-lg mb-6">
          Unlock the power of automated charging, detailed billing, and streamlined payment management for your business. 
          Take control of your revenue model with our cutting-edge CMS.
        </p>
        <button 
          onClick={handleContactClick}
          className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all">
          Contact Us for Demo
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          Key Features of Our Charging Management System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaCreditCard className="text-4xl text-teal-500" />} 
            title="Fleet Management" 
            description="Create dynamic pricing models to fit your business needs and maximize revenue."
          />
          <FeatureCard 
            icon={<FaChartLine className="text-4xl text-teal-500" />} 
            title="Real-Time Analytics" 
            description="Monitor charging usage, trends, and revenue generation with intuitive reports."
          />
          <FeatureCard 
            icon={<FaSyncAlt className="text-4xl text-teal-500" />} 
            title="Seamless Integration" 
            description="Easily integrate with existing payment gateways and third-party systems."
          />
           <FeatureCard 
            icon={<FaUsers className="text-4xl text-teal-500" />} 
            title="User Management" 
            description="Manage users efficiently with role-based access control, user authentication, and permission settings."
          />
          <FeatureCard 
            icon={<FaPlug className="text-4xl text-teal-500" />} 
            title="Charger Management" 
            description="Monitor, control, and manage the status of each charging station in real-time to ensure availability."
          />
        </div>
  
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          How Our Charging Management System Works
        </h2>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <HowItWorksCard
            step="Step 1"
            title="Custom Pricing Setup"
            description="Set up custom pricing for your charging services to cater to different customer needs."
          />
          <HowItWorksCard
            step="Step 2"
            title="Automatic Billing"
            description="Our system automates the entire billing process based on usage and pricing rules."
          />
          <HowItWorksCard
            step="Step 3"
            title="Easy Payment Collection"
            description="Collect payments seamlessly with integrated payment gateways and multi-currency support."
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-12 bg-teal-100">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          Benefits for Your Business
        </h2>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <BenefitCard
            title="Revenue Optimization"
            description="Maximize your charging revenue with flexible pricing models and real-time insights."
          />
          <BenefitCard
            title="Operational Efficiency"
            description="Automate manual tasks and reduce human error with a streamlined charging and billing process."
          />
          <BenefitCard
            title="Enhanced Customer Experience"
            description="Offer customers a seamless and transparent payment experience with detailed invoices."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-teal-100 py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          What Our Clients Say
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <Testimonial
            name="Robert Davis"
            position="CFO"
            company="EnergyCorp"
            feedback="This charging management system has transformed how we handle billing and payments, improving efficiency and reducing operational costs."
          />
          <Testimonial
            name="Emily Carter"
            position="Operations Manager"
            company="EcoCharge"
            feedback="The platform’s flexibility allows us to tailor pricing based on customer needs, giving us a competitive edge."
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-12 bg-teal-500 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-6">
          Discover how our Charging Management System can help you automate your operations, boost revenue, and offer a better service to your customers.
        </p>
        <button
          onClick={handleContactClick}
          className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all"
        >
          Request a Demo
        </button>
      </section>

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

// Reusable How It Works Card Component
const HowItWorksCard = ({ step, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{step}: {title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Reusable Benefit Card Component
const BenefitCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
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

export default ChargingManagementPage;
