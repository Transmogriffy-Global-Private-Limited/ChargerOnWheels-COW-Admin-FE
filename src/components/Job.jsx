import React from "react";
import { FaBriefcase, FaBullhorn, FaUsers, FaSearch, FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Helmet } from "react-helmet";
const JobPortalServicesPage = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact"); // Navigate to contact page where clients can inquire about services.
  };
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-100">
 {/* SEO Meta Tags */}
      <Helmet>
        <title>Custom Job Portal Services | Tailored Recruitment Solutions</title>
        <meta
          name="description"
          content="Build your custom job portal with us. Tailored, scalable, and efficient recruitment solutions to streamline your hiring process."
        />
        <link rel="canonical" href="https://transev.site/job-portal-services" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Custom Job Portal Services | Tailored Recruitment Solutions" />
        <meta
          property="og:description"
          content="Empower your recruitment process with a personalized job portal. Scalable solutions with custom design, integrations, and analytics."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/job-portal-services" />
        <meta property="og:image" content="https://transev.site/images/job-portal-og.jpg" />
<meta name="robots" content="index, follow" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Job Portal Services | Tailored Recruitment Solutions" />
        <meta
          name="twitter:description"
          content="Build a custom job portal for your organization with seamless design, integrations, and analytics."
        />
        <meta name="twitter:image" content="https://transev.site/images/job-portal-og.jpg" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-teal-500 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Build Your Custom Job Portal with Us</h1>
        <p className="text-lg mb-6">
          Empower your recruitment process with a tailored job portal that fits your company's needs. 
          Let us create a seamless, scalable, and efficient solution for your hiring.
        </p>
        <button 
          onClick={handleContactClick}
          className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all">
          Contact Us Today
        </button>
      </section>

      {/* Portal Features Section */}
      <section className="py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          Features of Our Job Portal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaBriefcase className="text-4xl text-teal-500" />} 
            title="Custom Job Listings" 
            description="Post tailored job openings with specific fields and job descriptions."
          />
          <FeatureCard 
            icon={<FaBullhorn className="text-4xl text-teal-500" />} 
            title="Automatic Job Distribution" 
            description="Automatically distribute job listings to major job boards and social media."
          />
          <FeatureCard 
            icon={<FaUsers className="text-4xl text-teal-500" />} 
            title="Manage Candidates" 
            description="Easily track and manage applicants with an intuitive dashboard."
          />
        </div>
      </section>

      {/* Custom Portal Solutions */}
      <section className="bg-white py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          Tailored Solutions for Your Company
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <SolutionCard 
            title="Personalized Portal Design"
            description="Custom branding and design to match your company’s identity."
            actionText="Get a Custom Quote"
          />
          <SolutionCard 
            title="Advanced Reporting & Analytics"
            description="Track application trends, candidate performance, and more with powerful reports."
            actionText="Request a Demo"
          />
          <SolutionCard 
            title="Seamless Integrations"
            description="Integrate with HR tools, applicant tracking systems, and more."
            actionText="Explore Integrations"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-12 bg-teal-100">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-teal-500 mb-12">
          How Our Job Portal Works for Employers
        </h2>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <HowItWorksCard
            step="Step 1"
            title="Create Your Account"
            description="Sign up for a personalized account to start customizing your portal."
          />
          <HowItWorksCard
            step="Step 2"
            title="Post Job Listings"
            description="Post your available job openings and configure them to your requirements."
          />
          <HowItWorksCard
            step="Step 3"
            title="Review & Manage Applications"
            description="Track and manage candidates using an easy-to-use dashboard."
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
            name="Michael Lee"
            position="CEO"
            company="Tech Innovators"
            feedback="The job portal we received has transformed our recruitment process, making it faster and more efficient."
          />
          <Testimonial
            name="Sara Blake"
            position="HR Director"
            company="Global Solutions"
            feedback="The ease of managing applications and the customization options made it the perfect tool for our team."
          />
        </div>
      </section>

      {/* Contact/Inquiry Section */}
      <section className="py-20 px-4 sm:px-12 bg-teal-500 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Get Started Today</h2>
        <p className="text-lg mb-6">
          Interested in building a custom job portal for your organization? Let’s talk and make it happen!
        </p>
        <button
          onClick={handleContactClick}
          className="bg-yellow-500 text-teal-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all"
        >
          Contact Us
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

// Reusable Solution Card Component
const SolutionCard = ({ title, description, actionText }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{title}</h3>
    <p className="text-gray-700 mb-4">{description}</p>
    <button className="bg-teal-500 text-white px-6 py-3 rounded-full text-lg hover:bg-teal-600 transition-all">{actionText}</button>
  </div>
);

// Reusable How It Works Card Component
const HowItWorksCard = ({ step, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-teal-100 transition-all">
    <h3 className="text-2xl font-semibold text-teal-500 mb-2">{step}: {title}</h3>
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

export default JobPortalServicesPage;
