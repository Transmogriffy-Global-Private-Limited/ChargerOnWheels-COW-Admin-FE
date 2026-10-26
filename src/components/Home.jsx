import React, { useState,useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VideoBackground from '../components/Videobackground';  // Import VideoBackground component
import evcharger from '../assets/ev.jpg';
import image1 from '../assets/image1.png';
import image2 from '../assets/imagee2.jpg';
 import image3 from '../assets/image.png';
 import Evimage from '../assets/hero1.png';
import charger1 from '../assets/charger1.png';
import charger2 from '../assets/charger2.png';
import charger3 from '../assets/charger3.jpg';
import charger4 from '../assets/charger4.png';
import charger5 from '../assets/charger5.png';
import charger6 from '../assets/charger6.png';
import charger7 from '../assets/charger7.png';
import charger8 from '../assets/charger8.png';
import slider1 from '../assets/slide1.jpg';
import slider2 from '../assets/slide2.jpg';
import slider3 from '../assets/slide3.jpg';
import slider4 from '../assets/slide4.jpg';
import slider5 from '../assets/slide5.jpg';
import slider6 from '../assets/slide6.jpg';
import eo from '../assets/eo.jpg';
import easee from '../assets/easee.png';
import ctek from '../assets/ctek.png';
import garo from '../assets/garo.png';
import schneider from '../assets/schneider.png';
import slider from '../assets/slider.jpg';
import zaptec from '../assets/zaptec.png';
import newslide from '../assets/new.jpg'; 
import logo from '../assets/transev logo.png';
import woman from '../assets/woman.jpg';
import car from '../assets/car.jpg';
import mobile from '../assets/mobile.jpg';
import AC01W from '../assets/newac01w.png';
import AC02P from '../assets/AC02P3.png';
import AC02P7 from '../assets/AC02P7.4.png';
import AC02WCH from '../assets/AC02WC&H.png';
import AC03W7 from '../assets/AC03W7.png';
import AC03W22 from '../assets/Ac03w3.png';
import DC04W from '../assets/DC04W.png';
import DC04G60 from '../assets/DC04G60.png';
import DC04G150 from '../assets/DC04G150.png';
import logo1 from '../assets/tv.png';
import red from '../assets/red.png';
import slid from '../assets/slid.png';
import { FaArrowRight } from 'react-icons/fa';
import logos from '../assets/up.png';
import Thunder from '../assets/Thunder.gif';
import c1 from '../assets/c4.png';
import c3 from '../assets/c3.png';
import c4 from '../assets/c1.png';
import c5 from '../assets/cc1.png';
import mob from '../assets/transev.jpg';
import x from '../assets/x.png';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Helmet } from "react-helmet";
function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
   
   const [boxNamesVisible, setBoxNamesVisible] = useState(true);
   const [scrollPosition, setScrollPosition] = useState(0);
   const [underlineWidth, setUnderlineWidth] = useState(0);
   const [underlineColor, setUnderlineColor] = useState('gray'); // Set the initial color to gray
   const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [largeImage, setLargeImage] = useState(slider1); // large image to show when clicked
   
 const [popupContent, setPopupContent] = useState({
  image: '',
  description: '',
  details: {},
  features: '',
  name:''
});

const handlePopupOpen = (image, description, features, details,name) => {
  setPopupContent({ image, description, details, features,name });
  setPopupOpen(true);
};

const handlePopupClose = () => {
  setPopupOpen(false);
};


 
  
  const sliderImages = [red,c1, c3, c5,c4, slid];
  const smallImages = [eo,zaptec, easee, ctek, garo, schneider];
  
  
    // Start dragging (detects the start of dragging action)
    
  
    // Handle image click to set large image on the left side
    const handleImageClick = (image) => {
      setLargeImage(image);
    };
  
   
   const handleContactClick = () => {
    // Get the button element by id
    const button = document.getElementById('contact-btn');
    
    // Add background color change on button click
    button.classList.add('bg-yellow-500'); // Add a background color

    // After a small delay (for animation), navigate to the contact page
    setTimeout(() => {
      navigate('/contact');  // Navigate to the Contact page
    }, 500); // Delay to allow animation to complete
  };
   const handleArrowClick = (direction) => {
     const container = document.getElementById('box-container');
     const scrollAmount = direction === 'left' ? -350 : 350;
     container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
   };
 
     const handleScroll = () => {
      const container = document.getElementById('box-container');
      const totalScrollWidth = container.scrollWidth - container.clientWidth;
      const scrollPosition = container.scrollLeft;
      setScrollPosition(scrollPosition);
  
      // Calculate the width of the underline based on scroll position
      const newWidth = (scrollPosition / totalScrollWidth) * 100;
      setUnderlineWidth(newWidth);
  
      // Gradually change underline color from gray to black based on scroll position
      const newColor = scrollPosition > 0 ? 'black' : 'gray';
      setUnderlineColor(newColor);
    };
  
  const handleButtonClick = () => {
    // Animate and navigate to the solutions page
    document.getElementById('solutions-btn').classList.add('bg-yellow-500');
    setTimeout(() => {
      navigate('/solution');  // Navigate to the Solutions page
    }, 500); // After animation, navigate to solutions page
  };
  const handleSectionClick = (section) => {
    // Navigate to the corresponding page based on the section clicked
    if (section === 'Homes & Housing') {
      navigate('/solutions/home-and-housing-societies'); // Navigate to a specific route for Apartment buildings
    } else if (section === 'Workplaces') {
      navigate('/solutions/office-and-workplace');
    } else if (section === 'Public Places') {
      navigate('/solutions/public-places');
    } else if (section === 'Fleets') {
      navigate('/solutions/fleet-organization');
    }
  };
  const images = [charger1 , charger2, charger3, charger4 , charger5 , charger6 , charger7 , charger8 ];
 const imagezoom = [car,woman,mob,slid]
 const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -400,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 400,
      behavior: 'smooth'
    });
  };
  const [isDragging, setIsDragging] = useState(false);
  
  // Mouse drag events
  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // drag speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // Arrow scroll
  const scrollLeftBtn = () => {
    containerRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRightBtn = () => {
    containerRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };
useEffect(() => {
        window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
      }, []);
      const slideDuration = 3; // seconds
const totalSlides = imagezoom.length;
const totalDuration = slideDuration * totalSlides; 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('auth_token');
  setIsLoggedIn(!!token);
}, []);

const handleBuyNowClick = () => {
  if (isLoggedIn) {
    navigate('/products');
  } else {
    navigate('/login');
  }
};// total animation cycle
 return (
  <div className="relative w-full overflow-x-hidden">
    <Helmet>
  {/* Page Title */}
  <title>TransEV | Smart EV Charging Solutions for Homes, Businesses & Fleets</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="TransEV provides smart, scalable, and reliable EV charging solutions for residential, commercial, and public spaces. Explore our range of charging stations and services today."
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://transev.site/" />

  {/* Open Graph / Facebook */}
  <meta property="og:title" content="TransEV | Smart EV Charging Solutions" />
  <meta
    property="og:description"
    content="Scalable and reliable EV charging solutions for homes, businesses, and public places. Future-ready infrastructure and expert support."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://transev.site/" />
  <meta property="og:image" content="https://transev.site/images/ev-og-image.jpg" />
<meta name="robots" content="index, follow" />
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TransEV | Smart EV Charging Solutions" />
  <meta
    name="twitter:description"
    content="Future-ready EV charging solutions for homes, businesses, and public spaces. Discover TransEV today!"
  />
  <meta name="twitter:image" content="https://transev.site/images/ev-og-image.jpg" />

  {/* Optional: Robots Meta Tag */}
  <meta name="robots" content="index, follow" />
</Helmet>

    <div className="relative w-full h-screen">
      <VideoBackground />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div>
      <Navbar />
      
      <div className="absolute top-1/4 w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 text-white text-left space-y-6">
        
        <h1 className="font-aeonik text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-tight tracking-wide">
          <div>
            <span></span>{' '}
           
       <div className="text-white font-semibold ml-2.5 mt-10">
  {/* Top Line: Charge + Icon */}
  <div className="inline-flex items-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
    Charge
    <img
      src={Thunder}
      alt="Charger"
      className="ml-2 h-[1em] w-auto object-contain align-middle"
    />
  </div>

  {/* Bottom Line: Beyond Boundaries */}
  <div className="mt-2 text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
    Beyond <span className="text-white">Boundaries</span>
  </div>
</div>

</div>
        </h1>

        {/* Button */}
        <div className="relative inline-block mt-8">
        <button
  id="solutions-btn"
  onClick={handleButtonClick}
  className="flex items-center justify-center px-10 py-6 w-full sm:w-auto md:w-[350px] lg:w-[400px] xl:w-[400px] bg-white text-black font-semibold rounded-full transition-all duration-300 hover:bg-yellow-300 hover:text-white"
>
  <span className="mr-4 text-lg sm:text-xl md:text-2xl">Our Solutions</span>
  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-11 group-hover:h-11 ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-black transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </div>
</button>

        </div>

      
       {/* <p className="text-3xl sm:text-2xl md:text-6xl lg:text-4xl xl:text-5xl text-white mt-8 text-center sm:text-left">
          <span className="block mb-2 sm:mb-4">Custom EV Solutions</span>
        

        </p>  */}


      </div>
    </div>
 


      {/* Non-Video Content Section 1 */}

<div className="flex flex-col lg:flex-row justify-between p-8 sm:p-16 mt-10 bg-white">
  <div className="w-full lg:w-2/3 pr-8 mb-8 lg:mb-0"> {/* Added padding-right and margin-bottom for spacing */}
    
    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal font-aeonik leading-tight max-w-screen-lg mx-auto">
  Be <span className="text-orange-400 font-semibold">Ready</span> <br />
  For the Future with our <br />
  <span className="font-normal">Scalable <span className="text-green-400 font-semibold">EV</span> Charging Solutions.</span>
</h2> 




  </div>
  
  <div className="w-full lg:w-1/4">
    {/* Image with padding and rounded corners */}
    <img src={evcharger} alt="EV Charging" className="w-full h-auto rounded-xl" />
  </div>
</div>


 <div className="p-16">
 
  <h3 className="text-2xl font-bold text-left">
    We provide charging solutions for:
  </h3>
</div>
 
 <div className="space-y-0 bg-white pl-4 pr-4 sm:pl-8 sm:pr-8">
  {[
    'Homes & Housing',
    'Workplaces',
    'Public Places',
    'Fleets',
  ].map((section, index) => (
    <div
      key={index}
      className={`relative flex flex-col sm:flex-row justify-between items-center sm:items-stretch gap-6 sm:gap-0 py-8 sm:p-16 transition-all duration-300 
        ${hovered === index ? 'bg-yellow-200' : ''} 
        border-t border-gray-300 cursor-pointer`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => handleSectionClick(section)}
    >
     
      <div
        className={`w-full sm:w-1/4 flex justify-center sm:justify-start items-center transition-all duration-300 transform ${
          hovered === index ? 'translate-x-4 sm:translate-x-10' : 'translate-x-0'
        }`}
      >
        <span className="text-4xl sm:text-6xl font-aeonik text-black">{`0${index + 1}`}</span>
      </div>

  
      <div className="w-full sm:w-1/2 flex items-center justify-center text-center sm:text-left">
        <h2
          className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-aeonik transition-all duration-300 ${
            hovered === index ? 'text-black' : 'text-gray-800'
          }`}
        >
          {section}
        </h2>
      </div>


      <div className="w-full sm:w-1/4 flex justify-center sm:justify-end items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-black transition-transform duration-300"
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

    
      <div
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform transition-all duration-500 ${
          hovered === index ? 'scale-y-100 translate-y-0' : 'scale-y-0 translate-y-2'
        }`}
      />
    </div>
  ))}
</div> 

  

  
   
 <>
 
 <style>{`
  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0;
    }
    10%, 90% {
      opacity: 1;
    }
  }

  .image-slider-wrapper {
    position: relative;
    overflow: hidden;
  }

  .image-slider {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: fadeInOut linear infinite;
    z-index: 1;
  }

  .image-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
  }
`}</style>

<div className="flex flex-col lg:flex-row justify-between items-start p-4 sm:p-8 lg:p-16 space-y-8 lg:space-y-0 lg:space-x-8">

<div className="image-slider-wrapper w-full lg:w-[80%] xl:w-[70%] 2xl:w-[60%]  h-[400px] sm:h-[100px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px]">

  <div className="image-slider w-full h-full">
    {imagezoom.map((image, index) => (
      <div
        key={index}
        className="image-slide"
        style={{
          animationDuration: `${totalDuration}s`,
          animationDelay: `${index * slideDuration}s`,
        }}
      >
        <img
          src={image}
          alt={`Image ${index + 1}`}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
    ))}
  </div>
</div> 



  {/* Right: Text Content */}
  <div className="w-full lg:w-1/2 flex flex-col justify-start lg:ml-30">
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 lg:mb-8 text-gray-700">
      How we can help
    </h3>

    <div className="space-y-6 mt-6 sm:mt-10 md:mt-16 lg:mt-20">
      {['Expertise', 'Guidance', 'Support'].map((item, index) => (
        <div
          key={index}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-aeonik text-gray-500 cursor-pointer group hover:text-black"
        >
          <span className="relative inline-block group">
            {item}
            <span
              className="absolute bottom-0 left-0 w-0 h-[4px] bg-gray-500 transition-all duration-300 group-hover:w-full group-hover:bg-black"
            />
          </span>
        </div>
      ))}
    

 

    <div className="flex flex-col lg:flex-row justify-between items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 mt-20 lg:mt-40 xl:mt-52 2xl:mt-64 space-y-10 lg:space-y-0">
  <div className="w-full lg:w-3/5 xl:w-2/3 relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px]">
    
    {/* Pair 1 */}
    <div className="pair pair-1 absolute top-0 left-0">
      <h2 className="text-xl sm:text-xl md:text-xl font-bold animate-slide-up-text">
        A consultative approach
      </h2>
      <p className="text-base sm:text-lg md:text-lg mt-4 animate-slide-up-text max-w-full md:max-w-[95%] xl:max-w-[700px]">
        We work closely with you throughout the design and 
        installation process to ensure the infrastructure meets your 
        unique requirements.
      </p>
    </div>

    {/* Pair 2 */}
    <div className="pair pair-2 absolute top-0 left-0">
      {/* <h2 className="text-xl sm:text-xl md:text-xl font-bold animate-slide-up-text  whitespace-nowrap">
        Effortless management and maintenance
      </h2> */}
      <h2 className="text-xl sm:text-xl md:text-xl font-bold animate-slide-up-text">
  <span className="block sm:hidden">
    Effortless management and<br />  maintenance
  </span>
  <span className="hidden sm:inline whitespace-nowrap">
    Effortless management and maintenance
  </span>
</h2>

      <p className="text-base sm:text-lg md:text-lg mt-4 animate-slide-up-text max-w-full md:max-w-[95%] xl:max-w-[700px]">
We provide effortless management and maintainance, so you can focus on what matters most      </p>
    </div>

    {/* Pair 3 */}
    <div className="pair pair-3 absolute top-0 left-0">
    {/* <h2 className="text-xl sm:text-xl md:text-xl font-bold animate-slide-up-text  whitespace-nowrap">
        Leaders in residential EV charging solutions
      </h2>  */}
    <h2 className="text-xl sm:text-xl md:text-xl font-bold animate-slide-up-text  whitespace-nowrap">
  Pioneers in residential EV charging <br/>solutions
</h2>



      <p className="text-base sm:text-lg md:text-lg mt-4 animate-slide-up-text max-w-full md:max-w-[95%] xl:max-w-[700px]">
        TransEV brings you a team of highly 
        trained professionals. Stay easy knowing that your charging infrastructure is in reliable hands.
        </p>
    </div>
  </div>
</div>

<style>
  {`
    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(50px); /* Start from 50px below */
      }
      100% {
        opacity: 1;
        transform: translateY(0); /* End at the normal position */
      }
    }

    .animate-slide-up-text {
      animation: slideUp 1s ease-out;
      opacity: 0;
      animation-fill-mode: forwards; /* Keep the final state after animation ends */
    }

    .pair {
      opacity: 0;
      visibility: hidden;
      animation: showText 9s ease-in-out infinite;
    }

    /* Show and hide the text pairs with different delays to create the cycle */
    .pair-1 {
      animation-delay: 0s;
    }

    .pair-2 {
      animation-delay: 3s;
    }

    .pair-3 {
      animation-delay: 6s;
    }

    /* Control visibility and position of the pairs */
    @keyframes showText {
      0%, 33.33% {
        opacity: 1;
        visibility: visible;
        transform: translateY(0); /* Start at the normal position */
      }
      33.34%, 100% {
        opacity: 0;
        visibility: hidden;
        transform: translateY(50px); /* Slide out to the bottom */
      }
    }
  `}
</style>
</div>
</div>
</div>
</>
<div className="relative mt-[-10] rounded-xl overflow-hidden">
 
    <div className="w-full h-220 relative rounded-xl overflow-hidden px-4">
  <img 
    src={Evimage} 
    alt="Full Image" 
    className="w-full h-full object-cover rounded-xl"
  /> 

<div className="absolute top-70 left-0 w-full h-full flex items-center justify-between p-8 text-white ">
     
    <div className="space-y-0 max-w-400 ml-4">
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-aeonik leading-tight">
  Smart EV Charging Solutions
</h2>
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-aeonik mt-2 lg:mt-4">
  For residentials, businesses, and more
</h2>
{/* <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-aeonik mt-2 lg:mt-4">
 & more
</h2> */}



</div> 
 



      <div className="flex items-center justify-center">
        <button
          id="solutions-btn"
          onClick={handleButtonClick}
          className="flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full transition-all duration-300 hover:bg-yellow-300 hover:text-white"
        >
          <span className="mr-2">Our Solutions</span>
          <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-8 group-hover:h-8 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black transition-transform duration-300 group-hover:translate-x-1"
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

 
 
<div className="mt-20 sm:mt-32 lg:mt-40 text-right px-4 sm:px-8 md:px-16 mb-10">
  <div>
  
<div className="text-center sm:text-left">
  <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-aeonik leading-tight">
    We offer a range of charge
  </h3>

  <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-aeonik mt-2 sm:mt-4 leading-snug">
    Points to choose from.
  </h3>
</div>



  </div>
</div>


</div>



<div className="flex justify-center items-center mb-8 ">
  <div
    id="box-container"
    className="flex overflow-x-auto gap-8 py-8 px-4 sm:px-8 md:px-12 lg:px-16 relative"
    style={{
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none', 
    }}
    onScroll={handleScroll}
  >
   {[
      // { name: 'AC01W', description: '3.3 kW ', features: 'Model No:TE-AC-01W-3.3,Rating: 3.3 kW,Single Connector,GSM/Wi-Fi/BLE',
      //    image: AC01W,details: {
      //     'Dimensions':'WxDxH (310 mm x 220 mm x 90 mm)',
      //     'Rated Power': '3.3 kW',
      //     'Input Voltage': '200V - 265V AC',
      //     'Number of Output':'1',
      //     'Output Current':'16 A',
      //     'Output charging Outlet ':'IS/IEC 60309-1:2002',
      //     'Operating Temperature':'-5°C to +55°C',
      //     'Connectivity':'Wi-Fi, GSM,Bluetooth,LED Indication',
      //     'Charging Operation':'QR code based/Scan code / App based authentication',
      //     'Mechanical Protection':'IP54',
      //     'Safety':'CE',
      //    'Mounting': 'Wall Mounted',}},
         
      { name: 'AC 3.7 kW Portable Charger', description: '3.7 kW ', features: 'Model No:TE-AC-02P-3.7,Rating: 3.7 kW,Portable Charger,Plug and Play', image:AC02P,details: {
         'Dimensions':'WxDxH (85 mm x 55 mm x 200 mm)',
          'Rated Power': '3.7 kW',
          'Input Voltage': '230V AC(100-265V)',
          'Number of Output':'1',
          'Output Current':'8 A - 16 A',
          'Output charging Outlet ':'IEC/EN 62196-2,IP54',
          'Operating Temperature':'-30°C to +50°C',
          'Connectivity':'Plug In',
          'Charging Operation':'Plug and Play',
          'Mechanical Protection':'IP66',
          'Safety':'IEC 62752, IEC 61851-21-2',
         'Mounting': 'Portable',}},
      { name: 'AC 7.4 kW Portable Charger', description: '7.4 kW ', features: 'Model No:TE-AC-02P- 7.4,Rating: 3.7 kW,Portable Charger,Plug and Play', image: AC02P7,details: {
          'Dimensions':'WxDxH (120 mm x 110 mm x 320 mm)',
          'Rated Power': '7.4 kW',
          'Input Voltage': '230V AC(100-265V)',
          'Number of Output':'1',
          'Output Current':'6 A - 32 A',
          'Output charging Outlet ':'IEC/EN 62196-2,IP54',
          'Operating Temperature':'-30°C to +50°C',
          'Connectivity':'Plug In, Wireless DLB/Solar compatible',
          'Charging Operation':'Plug and Play',
          'Mechanical Protection':'IP65',
          'Safety':'IEC 62752, IEC 61851-21-2',
         'Mounting': 'Wall Mounted & Portable',}},
      { name: 'AC 7.4 kW', description: ' 7.4kW ', features: 'Model No:TE-AC-02W-7.4C & H,Rating: 7.4 kW,Single Connector,GSM/Wi-Fi/BLE/4G/Ethernet or Optional', 
       image: AC02WCH , details: {
         'Dimensions':'WxDxH (278 mm x 152 mm x 360 mm)',
          'Rated Power': '7.4 kW',
          'Input Voltage': '230V AC',
          'Number of Output':'1',
          'Output Current':'32 A',
          'Output charging Outlet ':'Type 2 Socket,IEC/EN 62196-2,IP54',
          'Operating Temperature':'-25°C to +55°C',
          'Connectivity':'Wi-Fi, 4 G, Bluetooth,DLB,Ethernet',
          'Charging Operation':'RFID authentication,App based authentication,Plug and Play',
          'Mechanical Protection':'IP65',
          'Safety':'EN IEC 61851-1, IEC 61851-21-2',
         'Mounting': 'Wall / Pole Mount',}},
      { name: 'AC 7.4 kW', description: '7.4 kW', features: 'Model No:TE-AC-03W-7.4,Rating: 7.4 kW,Single Connector,GSM/Wi-Fi/BLE/4G', image: AC03W7,details: {
         'Dimensions':'WxDxH (195 mm x 110 mm x 320 mm)',
          'Rated Power': '7.4 kW',
          'Input Voltage': '184V - 276V AC',
          'Number of Output':'1',
          'Output Current':'32 A',
          'Output charging Outlet ':'Type 2 socket',
          'Operating Temperature':'-35°C to +50°C',
          'Connectivity':'Wi-Fi, Ethernet(RJ45),Bluetooth,RS485,4G',
          'Charging Operation':'RFID authentication,QR code based,App based authentication',
          'Mechanical Protection':'IP54',
          'Safety':'EN IEC 61851-1, IEC 61851-21-2',
         'Mounting': 'Wall or floor using a pedestal',}},
      { name: 'AC 22 kW', description: ' 22 kW', features: 'Model No:TE-AC-03W-22,Rating: 22 kW,Single Connector,GSM/Wi-Fi/BLE/4G', image: AC03W22,details: {
         'Dimensions':'WxDxH (195 mm x 110 mm x 320 mm)',
          'Rated Power': '22 kW',
          'Input Voltage': '320V - 480V AC',
          'Number of Output':'1',
          'Output Current':'32 A',
          'Output charging Outlet ':'Type 2 socket',
          'Operating Temperature':'-35°C to +50°C',
          'Connectivity':'Wi-Fi, Ethernet(RJ45),Bluetooth,RS485,4G',
          'Charging Operation':'RFID authentication,QR code based,App based authentication',
          'Mechanical Protection':'IP54',
          'Safety':'IEC/EN 61851-1, EN 62311, EN 62479, IEC/EN 62955',
         'Mounting': 'Wall or floor using a pedestal',}},
      { name: 'DC 30 kW', description: '30 kW', features: 'Model No:TE-DC-04W-30,Rating:30 kW,Single Gun,Ethernet | Wi-fi|4G', image: DC04W,details: {
         'Dimensions':'WxDxH (459 mm x 346 mm x 734 mm)',
          'Rated Power': '30 kW',
          'Input Voltage': '304-456V AC',
          'Number of Output':'1',
          'Output Current':'100 A',
          'Output charging Outlet ':'Single output ccs1/ccs2 connector',
          'Operating Temperature':'-20°C to +60°C',
          'Connectivity':'Ethernet,4G,Wireless Network',
          'Charging Operation':'RFID card,Scan QR code,Mobile App',
          'Mechanical Protection':'IP54',
          'Safety':'IEC EN61851, EN62196, DIN70121, ISO15118',
         'Mounting': 'Wall Mount,Stand column',}},
      { name: 'DC 60 kW', description: ' 60 kW ', features: 'Model No:TE-DC-04G-60,Rating:60 kW,High Speed Charging,OCPP1.6J Or Latest | RFID', image: DC04G60,details: {
          'Dimensions':'WxDxH (730 mm x 500 mm x 1500 mm)',
          'Rated Power': '60 kW',
          'Input Voltage': '304V - 456V AC',
          'Number of Output':'2',
          'Output Current':'200 A',
          'Output charging Outlet ':'ccs2 DC connectors,BS EN 62196,IP55',
          'Operating Temperature':'-20°C to +60°C',
          'Connectivity':'Ethernet,4G,Wireless Network',
          'Charging Operation':'RFID card,Scan QR code,Mobile App',
          'Mechanical Protection':'IP54',
          'Safety':'IEC EN61851, EN62196, DIN70121, ISO15118',
         'Mounting': 'Ground/Floor Mounting',}},
      { name: 'DC 120 kW', description: '120 kW', features: 'Model No:TE-DC-04G-150,Rating:150 kW,High Speed Charging,OCPP1.6J Or Latest | RFID', image: DC04G150, details: {
           'Dimensions':'WxDxH (1150 mm x 625 mm x 2000 mm)',
          'Rated Power': '120 kW',
          'Input Voltage': '304V - 456V AC',
          'Number of Output':'2 or 3',
          'Output Current':'250 A',
          'Output charging Outlet ':'CCS2 DC connectors,BS EN 62196,IP55',
          'Operating Temperature':'-35°C to +60°C',
          'Connectivity':'Wi-Fi, GSM,Bluetooth,LED Indication',
          'Charging Operation':'QR code based/Scan code / App based authentication',
          'Mechanical Protection':'IP54',
          'Safety':'IEC EN61851, EN62196, DIN70121, ISO15118',
         'Mounting': 'Ground/Floor Mounting'}},
      // Add details for other items similarly...
    ].map((box, index) => (
      <div key={index} className="flex flex-col items-center">
        <div
          className="box bg-gray-200 p-6 sm:p-8 md:p-10 rounded-lg relative cursor-pointer hover:scale-105 transform transition-all duration-300 w-[300px] sm:w-[400px] md:w-[450px] lg:w-[550px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[600px]"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex justify-center items-center w-full h-3/4">
            <img
              src={box.image}
              alt={box.name}
              className="w-3/4 h-4/4 object-cover rounded-lg mt-20 cursor-pointer"
              onClick={() => handlePopupOpen(box.image, box.description, box.features, box.details,box.name)} // Pass the details here
            />
          </div>
         
          <div
            className={`absolute top-4 right-4 bg-yellow-300 w-10 h-10 rounded-full flex justify-center items-center transition-all duration-300 ${hovered === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => handlePopupOpen(box.image, box.description, box.features, box.details,box.name)} // Pass the details here
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold">{box.name}</h2>
          <p className="text-gray-600 mt-2">{box.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="relative mt-16">
  
  <div
    className="absolute bottom-0 left-0 right-0 transition-all duration-500"
    style={{
      left: '12%',
      right: '16%',
      height: '2px',
      width: `${underlineWidth}%`,
      backgroundColor: underlineColor,
      transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
      paddingRight: '50px',
    }}
  ></div>

  {/* Arrows Container */}
  <div className="flex justify-center items-center absolute bottom-2 w-full px-4 space-x-4 sm:space-x-6 md:space-x-8 ml-4 sm:ml-8 md:ml-16 lg:ml-32">
    {/* Left Arrow Button */}
    <button
      className="text-xl p-2 rounded-full mx-4 sm:mx-6 md:mx-8"
      onClick={() => handleArrowClick('left')}
    >
      ←
    </button>
    {/* Right Arrow Button */}
    <button
      className="text-xl p-2 rounded-full mx-4 sm:mx-6 md:mx-8"
      onClick={() => handleArrowClick('right')}
    >
      →
    </button>
  </div>
</div>




<div class="flex flex-col sm:flex-row justify-between items-center p-5 mt-16 sm:mt-32">

  {/* <div class="text-xl sm:text-2xl md:text-3xl lg:text-xl font-aeonik font-bold mb-4 sm:mb-0 mr-10 text-center sm:text-left">
    We Partner With the best.
  </div> */}
<div class="text-xl sm:text-xl md:text-2xl lg:text-5xl font-aeonik font-bold mb-4 sm:mb-0 mr-10 text-center sm:text-left">
  We Partner Big
</div>

 
  <div class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-aeonik text-center sm:text-left">
    Working with manufacturers
    <span class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">who are ahead of the curve</span>
    <span class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">gives us access to a wide range of</span>
    <span class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">hardware solutions.</span>
  </div>
</div>



    

      {/* Scrollable Images */}
      <div className="relative w-full mt-16">
      {/* Image Slider */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-scroll px-4 py-6 cursor-grab scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0])}
        onTouchMove={(e) => onDrag(e.touches[0])}
        onTouchEnd={stopDrag}
      >
        <div className="flex gap-6">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[720px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative rounded-lg overflow-hidden border-4 border-gray-300 hover:scale-105 transition-transform ease-in-out"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
              {/* <div className="absolute bottom-2 left-2 w-[120px] sm:w-[180px] lg:w-[220px] h-[60px] sm:h-[80px] lg:h-[100px] border-2 border-gray-300 overflow-hidden rounded-lg ml-2 mb-2">
                <img
                  src={smallImages[index]}
                  alt={`Small ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Buttons below the image slider */}
      <div className="flex justify-center items-center px-4 mb-4 mt-6">
        <button
          onClick={scrollLeftBtn}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full mx-2"
        >
          ←
        </button>
        <button
          onClick={scrollRightBtn}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full mx-2"
        >
          →
        </button>
      </div>

      {/* Hide scrollbar (optional fallback) */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
    
    

<div className="mt-6 pb-8">
  <div className="flex flex-wrap justify-between px-4">
    {/* Left Section */}
    <div className="text-xl font-semibold ml-0 sm:ml-12 font-aeonik">
     
    </div>

 
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

  
       <div className="bg-white-50 py-16">
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
          <span className="hover:underline transition-all duration-300 mt-2 ">tgwbin@gmail.com</span>
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
   
{popupOpen && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full relative h-auto max-h-[90vh] lg:max-h-[95vh] overflow-y-auto animate-slideUp">
      
      {/* Elegant Close Button */}
      <button
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white hover:rotate-90 transition-all duration-300"
        onClick={handlePopupClose}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-10">
        
        {/* Left Side - Image Section */}
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <img
                src={popupContent.image}
                alt="Product"
                className="w-full h-auto object-cover transform group-hover:scale-110 transition duration-700"
              />
              {/* Premium Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <span className="text-yellow-300">★</span> BEST SELLER
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🎯 LIMITED
                </span>
              </div>
              {/* Discount Badge */}
              <div className="absolute bottom-4 right-4">
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🔥 HOT DEAL
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚚</div>
              <div className="text-xs font-semibold text-gray-700">Free Shipping</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-3 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🔒</div>
              <div className="text-xs font-semibold text-gray-700">Secure Payment</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-3 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🛡️</div>
              <div className="text-xs font-semibold text-gray-700">2 Yr Warranty</div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="space-y-6">
          {/* Title with Badge */}
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
              ✨ PREMIUM PRODUCT
            </div>
            {/* <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              Premium Product
            </h2> */}
             <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                    {popupContent?.name || popupContent?.title || popupContent?.product_name || "Premium EV Charger"}
                  </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mt-3"></div>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Key Features</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {popupContent.features.split(',').map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-125 transition">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">{feature.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Technical Specifications</h3>
            </div>

            {popupContent.details && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(popupContent.details).map(([key, value], index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                          <td className="py-3 px-4 font-semibold text-gray-700 border-r border-gray-100 w-2/5">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                              {key}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Price & CTA Section */}
          <div className="pt-4 border-t-2 border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                {popupContent.price && (
                  <>
                    <div className="text-sm text-gray-500 mb-1">Special Price</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">₹{popupContent.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{Math.round(popupContent.price * 1.3)}</span>
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Save 30%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        In Stock
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600 text-sm">Free Delivery</span>
                    </div>
                  </>
                )}
              </div>

              <button
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                onClick={handleBuyNowClick}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3" />
                  </svg>
                  <span>Buy Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-5 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 group cursor-pointer">
                <svg className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="group-hover:text-gray-700">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 group cursor-pointer">
                <svg className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="group-hover:text-gray-700">24/7 Support</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 group cursor-pointer">
                <svg className="w-4 h-4 text-green-500 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="group-hover:text-gray-700">Quick Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HomePage;
