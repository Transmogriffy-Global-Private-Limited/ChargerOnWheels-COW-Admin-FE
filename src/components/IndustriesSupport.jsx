import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Navbar from './Navbar';
import { Link } from "react-router-dom";
import logo from '../assets/transev logo.png';
import { useNavigate } from 'react-router-dom';
import logos from '../assets/up.png'
import { Helmet } from 'react-helmet';
const IndustrialSupport = () => {
    const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
 const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Industrial Support Services | 24/7 Assistance for Your Business</title>
        <meta
          name="description"
          content="Get round-the-clock industrial support services to keep your operations running smoothly. Rapid response, expert guidance, and scalable solutions for all industries."
        />
        <link rel="canonical" href="https://transev.site/industrial-support" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Industrial Support Services | 24/7 Assistance for Your Business" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content="Our dedicated industrial support team provides 24/7 assistance for critical systems, rapid response, and scalable solutions for all industries."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/industrial-support" />
        <meta property="og:image" content="https://transev.site/images/industrial-support-og.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Industrial Support Services | 24/7 Assistance for Your Business" />
        <meta
          name="twitter:description"
          content="Keep your operations running smoothly with our expert industrial support services. Available 24/7 for rapid response and guidance."
        />
        <meta name="twitter:image" content="https://transev.site/images/industrial-support-og.jpg" />

        {/* Optional Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Navbar Section */}
      <Navbar />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div>

      {/* Header / Support Message */}
      <section className="py-16 bg-white px-5 md:px-20 lg:flex lg:items-center lg:mt-20">
        <div className="lg:w-1/2">
          <h1 className="text-8xl font-bold text-black-700 mb-2 "> 
        
 

            We're here to help
          </h1>
          <p className="text-gray-900 max-w-lg lg:mt-60 lg:text-3xl">
  Our dedicated industrial support team is available 24/7 to ensure your critical systems and operations run smoothly. We specialize in rapid response, expert guidance, and scalable solutions tailored to industrial challenges.
</p>

        </div>
       
      </section>

      {/* Industry Solutions Section */}
      <section className="py-20 px-10 bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-12">
          Our Other Solutions:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Solution Cards */}
          {solutions.map((item, idx) => (
            <div
              key={idx}
              className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50"
            >
              <Link to={item.link} className="block">
                <div className="text-6xl mb-4 text-gray-700">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-2">{item.subtitle}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-6 lg:px-20">
        <div className="container mx-auto text-left mb-10">
          <h2 className="text-2xl sm:text-xl lg:text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="border-t-2 border-gray-300 w-full mb-10"></div>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b-2 border-gray-300 pb-4 mt-8 sm:mt-10 lg:mt-12"
            >
              {/* Question Section */}
              <div className="flex justify-between items-start">
                {/* Number */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                    {`0${index + 1}`}
                  </span>
                </div>

                {/* Question Text */}
                <div className="flex-1 ml-6 sm:ml-10 lg:ml-16">
                  <span className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-medium">
                    {faq.question}
                  </span>
                </div>

                {/* Toggle Icon */}
                <div
                  className="flex items-center cursor-pointer ml-4"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <div
                    className={`flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full ${
                      activeIndex === index ? "bg-gray-300" : "bg-yellow-300"
                    }`}
                  >
                    {activeIndex === index ? (
                      <FaMinus className="text-black text-sm sm:text-base" />
                    ) : (
                      <FaPlus className="text-black text-sm sm:text-base" />
                    )}
                  </div>
                </div>
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <div className="mt-4 text-gray-600 text-base sm:text-lg lg:text-xl ml-6 sm:ml-10 lg:ml-16">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className="w-full h-screen bg-white flex justify-center items-center mt-10 sm:mt-20 md:mt-30 lg:mt-40">
              <div className="w-full h-full max-w-screen-3xl bg-gradient-to-r p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="w-full h-full bg-gradient-to-b from-yellow-200 via-yellow-200 to-red-300 rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-lg max-w-screen-3xl mx-auto">
                  {/* Heading */}
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-semibold text-gray-800 text-left font-aeonik">
                    <span className="mr-10 sm:mr-20 md:mr-40 lg:inline-block lg:mr-80">Ready to get</span><br />
                    <span className="sm:mr-10 md:mr-20 lg:mr-0 lg:inline-block">Started ?</span>
                  </h2>
      
                  {/* Contact Button */}
                  <div className="flex items-center justify-start mt-10 sm:mt-12 md:mt-14 lg:mt-20">
                    <button
                      id="contact-btn"
                      onClick={handleContactClick}
                      className="flex items-center justify-center px-8 sm:px-10 md:px-12 py-4 bg-white text-black font-semibold rounded-full transition-all duration-300 hover:bg-black hover:text-white w-auto h-auto"
                    >
                      <span className="mr-4 sm:mr-6 text-lg">Contact Us</span>
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white ml-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 sm:w-6 h-5 sm:h-6 text-white transition-transform duration-300 group-hover:text-black group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  </div>
      
                
     
      </div>
      </div>
      </div>
            {/* Footer */}
            <div className="bg-white-50 py-16 ml-20">
              <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-8">
                {/* Logo Section */}
                <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                  <img src={logos} alt="Company Logo" className="w-32 h-32" />
                </div>
      
                {/* Contact Section */}
                <div className="text-center sm:text-right">
                  <div className="text-3xl sm:text-5xl font-semibold text-gray-800 mb-4">
                    <a
                      href="tel:+02033453310"
                      className="relative inline-block hover:text-black-500"
                    >
                      <span className="hover:underline transition-all duration-300">033-4601 5366</span>
                    </a>
                  </div>
      
                  <div className="text-3xl sm:text-5xl font-semibold text-gray-800">
                    <a
                      href="mailto:tgwbin@gmail.com"
                      className="relative inline-block hover:text-black-500"
                    >
                      <span className="hover:underline transition-all duration-300 mt-2">tgwbin@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
      
              <div className="mt-10 border-t-2 border-gray-300 mx-8"></div>
              <footer className=" text-black py-8 mt-20">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between px-8">
                  {/* First Section - Experts and Client Portal */}
                  <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
                    <h4 className="text-xl sm:text-xl font-semibold mb-4">
                     Pioneers in smart EV charging solutions <br />
                 
                    </h4>
      
                    <a
                      href="#"
                      className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:scale-105"
                    >
                      <span>Client portal</span>
                      <div className="ml-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-10 group-hover:h-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
      
                  {/* Second Section - Navigation, Social Media, Legal Links */}
                  <div className="w-full sm:w-2/3 flex flex-col sm:flex-row justify-between sm:space-x-12 mt-10 sm:mt-0">
                    {/* Navigation Links */}
                    <div className="mb-8 sm:mb-0">
                      <h5 className="text-lg font-semibold mb-5">Navigation</h5>
                      <ul className="space-y-2">
                        <li><a href="/solution" className="text-gray hover:underline text-lg">Solutions</a></li>
                        <li><a href="/contact" className="text-gray hover:underline text-lg">Contact</a></li>
                        <li><a href="/about" className="text-gray hover:underline text-lg">About</a></li>
                       
                      </ul>
                    </div>
      
                    {/* Follow Us Links */}
                    <div className="mb-8 sm:mb-0">
                      <h5 className="text-lg font-semibold mb-5">Follow us</h5>
                      <ul className="space-y-2">
                        <li><a href="/linkedin" className="text-gray hover:underline text-lg">LinkedIn</a></li>
                        <li><a href="/instagram" className="text-gray hover:underline text-lg">Instagram</a></li>
                        <li><a href="/facebook" className="text-gray hover:underline text-lg">Facebook</a></li>
                      </ul>
                    </div>
      
                    {/* Legal Links */}
                    <div>
                      <h5 className="text-lg font-semibold mb-5">Legal</h5>
                      <ul className="space-y-2">
                        <li><a href="/terms-conditions" className="text-gray hover:underline text-lg">Terms & Conditions</a></li>
                        <li><a href="/privacy-policy" className="text-gray hover:underline text-lg">Privacy Policy</a></li>
                       
                      </ul>
                    </div>
                  </div>
                </div>
      
                {/* Footer Bottom Section */}
                <div className="text-center mt-8 text-lg lg:mr-300">
                  <p>&copy; TransEV 2025. All Rights Reserved.</p>
                </div>
              </footer>
            </div>
    </div>
  );
};

// FAQ Data
const faqs = [
  {
    question: "What kind of industries do you support?",
    answer:
      "We support a wide range of industries including healthcare, education, e-commerce, HR, CRM, and more.",
  },
  {
    question: "Is your support team available 24/7?",
    answer:
      "Yes, our Indian-based support team is available 24/7 to assist with your urgent needs.",
  },
  {
    question: "Can your solutions be customized to our business needs?",
    answer:
      "Absolutely. All our platforms are highly customizable based on your operational requirements.",
  },
  {
    question: "Do you offer on-site implementation?",
    answer:
      "Yes, we offer both remote and on-site implementation services depending on the project's scope.",
  },
  {
    question: "What technologies are your platforms built on?",
    answer:
      "We use modern technologies like React, Node.js, Python, and cloud solutions to ensure high performance and scalability.",
  },
];
const solutions = [
  {
    title: "HRMS Solutions for Modern Workforces",
    subtitle: "Human Resource Management System",
    icon: "👨‍💼",
    link: "/hrms",
  },
  {
    title: "Smart Administrative Platform for Educational Institutions",
    subtitle: "Online Learning Platform",
    icon: "🎓",
    link: "/education",
  },
  {
    title: "Elevating Patient Care with Integrated Hospital Management",
    subtitle: "Health Services and Resources",
    icon: "🩺",
    link: "/health",
  },
  {
    title: "CareerConnect Platform",
    subtitle: "Job Listings and Applications",
    icon: "💼",
    link: "/job",
  },
  {
    title: "PowerFlow Management",
    subtitle: "Charging Management System",
    icon: "📄",
    link: "/charger",
  },
  {
    title: "E-Shopper",
    subtitle: "Online Store Platform",
    icon: "🛒",
    link: "/e-com",
  },
  {
    title: "ParkEase",
    subtitle: "Parking Space Management",
    icon: "🚗",
    link: "/park",
  },
  {
    title: "Food Application Platform",
    subtitle: "Food Delivery & Ordering",
    icon: "🍔",
    link: "/food",
  },
  {
    title: "Customer Onboarding",
    subtitle: "Customer Relationship Management System",
    icon: "📊",
    link: "/crm",
  },
];

export default IndustrialSupport;
