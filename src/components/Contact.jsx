import React, { useState } from 'react';
import Navbar from './Navbar';
import logo from '../assets/transev logo.png';
import contactImage from '../assets/Office.png';
 import { useEffect } from 'react';
 import logos from '../assets/up.png'
// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo1 from '../assets/tv.png';
import { Helmet } from "react-helmet";

const ContactPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    telephone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = () => setIsChecked(!isChecked);


const handleSubmit = async (event) => {
  event.preventDefault();

  const errors = {};
  const requiredFields = ['firstname', 'lastname', 'email', 'message'];

  requiredFields.forEach((field) => {
    if (!formData[field]) errors[field] = `${field} is required`;
  });

  if (!isChecked) errors.privacy = 'You must agree with the privacy statement';

  setFormErrors(errors);

  if (Object.keys(errors).length === 0) {
    try {
      const res = await fetch(`${BASE_URL_AND_PORT}/contact/contactus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          telephone: formData.telephone,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Message sent successfully! We will get back to you soon.');
        
        // Reset the form
        setFormData({
          firstname: '',
          lastname: '',
          telephone: '',
          email: '',
          message: '',
        });
        setIsChecked(false);
        setFormErrors({});
        window.scrollTo(0, 0);
      } else {
        alert('Submission failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  }
};
useEffect(() => {
     window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
   }, []);
  return (
    <div className="min-h-screen bg-white">
   

    {/* 🔍 SEO META TAGS */}
    <Helmet>
      <title>Contact Us | TransEV – Smart EV Charging Solutions</title>

      <meta
        name="description"
        content="Contact TransEV for smart EV charging solutions, charging management systems, and EV infrastructure support. Get in touch with our expert team today."
      />

      <meta
        name="keywords"
        content="Contact TransEV, EV Charging Solutions Contact, EV Charging Company India, TransEV Support"
      />
<meta name="robots" content="index, follow" />
      {/* Canonical */}
      <link
        rel="canonical"
        href="https://transev.site/contact"
      />

      {/* Open Graph */}
      <meta property="og:title" content="Contact TransEV – EV Charging Solutions" />
      <meta
        property="og:description"
        content="Reach out to TransEV for EV charging software, charging management systems, and smart EV infrastructure."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://transev.site/contact" />
      <meta
        property="og:image"
        content="https://transev.site/images/contact-og.png"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Contact TransEV – Smart EV Charging" />
      <meta
        name="twitter:description"
        content="Get in touch with TransEV for EV charging management and infrastructure solutions."
      />
      <meta
        name="twitter:image"
        content="https://transev.site/images/contact-og.png"
      />

      {/* Local Business Structured Data */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TransEV",
          "url": "https://transev.site",
          "logo": "https://transev.site/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7908003488",
            "contactType": "customer support",
            "areaServed": "IN",
            "availableLanguage": ["English"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "MANI CASADONA, UNIT 10ES6, Action Area IIF",
            "addressLocality": "Kolkata",
            "postalCode": "700156",
            "addressCountry": "IN"
          }
        }
        `}
      </script>
    </Helmet>

      <Navbar />
      <div className="border-b-4 border-yellow-400 w-full"></div>

      {/* Title */}
      <div className="flex items-center justify-start px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 lg:mt-40">
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-aeonik text-gray-900 animate__animated animate__fadeIn animate__delay-1s mr-0 md:mr-16 lg:mr-24 whitespace-nowrap">
          Get in touch
        </h2>
      </div>

      <section className="px-4 md:px-16 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 flex flex-col space-y-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-700">
              If you have any question or you'd like to find out more about our services, please get in touch.
            </p>

            <div className="text-base md:text-lg">
              <h4 className="font-bold mb-2">Contact Details:</h4>
              <p className="text-gray-600 mb-2">Office Address:</p>
              <p className="text-gray-600 mb-2">
                MANI CASADONA, UNIT - 10ES6, IIF/04, STREET NO.372, ACTION AREA-IIF, NEWTOWN, RAJARHAT, KOLKATA - 700156, WEST BENGAL, INDIA
              </p>
              <p className="text-gray-600 mb-2">LANDMARK: OPPOSITE ECOSPACE BUSINESS PARK</p>
              <p className="text-bold-900 mb-2">Tel: 033-4601 5366 / +91 79080 03488</p>
              <p className="text-bold-900">Email: <a href="mailto:tgwbin@gmail.com" className="underline">tgwbin@gmail.com </a></p>
              {/* <p className="font-bold-900">
  Email: 
  <a href="mailto:tgwbin@gmail.com" className="underline ml-1">tgwbin@gmail.com</a>
  <span> / </span>
  <a href="mailto:chakrapanimondal@tgplin.com" className="underline">chakrapanimondal@tgplin.com</a>
</p> */}

            </div>

            <img src={contactImage} alt="Contact" className="rounded-lg shadow-md w-full h-auto mt-4" />
          </div>

          {/* Right Content - Form */}
          <div className="lg:w-1/2 w-full bg-gradient-to-r from-yellow-100 via-white-400 to-pink-100 p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="mb-5">
                <label htmlFor="firstname" className="block text-gray-900 font-medium mb-1">First Name*</label>
                <input
                  type="text"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.firstname ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.firstname && <p className="text-sm text-red-500">{formErrors.firstname}</p>}
              </div>

              {/* Last Name */}
              <div className="mb-5">
                <label htmlFor="lastname" className="block text-gray-900 font-medium mb-1">Last Name*</label>
                <input
                  type="text"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.lastname ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.lastname && <p className="text-sm text-red-500">{formErrors.lastname}</p>}
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-gray-900 font-medium mb-1">Email*</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
              </div>

              {/* Telephone */}
              <div className="mb-5">
                <label htmlFor="telephone" className="block text-gray-900 font-medium mb-1">Telephone*</label>
                <input
                  type="text"
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.telephone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.telephone && <p className="text-sm text-red-500">{formErrors.telephone}</p>}
              </div>

              {/* Message Textarea */}
              <div className="mb-5">
                <label htmlFor="message" className="block text-gray-900 font-medium mb-1">Please tell us a bit about your requirements*</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full p-3 border rounded-md ${formErrors.message ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {formErrors.message && <p className="text-sm text-red-500">{formErrors.message}</p>}
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5"
                />
                {/* <label htmlFor="privacy" className="ml-2 text-gray-900 text-sm sm:text-base">I agree with the privacy statement</label> */}
             <label htmlFor="privacy" className="ml-2 text-gray-900 text-sm sm:text-base">
  I agree with the
  <a
    href="privacy-policy"  // Replace with the actual link to your privacy page
    className="text-blue-500 hover:text-blue-700 group inline ml-2"
  >
    <span className="group-hover:underline">privacy statement</span>
  </a>
</label>


              </div>
              {formErrors.privacy && <p className="text-sm text-red-500 mb-4">{formErrors.privacy}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-white font-bold text-lg rounded-full hover:bg-yellow-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="bg-white py-16 mt-15">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Left Side: Logo */}
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <img src={logo1} alt="Company Logo" className="w-32 h-32" />
            </div>

            {/* Right Side: Phone and Email */}
            <div className="text-center lg:text-right">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
                <a href="tel:+02033453310" className="hover:underline transition duration-300">
                  033-4601 5366
                </a>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-gray-800">
                <a href="mailto:tgwbin@gmail.com" className="hover:underline transition duration-300">
                  tgwbin@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t-2 border-gray-300"></div>
    
     {/* Footer Links */}
     <footer className="text-black py-10">
       <div className="flex flex-col lg:flex-row justify-between gap-12">
         {/* Left description */}
         <div className="lg:w-1/3">
           <h4 className="text-lg sm:text-xl font-semibold mb-4">
            Pioneers in smart EV charging solutions<br />
            
           </h4>
           <a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 mt-6"
          >
            <span>Client portal</span>
            <div className="ml-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Navigation Sections */}
        <div className="lg:w-2/3 flex flex-col sm:flex-row justify-between gap-10">
          {/* Navigation */}
          <div>
            <h5 className="text-base sm:text-lg font-semibold mb-4">Navigation</h5>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/solution" className="hover:underline">Solutions</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
            
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h5 className="text-base sm:text-lg font-semibold mb-4">Follow us</h5>
            <ul className="space-y-2 text-sm sm:text-base">
               <li>
              <a
                href="https://x.com/transevIN?t=yJ30BdH5D7TME1ZZQiQisw&s=09"
                className="text-gray hover:underline text-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="28"
                  height="28"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
            </li>
                       <li><a href="https://www.instagram.com/__transmogrify__?igsh=MWRzY25tc2wzMnk1ag==" className="text-gray hover:underline text-lg"> <FaInstagram color="#E1306C" size={28} /></a></li>
                       <li><a href="https://www.facebook.com/share/1NvgEQvwxG/" className="text-gray hover:underline text-lg"> <FaFacebook color="#1877F2" size={28} /></a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-base sm:text-lg font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/terms-conditions" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                 <li><a href="/shipping-policy" className="text-gray hover:underline text-lg">Shipping Policy</a></li>
                        <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds</a></li>

            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-gray-500 text-sm sm:text-base">
        <p>&copy; TransEV 2025. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</div>
</div>

  );
};

export default ContactPage;
