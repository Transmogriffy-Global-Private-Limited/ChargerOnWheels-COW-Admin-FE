import { FaShoppingCart, FaGift, FaTruck, FaUsers, FaClipboardList, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import { useEffect } from 'react';
import { Helmet } from "react-helmet";

const EcommercePage = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Function to handle "Contact Us" button click
  const handleContactClick = () => {
    navigate('/contact');  // Redirect to the contact page
  };
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
 return (
  <div className="bg-gray-50">

    {/* 🔍 SEO META TAGS */}
    <Helmet>
      <title>Custom E-commerce Solutions | Build Your Online Store – TransEV</title>

      <meta
        name="description"
        content="TransEV offers custom e-commerce solutions to build scalable online stores. Manage products, orders, shipping, and promotions effortlessly."
      />
<meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content="Custom E-commerce Development, Online Store Solutions, E-commerce Platform India, Sell Online, Bulk Orders"
      />

      {/* Canonical */}
      <link
        rel="canonical"
        href="https://transev.site/ecommerce"
      />

      {/* Open Graph */}
      <meta property="og:title" content="Custom E-commerce Solutions – TransEV" />
      <meta
        property="og:description"
        content="Build your own e-commerce platform with features like product management, bulk orders, promotions, and shipping tracking."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://transev.site/ecommerce" />
      <meta
        property="og:image"
        content="https://transev.site/images/ecommerce-og.png"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Custom E-commerce Solutions – TransEV" />
      <meta
        name="twitter:description"
        content="Create a scalable online store with our custom e-commerce solutions. Manage products, orders, customers, and shipping efficiently."
      />
      <meta
        name="twitter:image"
        content="https://transev.site/images/ecommerce-og.png"
      />

      {/* Structured Data for SoftwareApplication */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Custom E-commerce Platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Custom-built e-commerce platform to manage products, orders, customers, shipping, and promotions.",
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
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">E-commerce Solutions Tailored for Your Business</h1>
        <p className="text-lg mb-6">Explore our advanced e-commerce platform designed to scale with your business.</p>
        <button className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-full text-xl hover:bg-yellow-600 transition-all">
          Start Selling Today
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-12 bg-white">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-12">
          Key Features of Our E-commerce Platform
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaShoppingCart className="text-4xl text-blue-600" />} 
            title="Bulk Ordering" 
            description="Allow customers to place large volume orders with special pricing and discounts."
          />
          <FeatureCard 
            icon={<FaGift className="text-4xl text-blue-600" />} 
            title="Promotions & Discounts" 
            description="Set up promotional offers and time-limited discounts to boost sales."
          />
          <FeatureCard 
            icon={<FaTruck className="text-4xl text-blue-600" />} 
            title="Shipping Management" 
            description="Track and manage shipping options, costs, and delivery times with ease."
          />
          <FeatureCard 
            icon={<FaUsers className="text-4xl text-blue-600" />} 
            title="Customer Management" 
            description="Manage customer accounts, preferences, and order history seamlessly."
          />
          <FeatureCard 
            icon={<FaClipboardList className="text-4xl text-blue-600" />} 
            title="Order Tracking" 
            description="Let customers track their orders in real-time with live updates."
          />
        </div>
      </section>

      {/* Seller Features Section */}
      <section className="py-20 px-4 sm:px-12 bg-blue-100">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-12">
          Seller Features: Manage Your Store & Products Effortlessly
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon={<FaStore className="text-4xl text-blue-600" />} 
            title="Set Up Your Storefront" 
            description="Easily create and customize your storefront to showcase your products."
          />
          <FeatureCard 
            icon={<FaClipboardList className="text-4xl text-blue-600" />} 
            title="Product Catalog Management" 
            description="Add, manage, and update product listings effortlessly from your dashboard."
          />
          <FeatureCard 
            icon={<FaGift className="text-4xl text-blue-600" />} 
            title="Discounts & Promotions" 
            description="Create your own promotions, special discounts, and coupon codes for your customers."
          />
          <FeatureCard 
            icon={<FaTruck className="text-4xl text-blue-600" />} 
            title="Order & Shipment Tracking" 
            description="Track and manage your orders and shipments in real-time for efficient delivery."
          />
          <FeatureCard 
            icon={<FaUsers className="text-4xl text-blue-600" />} 
            title="Customer Insights" 
            description="Gain valuable insights into customer behavior, sales trends, and more."
          />
        </div>
      </section>

      {/* Bulk Order Section */}
      <section className="py-20 px-4 sm:px-12 bg-blue-50">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-12">
          Manage Bulk Orders with Ease
        </h2>
        <div className="text-center mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Our platform makes it easy for businesses to handle bulk orders with special discounts, pricing tiers, and custom shipping options.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl hover:bg-blue-700 transition-all">
            Learn More About Bulk Ordering
          </button>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 sm:px-12 bg-white">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-12">
          Want to Build a Custom E-commerce Website?
        </h2>
        <div className="text-center mb-10">
          <p className="text-lg text-gray-700 mb-4">
            If you're looking to create a custom e-commerce platform tailored to your business needs, we can help! Our expert team is ready to design and develop a fully integrated solution for your business.
          </p>
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl hover:bg-blue-700 transition-all"
            onClick={handleContactClick}  // Adding the onClick event to redirect to the contact page
          >
            Contact Us to Get Started
          </button>
        </div>
      </section>

    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-blue-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default EcommercePage;
