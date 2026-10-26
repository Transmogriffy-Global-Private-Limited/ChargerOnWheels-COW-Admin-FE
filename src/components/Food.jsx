import React from 'react';
import { FaHamburger, FaPizzaSlice, FaConciergeBell, FaUtensils, FaUsers, FaMapMarkedAlt, FaSearch, FaRegClock, FaCreditCard, FaRegComment, FaChartBar, FaTag, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from "react-helmet";
const FoodDeliveryPage = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="bg-gray-50">
         <Helmet>
        <title>Create Your Own Food Delivery Website | Custom Web Development</title>
        <meta name="description" content="We build fully customizable food delivery websites and applications to help restaurants and businesses scale. Contact us to start your project today!" />
        <link rel="canonical" href="https://www.yourwebsite.com/food-delivery" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Custom Food Delivery Website Development" />
        <meta property="og:description" content="Build your own food delivery platform with dynamic menus, real-time tracking, payment gateways, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yourwebsite.com/food-delivery" />
        <meta property="og:image" content="https://www.yourwebsite.com/images/food-delivery-og.jpg" />
<meta name="robots" content="index, follow" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Food Delivery Website Development" />
        <meta name="twitter:description" content="We create fully customizable food delivery apps to grow your business. Contact us today!" />
        <meta name="twitter:image" content="https://www.yourwebsite.com/images/food-delivery-og.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-orange-500 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Create Your Own Food Delivery Website</h1>
        <p className="text-lg mb-6">We build fully customizable food delivery applications to help you scale your business and improve customer experience.</p>
        <button 
          onClick={handleContactClick} 
          className="bg-white text-indigo-900 px-6 py-3 rounded-full text-xl hover:bg-indigo-800 hover:text-white transition-all"
        >
          Contact Us for Development
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-indigo-600 mb-12">Features of Our Food Delivery Website</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <FeatureCard 
            icon={<FaHamburger className="text-4xl text-indigo-600" />} 
            title="Custom Menu Management"
            description="Create and manage dynamic food menus with categories, pricing, and availability."
          />
          <FeatureCard 
            icon={<FaPizzaSlice className="text-4xl text-indigo-600" />} 
            title="Real-Time Order Tracking"
            description="Customers can track their order status, from kitchen to delivery."
          />
          <FeatureCard 
            icon={<FaConciergeBell className="text-4xl text-indigo-600" />} 
            title="Instant Notifications"
            description="Send push notifications to customers about order status, promotions, and offers."
          />
          <FeatureCard 
            icon={<FaUtensils className="text-4xl text-indigo-600" />} 
            title="Restaurant Dashboard"
            description="Restaurant owners can update menu, track orders, and manage inventory."
          />
          <FeatureCard 
            icon={<FaUsers className="text-4xl text-indigo-600" />} 
            title="User Profiles"
            description="Allow users to create profiles, save orders, and track their order history."
          />
          <FeatureCard 
            icon={<FaMapMarkedAlt className="text-4xl text-indigo-600" />} 
            title="Geolocation Services"
            description="Integrate geolocation to help customers find the nearest delivery options."
          />
          <FeatureCard 
            icon={<FaSearch className="text-4xl text-indigo-600" />} 
            title="Search & Filters"
            description="Enable customers to search menus, apply filters, and discover new restaurants."
          />
          <FeatureCard 
            icon={<FaRegClock className="text-4xl text-indigo-600" />} 
            title="Scheduled Delivery"
            description="Allow users to schedule their food delivery at their preferred time."
          />
          <FeatureCard 
            icon={<FaCreditCard className="text-4xl text-indigo-600" />} 
            title="Payment Gateway Integration"
            description="Secure payment gateways with multiple methods (Credit, Debit, Wallets, etc.)."
          />
          <FeatureCard 
            icon={<FaRegComment className="text-4xl text-indigo-600" />} 
            title="Rating & Reviews"
            description="Customers can rate restaurants and dishes, and leave feedback to improve service."
          />
          <FeatureCard 
            icon={<FaChartBar className="text-4xl text-indigo-600" />} 
            title="Admin Dashboard"
            description="Analytics and insights for managing orders, restaurant performance, and customer queries."
          />
          <FeatureCard 
            icon={<FaTag className="text-4xl text-indigo-600" />} 
            title="Coupons & Promo Codes"
            description="Enable discounts and offers to encourage repeat business and customer retention."
          />
          <FeatureCard 
            icon={<FaCommentDots className="text-4xl text-indigo-600" />} 
            title="Live Chat Support"
            description="Instant customer support via live chat for resolving issues and inquiries."
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 px-4 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-indigo-600 mb-12">Why Choose Us for Your Food Delivery Website?</h2>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            We provide cutting-edge features and solutions for building your food delivery platform. Whether you're a small restaurant or a large-scale business, we can tailor our solution to fit your needs and goals.
          </p>
          <button 
            onClick={handleContactClick} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-full text-xl hover:bg-indigo-700 transition-all"
          >
            Get a Quote for Your Project
          </button>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-indigo-600 text-white text-center py-20">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Ready to Start Your Food Delivery Project?</h2>
        <p className="text-lg mb-6">Let's create a custom food delivery website that suits your business perfectly. Get in touch with us to start your project today!</p>
        <button 
          onClick={handleContactClick} 
          className="bg-white text-indigo-900 px-6 py-3 rounded-full text-xl hover:bg-indigo-800 hover:text-white transition-all"
        >
          Contact Us Now
        </button>
      </section>
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-indigo-100 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-indigo-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default FoodDeliveryPage;
