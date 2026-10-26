import React from 'react';
import { FaCar, FaCalendarCheck, FaMapMarkerAlt, FaDollarSign, FaClipboardCheck } from 'react-icons/fa';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
const ParkingManagementPage = () => {
  useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-50">
   {/* SEO Meta Tags */}
      <Helmet>
        <title>Parking Management System | Efficient Parking Solutions</title>
        <meta
          name="description"
          content="Manage parking spaces efficiently with our Parking Management System. Real-time availability, reservations, payments, and analytics for hassle-free parking."
        />
        <link rel="canonical" href="https://transev.site/parking-management" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Parking Management System | Efficient Parking Solutions" />
        <meta property="og:description" content="Manage parking spaces efficiently with our Parking Management System. Real-time availability, reservations, payments, and analytics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/parking-management" />
        <meta property="og:image" content="https://transev.site/images/parking-management-og.jpg" />
<meta name="robots" content="index, follow" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Parking Management System | Efficient Parking Solutions" />
        <meta name="twitter:description" content="Manage parking spaces efficiently with our Parking Management System. Real-time availability, reservations, payments, and analytics." />
        <meta name="twitter:image" content="https://transev.site/images/parking-management-og.jpg" />

        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-green-600 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Parking Management System</h1>
        <p className="text-lg mb-6">Efficiently manage parking spaces, reservations, and payments in real-time.</p>
        <button className="bg-yellow-500 text-green-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all">
          Start Parking Today
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-12 bg-white">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-green-600 mb-12">
          Key Features of Our Parking Management System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaCar className="text-4xl text-green-600" />} 
            title="Real-Time Parking Availability" 
            description="Monitor available parking spots in real-time and prevent overcrowding."
          />
          <FeatureCard 
            icon={<FaCalendarCheck className="text-4xl text-green-600" />} 
            title="Reservation Management" 
            description="Allow customers to reserve parking spots in advance and manage bookings."
          />
          <FeatureCard 
            icon={<FaMapMarkerAlt className="text-4xl text-green-600" />} 
            title="Location Tracking" 
            description="Track the location of available parking spots and guide customers to them."
          />
          <FeatureCard 
            icon={<FaDollarSign className="text-4xl text-green-600" />} 
            title="Payment Integration" 
            description="Easily integrate payment methods for secure and smooth transactions."
          />
          <FeatureCard 
            icon={<FaClipboardCheck className="text-4xl text-green-600" />} 
            title="Parking Spot Analytics" 
            description="View usage trends, revenue, and occupancy statistics for better decision-making."
          />
        </div>
      </section>

      {/* Parking Reservation Section */}
      <section className="py-20 px-4 sm:px-12 bg-green-50">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-green-600 mb-12">
          Reserve Your Parking Spot in Advance
        </h2>
        <div className="text-center mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Our system allows users to reserve parking spots ahead of time, ensuring a hassle-free parking experience when they arrive.
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-full text-xl hover:bg-green-700 transition-all">
            Reserve Now
          </button>
        </div>
      </section>

      {/* Admin Features Section */}
      <section className="py-20 px-4 sm:px-12 bg-white">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-green-600 mb-12">
          Admin Features: Manage Parking Operations Efficiently
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaCar className="text-4xl text-green-600" />} 
            title="Monitor Parking Spaces" 
            description="Admin can track parking space occupancy and availability in real-time."
          />
          <FeatureCard 
            icon={<FaCalendarCheck className="text-4xl text-green-600" />} 
            title="Manage Reservations" 
            description="Admins can approve, cancel, or modify reservations with a simple interface."
          />
          <FeatureCard 
            icon={<FaDollarSign className="text-4xl text-green-600" />} 
            title="Track Payments" 
            description="Easily view and manage all parking payments made by customers."
          />
          <FeatureCard 
            icon={<FaMapMarkerAlt className="text-4xl text-green-600" />} 
            title="Location Updates" 
            description="Keep track of parking locations and update availability on the go."
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-12 bg-green-100 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-green-600 mb-12">
          Want to Build Your Own Parking Management System?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Our expert team can help you develop a fully integrated parking management system tailored to your needs.
        </p>
        <button 
          className="bg-green-600 text-white px-6 py-3 rounded-full text-xl hover:bg-green-700 transition-all"
          onClick={() => window.location.href = '/contact'}
        >
          Contact Us to Get Started
        </button>
      </section>

    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-green-50 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-green-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default ParkingManagementPage;
