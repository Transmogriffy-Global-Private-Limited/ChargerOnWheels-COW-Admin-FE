import React, { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from "react-helmet";


const SchoolManagementPage = () => {
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
  <div className="bg-gray-50 text-gray-900">

    {/* 🔍 SEO META TAGS */}
    <Helmet>
      <title>School Management Software | Streamline Your School Operations – TransEV</title>

      <meta
        name="description"
        content="TransEV provides smart school management software to handle student data, teachers, exams, fees, timetables, and parent communication efficiently."
      />

      <meta
        name="keywords"
        content="School Management Software, Student Management, Teacher Dashboard, Online Exams, School Timetable, Parent Portal, School ERP"
      />

      {/* Canonical */}
      <link
        rel="canonical"
        href="https://transev.site/school-management"
      />

      {/* Open Graph */}
      <meta property="og:title" content="School Management Software – TransEV" />
      <meta
        property="og:description"
        content="Manage your school smartly with our complete digital solution for administrators, teachers, and students."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://transev.site/school-management" />
      <meta
        property="og:image"
        content="https://transev.site/images/school-management-og.png"
      />
<meta name="robots" content="index, follow" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="School Management Software – TransEV" />
      <meta
        name="twitter:description"
        content="Streamline school operations, track students, manage teachers, exams, fees, and parent communication with our smart school management software."
      />
      <meta
        name="twitter:image"
        content="https://transev.site/images/school-management-og.png"
      />

      {/* Structured Data for SoftwareApplication */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "School Management Software",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "A complete school management solution for student tracking, teacher dashboards, exams, fees, and parent communication.",
          "provider": {
            "@type": "Organization",
            "name": "TransEV",
            "url": "https://transev.site"
          }
        }
        `}
      </script>
    </Helmet>
     

      {/* Hero Section */}
      <section className="bg-teal-600 text-white text-center py-20 px-4">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Manage Your School Smartly</h2>
        <p className="text-xl sm:text-2xl mb-6 max-w-2xl mx-auto">A complete digital solution for school administrators, teachers, and students to streamline operations and boost efficiency.</p>
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
          <FeatureCard title="Student Management" description="Track student data, grades, and attendance with ease." />
          <FeatureCard title="Teacher Dashboard" description="Enable teachers to manage classes, assignments, and reports." />
          <FeatureCard title="Online Exams & Results" description="Conduct assessments and publish results online securely." />
          <FeatureCard title="Timetable Automation" description="Smart scheduling tools for classes, exams, and events." />
          <FeatureCard title="Parent Portal" description="Keep parents informed with real-time updates on student progress." />
          <FeatureCard title="Finance & Fees" description="Automate fee collection, reports, and generate invoices." />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-100 py-20 px-4 sm:px-12">
        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-12">Affordable Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard plan="Starter" price="₹4,999/month" features={["Up to 200 Students", "Basic Modules", "Email Support"]} />
          <PricingCard plan="Professional" price="₹9,999/month" features={["Up to 1000 Students", "All Modules", "Priority Support"]} />
          <PricingCard plan="Enterprise" price="Custom" features={["Unlimited Students", "Custom Integrations", "Dedicated Manager"]} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-teal-600 text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">Have questions or need a custom solution for your school? Contact us today and let’s work together!</p>
        <a href="/contact" className="bg-yellow-400 text-teal-900 px-8 py-3 rounded-full text-xl hover:bg-yellow-500 transition-all">
          Contact Us
        </a>
      </section>

      {/* Modal */}
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
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Request Submitted!"); closeModal(); }}>
              <input type="text" placeholder="Your Name" required className="w-full border border-gray-300 rounded px-4 py-2" />
              <input type="email" placeholder="Email Address" required className="w-full border border-gray-300 rounded px-4 py-2" />
              <input type="text" placeholder="School Name" required className="w-full border border-gray-300 rounded px-4 py-2" />
              <textarea placeholder="What are you looking for?" className="w-full border border-gray-300 rounded px-4 py-2" rows="4" />
              <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 w-full">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all text-center border">
    <h3 className="text-xl font-semibold text-teal-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Pricing Card Component
const PricingCard = ({ plan, price, features }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all text-center border">
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

export default SchoolManagementPage;
