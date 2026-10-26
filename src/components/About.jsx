

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FaArrowDown, FaBolt, FaCheckCircle, FaLeaf, FaHandHoldingHeart, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

// Import images
import about1 from '../assets/aboutbg.jpg';
import about2 from '../assets/slide1.jpg';
import logo from '../assets/transev logo.png';
import holiday from '../assets/holiday.jpg';
import hero from '../assets/heroabout.jpg';
import mission from '../assets/mission.png';
import vision from '../assets/vission.png';
import value from '../assets/value.png';
import mission1 from '../assets/mission1.png';
import logos from '../assets/up.png';
import transevImage from '../assets/transev.jpg';
import logo1 from '../assets/tv.png';

function AboutUs() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    const button = document.getElementById('contact-btn');
    button.classList.add('bg-yellow-500');

    setTimeout(() => {
      navigate('/contact');
    }, 500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>About Us | TransEV – Accessible EV Charging Solutions</title>
        <meta name="description" content="Learn about TransEV's mission, vision, and values. We provide accessible and sustainable EV charging solutions for everyone." />
        <meta name="keywords" content="EV charging, electric vehicles, sustainable energy, green technology, TransEV, EV solutions" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="About Us | TransEV – Accessible EV Charging Solutions" />
        <meta property="og:description" content="Learn about TransEV's mission, vision, and values. We provide accessible and sustainable EV charging solutions for everyone." />
        <meta property="og:image" content={hero} />
        <meta property="og:url" content="https://www.transev.site/about" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | TransEV – Accessible EV Charging Solutions" />
        <meta name="twitter:description" content="Learn about TransEV's mission, vision, and values. We provide accessible and sustainable EV charging solutions for everyone." />
        <meta name="twitter:image" content={hero} />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div> 
      <section className="text-center mt-[100px] sm:mt-[80px] md:mt-[100px] lg:mt-[160px] px-6 sm:px-8 md:px-12 lg:px-[50px]">
   
    
 {/* <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-aeonik text-black-800 mt-10 sm:mt-16 lg:mt-20 px-4 sm:px-10 lg:px-32 xl:px-40 text-center lg:text-left  "> */}
 <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-aeonik text-black-800 mt-10 sm:mt-16 lg:mt-20 px-4 sm:px-10 lg:px-32 xl:px-10 text-left">

 Facilitating fairer,more  <br />
 <span className="inline-block">accessible</span>
 <span className="hidden sm:inline-block sm:ml-2 md:ml-4">EV charging</span>


</h1>
 <h4 
  className="text-[30px] sm:text-[35px] md:text-[40px] lg:text-[50px] font-aeonik mt-[40px] sm:mt-[60px] md:mt-[80px] lg:mt-[120px] leading-tight text-center sm:text-left lg:ml-11"
>
  <span className="inline-block sm:mr-2 lg:mr-4">Striving to make</span><br />
  <span className="inline-block">EV charging</span><br />
  <span className="inline-block sm:mr-2 lg:mr-12">fairer and accessible.</span>
</h4>




<div className="text-center sm:text-right mt-8 flex items-center justify-center sm:justify-end mb-10">

</div>

 <section
        className="relative rounded-lg bg-cover bg-center 
                   mx-4 sm:mx-6 lg:mx-8 
                   py-16 sm:py-24 lg:py-[120px] 
                   min-h-[300px] sm:min-h-[400px] lg:min-h-[1020px]"
        style={{
          backgroundImage: `url(${holiday})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></section>



<section className="flex flex-col lg:flex-row items-center justify-between py-12 px-6 sm:px-10 lg:px-20 gap-10 mt-10 lg:mt-20">
  {/* Left Side - Text */}
  <div className="w-full lg:w-1/2 text-left">
  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-aeonik text-gray-800 mb-16 sm:mb-20 md:mb-30 lg:mb-70">
  <span>We want to make EV</span><br />
  <span>ownership an option</span><br />
  <span>for everyone.</span>
</h2>


    <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 lg:mb-12">
      At TransEV, we believe EV ownership should be an option for everyone, regardless of where you live.
    </p>
    <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 lg:mb-12">
      But today, due to the challenges of getting EV charging infrastructure into communal car parks, residents of apartment buildings often have no access to EV charging facilities at home.
    </p>
    <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 lg:mb-12">
      We aim to change that. With our services, we aim to promote and make EV charging more accessible, leading to a greater EV uptake hopefully a greener future.
    </p>
    <p className="text-base sm:text-lg md:text-xl text-gray-500 lg:mb-12">
      And if you own an EV, we think you should also have access to reliable EV charging facilities when you’re staying away from home, so we also want to improve charge point across spaces as well.
    </p>
  </div>

  {/* Right Side - Image */}
  <div className="w-full lg:w-1/2 flex justify-center items-center">
    <img
      src={hero} // Replace with actual image
      alt="EV Charging"
      className="w-full sm:w-[90%] md:w-[85%] lg:w-full h-auto lg:h-[800px] xl:h-[1000px] object-cover rounded-lg"
    />
  </div>
</section>

  

<section className="flex flex-col lg:flex-row items-center justify-between py-20 px-10 mt-30">
  
  {/* Left Side - Image */}
  <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
    <img
      src={holiday} 
      alt="Best EV Charging Solutions"
      className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[1200px] object-cover rounded-2xl"  // Adjust image height for different screen sizes
      style={{ padding: '20px' }} 
    />
  </div>

  {/* Right Side - Text */}
  <div className="w-full lg:w-1/2 text-center lg:text-left ml-10">  {/* Center-align text for smaller screens and left-align for large screens */}
   
    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-700 mb-10 sm:mb-20 lg:mb-40">
      We'll help you find the <br /> best solution for your{' '}
      <span className="text-left inline-block">site.</span>
    </h2>

    <Link to="/how-we-work">
      <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-10 lg:mb-20 group cursor-pointer inline-block lg:ml-60">
        Want to know how? Find out.
        <span className="block h-[2px] bg-gray-800 mt-2 w-full"></span>
      </h4>
    </Link>
   

    {/* <p className="text-xl text-gray-500 mb-6 sm:mb-8 lg:ml-20">
      <span className="font-medium text-gray-500">For <span className="font-medium text-black">residential landlords</span>, we remove many of the financial and</span> <br />
      <span className="font-medium text-gray-500 ">operational barriers to large-scale EV infrastructure investment by</span> <br />
      <span className="font-medium text-gray-500 ">offering a fully funded, maintained, and managed EV charging solution.</span>
    </p>


    <p className="text-xl text-gray-700 mb-6 sm:mb-8 lg:ml-20">
      <span className="font-medium text-gray-500 ">Our funded solutions are financed by the Charging Infrastructure</span> <br />
      <span className="font-medium text-gray-500 ">Investment Fund (CIIF), which is sponsored by the UK Government.</span>
    </p>

  
    <p className="text-xl text-gray-700 ml-4 sm:ml-8 lg:ml-20 ">
      <span className="font-medium text-gray-500 ml-2">For <span className="font-medium text-black">destination operators</span>, we offer smart EV charging solutions that</span> <br />
      <span className="font-medium text-gray-500 ">meet the growing demand for reliable EV charging facilities at hotels</span> <br />
      <span className="font-medium text-gray-500 mr-10"> and holiday parks.</span>
    </p> */}

  </div>
</section>

<section className="py-16 px-4 md:px-16 bg-white">
  {/* Our Mission Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    <div className="text-left">
      <h2 className="text-3xl font-bold text- mb-4">Our Mission</h2>
      <p className="text-lg text-gray-700">
        Promoting the adoption of green technology and contributing to the growth of society by providing sustainable energy solutions. Also, we aspire to play an instrumental role in reducing pollution in the country by encouraging the use of Electric Vehicles.
      </p>
    </div>
    <div className="flex justify-center">
      <img
        src={mission} // Replace with the path to your image
        alt="Our Mission"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
    </div>
  </div>

  {/* Our Vision Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-16">
    <div className="text-left md:order-2">
      <h2 className="text-3xl font-bold text-black mb-4">Our Vision</h2>
      <p className="text-lg text-gray-700">
        A good time to think beyond proof-of-concept solutions and to make intelligent choices for the next generation of electric drive technologies that give electric vehicles their rightful place in the transportation market.
      </p>
    </div>
    <div className="flex justify-center md:order-1">
      <img
        src={vision} // Replace with the path to your image
        alt="Our Vision"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
    </div>
  </div>

  {/* Our Values Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-16">
    <div className="text-left">
      <h2 className="text-3xl font-bold text-black mb-4">Our Values</h2>
      <ul className="list-disc pl-5 text-lg text-gray-700">
        <li><strong>Innovation:</strong> Driving technology for a greener tomorrow.</li>
        <li><strong>Sustainability:</strong> Empowering eco-friendly energy solutions.</li>
        <li><strong>Accessibility:</strong> Making EV charging hassle-free for all.</li>
        <li><strong>Customer-centric:</strong> Prioritizing user needs and satisfaction.</li>
        <li><strong>Environmental commitment:</strong> Reducing pollution through EV promotion.</li>
      </ul>
    </div>
    <div className="flex justify-center">
      <img
        src={value} // Replace with the path to your image
        alt="Our Values"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
    </div>
  </div>
</section>
<section className="py-16 px-4 md:px-16 bg-white">
      {/* Our Vision and Why People Love Us Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Our Vision */}
        <div className="text-left">
        <h2 className="text-3xl font-bold text-black mb-4">
  Our vision is to create a <br/><span className="text-green-500">sustainable future</span>
</h2>

        
        </div>

        {/* Right Side - Why People Love Us */}
        <div className="text-left">
       
           <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-8">
  Why <span className="text-orange-400">Trans</span><span className="text-green-500">EV</span>
</h3>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3">
              <FaBolt className="text-yellow-500 text-3xl" />
              <span className="text-lg text-gray-700">Fast Charging</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-500 text-3xl" />
              <span className="text-lg text-gray-700">Reliable</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaLeaf className="text-green-700 text-3xl" />
              <span className="text-lg text-gray-700">Sustainable</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaHandHoldingHeart className="text-pink-500 text-3xl" />
              <span className="text-lg text-gray-700">Convenient</span>
            </div>
          </div>
        </div>
      </div>
    </section>
<section class="flex flex-col md:flex-row items-center gap-10 px-6 py-16 bg-white">

  <div class="w-full md:w-1/2">
   <img
  src={transevImage}  // Image import for React or the actual file path for HTML
  alt="Transev EV Charging"
  className="rounded-lg shadow-lg w-full h-auto object-cover"
/>

  </div>

  <div class="w-full md:w-1/2 text-center md:text-left">
    <h2 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
      <span class="text-orange-400">Trans</span><span class="text-green-500">EV</span> – Smart Charging at Your Fingertips
    </h2>
    <p class="text-xl text-gray-700 mb-5">
      With the <strong><span class="text-orange-400">Trans</span><span class="text-green-500">EV</span> app</strong>, you can:
    </p>
    <ul class="text-lg lg:text-xl text-gray-700 list-disc list-inside mb-6 space-y-2">
      <li>Book EV charging slots in advance</li>
      <li>Track how long the vehicle has been charging</li>
      <li>See real-time billing after charging</li>
      <li>Receive alerts when charging is complete</li>
        <li>Find nearby chargers</li>
         <li>Quick Payment</li>
    </ul>
    <p class="text-xl text-gray-700 mb-6">
      Everything is designed to give you full control and transparency over your EV charging experience.
    </p>
  
   <a
  href="https://play.google.com/store/apps/details?id=com.transev.evcharging"
  className="inline-block text-white font-semibold text-lg lg:text-xl px-6 py-3 rounded-md bg-black hover:bg-green-900 transition duration-300"
>
  Explore the App
</a>

  </div>
</section>



<section className="py-20 px-10 bg-gradient-to-r from-blue-100 via-blue-50 to-white">

<h2 className="text-4xl font-semibold text-gray-800 text-center mb-12"> Our other solutions</h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

  {/* Project 1: HRMS */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/hrms" className="block">
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="HRMS">👨‍💼</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">HRMS Solutions for Modern Workforces</h3>
      <p className="text-gray-500 mt-2">Human Resource Management System</p>
    </Link>
  </div>

  {/* Project 2: Education Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/education" className="block">
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="Education">🎓</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Smart Administrative Platform for Educational Institutions</h3>
      <p className="text-gray-500 mt-2">School Management System</p>
    </Link>
  </div>

  {/* Project 3: Medical Care Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/health" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="Medical Care">🩺</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">  Elevating Patient Care with Integrated Hospital Management</h3>
      <p className="text-gray-500 mt-2">Health Services and Resources</p>
    </Link>
  </div>

  {/* Project 4: Job Application Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
    <Link to="/job" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="Job Application">💼</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">CareerConnect Platform</h3>
      <p className="text-gray-500 mt-2">Job Listings and Applications</p>
    </Link>
  </div>

  {/* Project 5: CMS Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/charger" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="CMS">⚡</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Charger Management</h3>
      <p className="text-gray-500 mt-2">Charging Management System</p>
    </Link>
  </div>

  {/* Project 6: E-commerce Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/e-com" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="E-commerce">🛒</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">E-Shopper</h3>
      <p className="text-gray-500 mt-2">Online Store Platform</p>
    </Link>
  </div>

  {/* Project 7: Parking Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/park" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="Parking">🚗</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">ParkEase</h3>
      <p className="text-gray-500 mt-2">Parking Space Management</p>
    </Link>
  </div>

  {/* Project 8: Food Application Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/food" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="Food Application">🍔</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Food Application Platform</h3>
      <p className="text-gray-500 mt-2">Food Delivery & Ordering</p>
    </Link>
  </div>

  {/* Project 9: CRM Website */}
  <div className="project-card group text-center bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-2xl hover:bg-blue-50">
  <Link to="/crm" className="block"> 
      <div className="text-6xl mb-4 text-gray-700">
        <span role="img" aria-label="CRM">📊</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Customer Onboarding</h3>
      <p className="text-gray-500 mt-2">Customer Relationship Management System</p>
    </Link>
  </div>

</div>
</section>

<div className="w-full h-[500px] sm:h-screen bg-white flex justify-center items-center mt-10 sm:mt-20 md:mt-30 lg:mt-40">
  <div className="w-full h-full max-w-screen-3xl bg-gradient-to-r p-6 sm:p-8 md:p-10 lg:p-12"> 
     <div className="w-full h-full bg-gradient-to-b from-yellow-200 via-yellow-200 to-red-300 rounded-3xl p-8 sm:p-10 md:p-12 lg:p-20 shadow-lg max-w-screen-3xl mx-auto">
    

      
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
                <div className="bg-white-50 py-16 ml-8">
                  <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-8">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                      <img src={logo1} alt="Company Logo" className="w-32 h-32" />
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
                  <footer className="bg-white text-black py-8 mt-20">
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between px-8 lg:mr-80">
                      {/* First Section - Experts and Client Portal */}
                      <div className="w-full sm:w-1/3 mb-8 sm:mb-0 ">
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

          
                        {/* Legal Links */}
                        <div>
                          <h5 className="text-lg font-semibold mb-5">Legal</h5>
                          <ul className="space-y-2">
                              <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds Policy</a></li>
                            <li><a href="/terms-conditions" className="text-gray hover:underline text-lg">Terms & Conditions</a></li>
                            <li><a href="/privacy-policy" className="text-gray hover:underline text-lg">Privacy Policy</a></li>
                                  <li><a href="/shipping-policy" className="text-gray hover:underline text-lg">Shipping Policy</a></li>
                        <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds</a></li>
                            
                           
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
          
        
     </section>
    
    </>
  );
}

export default AboutUs;
