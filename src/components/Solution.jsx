import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import useCase1 from '../assets/apartmnet.jpg'; 
import useCase2 from '../assets/holiday.jpg'; 
import useCase3 from '../assets/hotels.jpg'; 
import useCase4 from '../assets/workplace.jpg'; 
import logo from '../assets/transev logo.png'; // Assuming you have a logo image
import logos from '../assets/up.png';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo1 from '../assets/tv.png';
import { Helmet } from "react-helmet";

function SolutionsPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null); // Track which image is hovered
  const [hoveredCircle, setHoveredCircle] = useState(null); // Track hover state of the yellow circle

  // Captions for the use cases
  const solutionCaptions = [
    "Home and Housing Societies",
    "Office and Workplace",
    "Public Places",
    "Fleet Organization"
  ];

  // Define the links for each image to navigate to based on their captions
  const caseLinks = {
    "Home and Housing Societies": "/solutions/home-and-housing-societies",
    "Office and Workplace": "/solutions/office-and-workplace",
    "Public Places": "/solutions/public-places",
    "Fleet Organization": "/solutions/fleet-organization",
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleImageClick = (link) => {
    navigate(link);
  };
useEffect(() => {
        window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
      }, []);
  return (
    <>
    <Helmet>
  <title>Charging Solutions | TransEV</title>
  <meta
    name="description"
    content="Explore TransEV's smart EV charging solutions for homes, workplaces, public places, and fleet organizations. Find the perfect solution for your use case."
  />
  <meta name="keywords" content="EV charging solutions, home charging, workplace charging, public charging stations, fleet EV charging, TransEV" />
  <link rel="canonical" href="https://transev.site/solutions" />

  {/* Open Graph / Facebook */}
  <meta property="og:title" content="Charging Solutions | TransEV" />
  <meta property="og:description" content="Discover smart EV charging solutions for every use case: home, workplace, public places, and fleet organizations." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://transev.site/solutions" />
  <meta property="og:image" content="https://transev.site/images/solutions-og.jpg" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Charging Solutions | TransEV" />
  <meta name="twitter:description" content="Find the ideal EV charging solution for homes, offices, public places, and fleets with TransEV." />
  <meta name="twitter:image" content="https://transev.site/images/solutions-og.jpg" />
  <meta name="robots" content="index, follow" />
</Helmet>

      {/* Navbar Component */}
      <Navbar />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div> 

      {/* Main Content Section */}
      <section className="text-center mt-[100px] px-[40px]">
    
      

        <h1 className="font-aeonik text-[50px] sm:text-[64px] md:text-[100px] lg:text-[130px] xl:text-[150px] mt-[60px] sm:mt-[90px] md:mt-[110px] lg:mt-[130px] xl:mt-[130px] text-center xl:text-left xl:mr-[400px]">
  Charging Solutions
</h1>

       
        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[20px] font-semibold mt-[150px] sm:mt-[180px] md:mt-[200px] lg:mt-[250px] xl:mt-[250px] text-center xl:text-left xl:mr-0">
  Pick Your Use Case
</h2>

      

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[30px] justify-center">
  {/* First row with larger images */}
  {[useCase1, useCase2].map((image, index) => (
    <div key={index} className="relative flex flex-col items-center mx-auto mt-[50px] group">
      <img
        src={image}
        alt={`Use Case ${index + 1}`}
        className="w-full h-[300px] sm:h-[400px] lg:h-[600px] xl:h-[700px] rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
        onClick={() => handleImageClick(caseLinks[solutionCaptions[index]])} // Clicking image navigates to a page based on caption
        onMouseEnter={() => setHovered(index)} // Hover effect
        onMouseLeave={() => setHovered(null)} // Reset hover state
      />
      <span className="mt-[20px] text-lg sm:text-2xl md:text-3xl font-semibold">{solutionCaptions[index]}</span>

    
    </div>
  ))}
</div>

{/* Second row with smaller images */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[30px] justify-center mt-[50px]">
  {[useCase3, useCase4].map((image, index) => (
    <div key={index + 2} className="relative flex flex-col items-center mx-auto mt-[50px] group">
      {/* Image Wrapper with relative positioning for absolute child */}
      <div className="relative w-full">
        <img
          src={image}
          alt={`Use Case ${index + 3}`}
          className="w-full h-[300px] sm:h-[400px] lg:h-[600px] xl:h-[700px] rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105 "
          onClick={() => handleImageClick(caseLinks[solutionCaptions[index + 2]])}
          onMouseEnter={() => setHovered(index + 2)}
          onMouseLeave={() => setHovered(null)}
        />

        
      </div>

      {/* Caption */}
      <span className="mt-[20px] text-lg sm:text-2xl md:text-3xl font-semibold">
        {solutionCaptions[index + 2]}
      </span>
    </div>
  ))}
</div>


    
<div className="bg-white py-16 mt-10">
  <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 space-y-10 md:space-y-0">
    
    {/* Left Side: Logo */}
    <div className="flex justify-center md:justify-start">
      <img
        src={logo1}
        alt="Company Logo"
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
      />
    </div>

    {/* Right Side: Contact Details */}
    <div className="text-center md:text-right w-full md:w-auto">
      
      {/* Phone Number */}
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-4">
        <a
          href="tel:+02033453310"
          className="hover:text-black transition-all duration-300"
        >
          <span className="hover:underline">033-4601 5366</span>
        </a>
      </div>

      {/* Email */}
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
        <a
          href="mailto:tgwbin@gmail.com"
          className="hover:text-black transition-all duration-300"
        >
          <span className="hover:underline ">tgwbin@gmail.com</span>
        </a>
      </div>
    </div>
  </div>



          {/* Underline Section */}
          <div className="mt-10 border-t-2 border-gray-300 mx-8"></div>

          <footer className="bg-white-800 text-black py-8 mt-20">
  <div className="container mx-auto px-6 md:px-10 lg:px-20">

    {/* Flex container for the first part (Logo & Client Portal) */}
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
      <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
        <h4 className="text-xl font-semibold mb-4">
          Pioneers in smart EV charging solutions <br />
        
        </h4>

        {/* Client Portal Button */}
        <a
          href="#"
          className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:scale-105 mt-4"
        >
          <span>Client portal</span>
          {/* Right Arrow Circle */}
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

      {/* Flex container for Navigation, Follow us, and Legal sections */}
      <div className="w-full md:w-2/3 flex flex-col md:flex-row justify-between space-y-10 md:space-y-0">
        
        {/* Navigation Section */}
        <div className="w-full md:w-auto">
          <h5 className="text-lg font-semibold text-color-black mb-5">Navigation</h5>
          <ul className="space-y-2">
            <li><a href="/solution" className="text-gray hover:underline text-lg">Solutions</a></li>
            <li><a href="/contact" className="text-gray hover:underline text-lg">Contact</a></li>
            <li><a href="/about" className="text-gray hover:underline text-lg">About</a></li>
           
          </ul>
        </div>

        {/* Follow Us Section */}
        {/* <div className="w-full md:w-auto">
          <h5 className="text-lg font-semibold mb-5">Follow us</h5>
          <ul className="space-y-2">
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
        </div> */}
        
                                <div className="mb-8 sm:mb-0 text-center sm:text-left">
          <h5 className="text-lg font-semibold mb-5">Follow us</h5>
          <ul className="space-y-2 inline-block sm:block">
            <li>
              <a href="https://x.com/transevIN?t=yJ30BdH5D7TME1ZZQiQisw&s=09" className="text-gray-600 hover:text-blue-500"> <svg
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
                                    </svg></a>
            </li>
            <li>
              <a href="https://www.instagram.com/__transmogrify__?igsh=MWRzY25tc2wzMnk1ag==" className="text-gray-600 hover:text-blue-500"><FaInstagram color="#E1306C" size={28}/></a>
            </li>
            <li>
              <a href="https://www.facebook.com/share/1NvgEQvwxG/" className="text-gray-600 hover:text-blue-500"><FaFacebook color="#1877F2" size={28} /></a>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="w-full md:w-auto">
          <h5 className="text-lg font-semibold mb-5">Legal</h5>
          <ul className="space-y-2">
            <li><a href="/terms-conditions" className="text-gray hover:underline text-lg">Terms & Conditions</a></li>
            <li><a href="/privacy-policy" className="text-gray hover:underline text-lg">Privacy Policy</a></li>
              <li><a href="/shipping-policy" className="text-gray hover:underline text-lg">Shipping Policy</a></li>
                        <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="flex justify-center items-center mt-8 text-lg lg:mr-[1060px]">
  <p>&copy; TransEV 2025. All Rights Reserved.</p>
</div>





  </div>
</footer>

        </div>
      </section>
    </>
  );
}

export default SolutionsPage;
