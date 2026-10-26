import React, { useState,useRef,useEffect } from 'react';
import Navbar from './Navbar';  
import logo from '../assets/transev logo.png'; // Use appropriate path for logo image
import background from '../assets/apartmnet.jpg';
import yourImage from '../assets/new.jpg';
import { useInView } from 'react-intersection-observer';
import car from '../assets/car1.jpg'
import charger1 from '../assets/charger7.png';
import charger2 from '../assets/charger2.png';
import charger3 from '../assets/charger1.png';
import last from '../assets/woman.jpg';
import ev from '../assets/ev_charger.jpg';
import { FaPlus, FaMinus } from "react-icons/fa"; 
import image from '../assets/imagee2.jpg';
import image2 from '../assets/image.png';
import image3 from '../assets/aboutbg.jpg';
import image4 from '../assets/car1.jpg';
import image5 from '../assets/ev.jpg';
import hotels from '../assets/hotels.jpg';
import image6 from '../assets/slide4.jpg';
import image7 from '../assets/slide1.jpg';
import image8 from '../assets/slide6.jpg';
import holiday from '../assets/holiday.jpg'
import imageslide from '../assets/charge.jpg';
import new3 from '../assets/new3.jpg';
import { useNavigate } from 'react-router-dom';
import logos from '../assets/up.png';
import tr from '../assets/tr.png';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo1 from '../assets/tv.png';
import { Helmet } from "react-helmet";

const Work = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeText, setActiveText] = useState(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineColor, setUnderlineColor] = useState('gray');
  const [activeIndex, setActiveIndex] = useState(null);
   const [selectedText, setSelectedText] = useState(null);
    const navigate = useNavigate();
  const handleTextClick = (item) => {
    setSelectedText(item); // Set the clicked text
  };
    
  const images = [imageslide, tr,new3];
  // 
  const handleContactClick = () => {
    navigate('/contact');
  };
  
  // FAQ data
  const faqs = [
    {
      question: "What is the best solution for my building?",
      answer:
        "The best solution depends on the size of your building, number of residents, and available parking spaces. We offer customizable solutions to fit your needs.",
    },
    {
      question: "How many charge points do I need?",
      answer:
        "The number of charge points depends on the number of residents and the type of charging stations you wish to install. We recommend assessing the demand to determine the optimal number.",
    },
    {
      question: "What is the cost of installation?",
      answer:
        "The cost of installation varies depending on the type of charging station and the complexity of the installation. Contact us for a detailed quote.",
    },
    {
      question: "Do I need a special electrical connection?",
      answer:
        "Yes, depending on the charging station's power requirements, you may need to upgrade your electrical infrastructure. Our team will assess your needs during the consultation.",
    },
  ];

  const [popupContent, setPopupContent] = useState({
    image: '',
    description: '',
    features: ''
  });

  const handlePopupOpen = (image, description, features) => {
    setPopupContent({ image, description, features });
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleBuyNowClick = () => {
    // Handle login or any other logic for "Buy Now"
    // Redirecting to login page for now (you can change this logic based on your app)
    window.location.href = '/login'; // Redirect to login page
  };
  const containerRef = useRef(null); // Ref to handle scrolling

  const handleArrowClick = (direction) => {
    const container = containerRef.current;
    if (direction === 'left') {
      container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
    }
  };
  const [activeImage, setActiveImage] = useState(0); // Track the active image index
useEffect(() => {
        window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
      }, []);
  // Function to cycle images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prevIndex) => (prevIndex + 1) % images.length); // cycle through images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);
  const handleScroll = () => {
    const container = containerRef.current;
    const scrollPosition = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const totalWidth = container.scrollWidth;

    // Update the underline width based on scroll position
    const scrollProgress = (scrollPosition / (totalWidth - containerWidth)) * 100;
    setUnderlineWidth(scrollProgress);
  };

    const { ref: sectionRef, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });
   
  return (
    <div className="min-h-screen bg-white-50">
      <Helmet>
  <title>TransEV | Smart EV Charging Solutions</title>
  <meta
    name="description"
    content="TransEV provides end-to-end EV charging solutions including installation, management, and maintenance of charge points. Future-proof your EV infrastructure with us."
  />
  <meta name="keywords" content="EV charging solutions, smart EV chargers, EV infrastructure, TransEV, electric vehicle charging, EV management" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://transev.site/" />

  {/* Open Graph / Facebook */}
  <meta property="og:title" content="TransEV | Smart EV Charging Solutions" />
  <meta property="og:description" content="TransEV provides end-to-end EV charging solutions including installation, management, and maintenance of charge points." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://transev.site/" />
  <meta property="og:image" content="https://transev.site/images/homepage-og.jpg" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TransEV | Smart EV Charging Solutions" />
  <meta name="twitter:description" content="Future-proof your EV infrastructure with TransEV's smart EV charging solutions and services." />
  <meta name="twitter:image" content="https://transev.site/images/homepage-og.jpg" />
</Helmet>

      {/* Navbar Section */}
      <Navbar />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div> 
    
 <section className="py-16 sm:py-20 bg-white">
  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-9xl font-aeonik text-black-800 
                 mt-10 sm:mt-16 lg:mt-20 
                 px-4 sm:px-10 lg:px-32 xl:px-40 
                 text-center lg:text-left leading-tight">
    An ongoing EV <br />
    <span className="inline-block mt-0">partnership</span>
  </h2>
</section>




      {/* Future-Proof Your Sites Section */}
     
      <section className="px-4 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 bg-white flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0 mb-12">
  
  {/* Left side - Heading */}
  <div className="w-full lg:w-1/2 text-center lg:text-left">
  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-6 leading-tight">
  By your side throughout<br/>
  your EV journey.
   
  </h3>
  </div>
  
  
  {/* Right side - Explore Link */}
  {/* <div className="w-full lg:w-1/2 text-center lg:text-right mt-6 lg:mt-20">
    <a href="#explore" className="text-lg sm:text-xl lg:text-2xl font-semibold text-black-500 hover:underline inline-flex items-center justify-center lg:justify-end">
      Explore
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-black-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </a>
  </div> */}
  
  </section>
      
      {/* Background Image Section */}
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
  
   
  <div className="flex flex-col lg:flex-row justify-between mt-20 lg:mt-40 px-4 sm:px-8 lg:px-20 gap-10">
  
  {/* Left Side */}
  <div className="w-full lg:w-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
    <p className="font-semibold text-gray-800">How we work:</p>
  </div>

  {/* Right Side */}
  <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-0 text-center lg:text-left text-2xl sm:text-3xl lg:text-5xl font-bold leading-snug">
  <p>
    We’ll  be on hand to <br />
    manage and maintain the <br />
    charge points on your behalf, <br />
    and we’ll be there to install <br />
    more as demand increases in <br />
    the future.
  </p>

  <p className="mt-6 text-base sm:text-lg lg:text-xl">
    <a
      href="/solution"
      className="text-black underline hover:text-blue-700 transition duration-200"
    >
      See our solutions
    </a>
  </p>
</div>
</div>

     <>
     <style>
        {`
          
          @keyframes fadeInOut {
            0% {
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

        
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

         
          @keyframes showText {
            0%, 33.33% {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            33.34%, 100% {
              opacity: 0;
              visibility: hidden;
              transform: translateY(50px);
            }
          }

          .image-slider-wrapper {
            overflow: hidden;
            position: relative;
          }

          .image-slider {
            display: flex;
            position: relative;
          }

          .image-slide {
            flex: 0 0 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            transition: opacity 1s ease;
          }

          .image-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.5s ease;
            border-radius: 15px;
          }

          .animate-slide-up-text {
            animation: slideUp 1s ease-out;
            opacity: 0;
            animation-fill-mode: forwards;
          }

          .pair {
            opacity: 0;
            visibility: hidden;
            animation: showText 9s ease-in-out infinite;
          }

        
          .pair-1 {
            animation-delay: 0s;
          }

          .pair-2 {
            animation-delay: 3s;
          }

          .pair-3 {
            animation-delay: 6s;
          }

        
          .image-zoom-out:hover {
            transform: scale(0.9);
          }

          .underline-hover:hover {
            text-decoration: underline;
            color: black;
          }

        
.active-text {
  color: black !important;
}

.active-underline {
  text-decoration: underline; 
}


.text-hover:hover {
  color: black; 
  text-decoration: underline; 
}


.image-slide.fade-out {
  opacity: 0 !important;
  transition: opacity 0.3s ease;
}


          .active-underline {
            text-decoration: underline;
          }

        
          .image-slide.fade-out {
            opacity: 0 !important;
            transition: opacity 0.3s ease; 
          }
          
          .text-hover:hover {
            color: black;
            text-decoration: underline;
          }
        `}
      </style>

  
      <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-16 space-y-10 lg:space-y-0 lg:space-x-8 mt-30">
  {/* Image Slider Section */}
  <div className="w-full lg:w-1/2 relative overflow-hidden space-y-10 image-slider-wrapper">
    <div className="image-slider w-full h-[300px] sm:h-[500px] md:h-[600px] lg:h-[1000px] relative">
      {images.map((image, index) => (
        <div
          key={index}
          className={`image-slide absolute inset-0 transition-opacity duration-1000 ease-out ${
            index === activeImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            animation: `fadeInOut 9s ease-in-out infinite ${index * 3}s`,
          }}
        >
          <img
            src={image}
            alt={`Image ${index + 1}`}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      ))}
    </div>
  </div>

  {/* Text Section */}
  <div className="w-full lg:w-1/2 flex flex-col justify-start space-y-6 mx-auto lg:ml-90 lg:mr-0 px-4 mt-20">
  <h3 className="text-xl font-semibold mb-40 ">How We Find the Best Solution</h3>

  {/* Headline Options */}
  <div className="space-y-6">
    {['Listen', 'Research', 'Design'].map((item, index) => (
      <div
        key={index}
        className={`text-4xl sm:text-6xl lg:text-7xl font-aeonik cursor-pointer group ${
          selectedText === item
            ? 'active-text active-underline'
            : 'text-gray-500 text-hover'
        }`}
        onClick={() => handleTextClick(item)}
      >
        <span className="relative inline-block group">
          {item}
          <span
            className={`absolute bottom-0 left-0 w-0 h-[4px] bg-gray-500 transition-all duration-300 group-hover:w-full group-hover:bg-black`}
          />
        </span>
      </div>
    ))}
  </div>

  {/* Text Content Section */}
  <div className="relative mt-20 lg:mt-60">
  {/* First */}
  <div className="pair pair-1 relative lg:absolute top-0 left-0 mb-16 lg:mb-0">
    <h2 className="text-xl sm:text-2xl font-bold animate-slide-up-text">We Listen Carefully</h2>
    <p className="text-base sm:text-lg mt-4 animate-slide-up-text w-full max-w-[600px] text-gray-600">
      Our experienced team will listen carefully to the requirements <br />
      of your end-users and what you’re looking to achieve by <br />
      installing EV charger points.
    </p>
  </div>

  {/* Second */}
  <div className="pair pair-2 relative lg:absolute top-0 left-0 mb-16 lg:mb-0">
    <h2 className="text-xl sm:text-2xl font-bold animate-slide-up-text">We Do Our Research</h2>
    <p className="text-base sm:text-lg mt-4 animate-slide-up-text w-full max-w-[600px] text-gray-600">
      Our team will carry out a full site visit and complete a review of <br />
      the amenities and resources to evaluate for the charging infrastructure
    </p>
  </div>

  {/* Third */}
  <div className="pair pair-3 relative lg:absolute top-0 left-0 mb-16 lg:mb-0">
    <h2 className="text-xl sm:text-2xl font-bold animate-slide-up-text">We Create a Customised Approach</h2>
    <p className="text-base sm:text-lg mt-4 animate-slide-up-text w-full max-w-[600px] text-gray-600">
      Based on our conversations and site visit, we’ll go forward with a flexible approach that aims to meet the needs of your site and end-users.
    </p>
  </div>
</div>
</div>
</div>
<style>
  {`
    /* Keyframe for fadeInOut */
    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    /* Slide-up effect for text */
    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(50px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Controls visibility and position for pairs of text */
    @keyframes showText {
      0%, 33.33% {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      33.34%, 100% {
        opacity: 0;
        visibility: hidden;
        transform: translateY(50px);
      }
    }

    .pair {
      opacity: 0;
      visibility: hidden;
      animation: showText 9s ease-in-out infinite;
    }

    .pair-1 {
      animation-delay: 0s; /* First pair */
    }

    .pair-2 {
      animation-delay: 3s; /* Second pair */
    }

    .pair-3 {
      animation-delay: 6s; /* Third pair */
    }

    /* Animation for the slide-up effect */
    .animate-slide-up-text {
      animation: slideUp 1s ease-out;
      opacity: 0;
      animation-fill-mode: forwards; /* Keep the final state after animation */
    }
  `}
</style>
    </>
    <div className="flex flex-col items-start px-4 sm:px-8 lg:p-16 mt-10">
  {/* Main heading */}
  <h2 className="text-3xl sm:text-5xl lg:text-7xl font-aeonik mb-8 leading-tight">
 The Journey from consulation to installation can be grouped into roughly 6 steps:
</h2>


  {/* Steps grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
    {[
      {
        step: "01",
        title: "Consultancy",
        desc: "We listen to your objectives and understand your needs.",
      },
      {
        step: "02",
        title: "Survey and scheme design",
        desc: "We carry out a detailed site survey and create a flexible approach tailored to your needs.",
      },
      {
        step: "03",
        title: "Installation",
        desc: "We project manage the charge point installation.",
      },
      {
        step: "04",
        title: "Commissioning",
        desc: "We configure the equipment to your needs and set you up on our cloud-based software platform.",
      },
      {
        step: "05",
        title: "Ongoing service support",
        desc: "We provide ongoing maintenance and online service support.",
      },
      {
        step: "06",
        title: "Future expansion",
        desc: "We’re there to add more charge points as and when you need them.",
      },
    ].map((step, index) => (
      <div key={index} className="flex flex-col items-start">
        <div className="text-xl sm:text-2xl font-bold text-gray-600">
          <span className="underline mb-2 block">{step.step}</span>
        </div>
        <div className="text-lg sm:text-xl font-semibold text-black-600 mb-6">
          {step.title}
        </div>
        <p className="text-gray-600 text-base sm:text-lg">
          {step.desc}
        </p>
      </div>
    ))}
  </div>
</div>


<div className="w-full h-[500px] sm:h-screen bg-white flex justify-center items-center mt-10 sm:mt-20 md:mt-30 lg:mt-40">
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
          
                        {/* Legal Links */}
                        <div>
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
          
                    {/* Footer Bottom Section */}
                    <div className="text-center mt-8 text-lg lg:mr-300">
                      <p>&copy; TransEV 2025. All Rights Reserved.</p>
                    </div>
                  </footer>
                </div>
          
                {/* FAQ Popup */}
                {popupOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-6xl w-full flex relative h-auto">
                      {/* Close Button */}
                      <button
                        className="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-900"
                        onClick={handlePopupClose}
                      >
                        &times; {/* "×" represents the close/cross icon */}
                      </button>
          
                      <div className="w-1/2 p-4">
                        <img
                          src={popupContent.image}
                          alt="Popup"
                          className="w-full h-auto object-contain rounded-lg"  // Ensuring the image stays contained and fully visible
                        />
                      </div>
          
                      <div className="w-1/2 p-4">
                        <h3 className="text-2xl font-semibold mb-4">Product Description</h3>
                        <p>{popupContent.description}</p>
                        <h3 className="text-2xl font-semibold mb-4 mt-6">Features</h3>
                        <p>{popupContent.features}</p>
          
                        {/* Buy Now Button */}
                        <button
                          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full"
                          onClick={handleBuyNowClick}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          
            );
          };
          
          export default Work;