import React, { useState,useRef} from 'react';
import Navbar from './Navbar';  
import { Link } from 'react-router-dom';
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
import image9 from '../assets/slide5.jpg';
import mobile from '../assets/mobile.jpg';
import new1 from '../assets/nwe1.jpg';
import new2 from '../assets/new2.jpg';
import AC01W from '../assets/newac01w.png';
import AC02P from '../assets/AC02P3.png';
import AC02P7 from '../assets/AC02P7.4.png';
import AC02WCH from '../assets/AC02WC&H.png';
import AC03W7 from '../assets/AC03W7.png';
import AC03W22 from '../assets/Ac03w3.png';
import DC04W from '../assets/DC04W.png';
import DC04G60 from '../assets/DC04G60.png';
import DC04G150 from '../assets/DC04G150.png';
import { useNavigate } from 'react-router-dom';
 import { useEffect } from 'react';
 import logos from '../assets/up.png';
 import mob from '../assets/workplace1.jpg';
 import red from '../assets/red.png';
 import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo1 from '../assets/tv.png';
import { Helmet } from "react-helmet";
const Workplace = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineColor, setUnderlineColor] = useState('gray');
  const [activeIndex, setActiveIndex] = useState(null);
  
  const handleContactClick = () => {
    navigate('/contact');
  };
  // FAQ data
  const faqs = [
    {
      question: "What are the benefits of installing EV charging stations at my business?",
      answer:
        "Installing EV charging stations can attract more customers and employees, increase footfall and satisfaction, generate additional revenue through charging fees, and improve your brand's sustainability image. Additionally, you may benefit from government incentives and differentiate your business from competitors",
    },
    {
      question: "What types of EV charging solutions are available for businesses?",
      answer:
        "There are diverse range of chargers available. Contact us to know more about the best solution for your business. You can also check above for more details.",
    },
    {
      question: " What is the process for installing EV charging stations at my business?",
      answer:
        "Customers can reach out to us through our 'Contact Us' portal with the required details, which would then be forwarded to the relevant team members. Our team will promptly reach out to discuss and propose suitable solutions based on your specific requirements. ",
    },
    {
      question: "How long does the installation process take?",
      answer:
        "It very much depends on the location & type of solution chosen. Generally it may take about 6-8 weeks.",
    },
    {
      question: "What are the costs associated with installing and maintaining EV charging stations?",
      answer:
        "The cost associated with depends on various factor such as charger type, capacity, location and civil & power infrastructure. Similarly, operational costs depend on power and other related expenses.",
    },
    {
      question: "What kind of support and maintenance services are available for business charging stations?",
      answer:
        "We are open to listen 24/7. Customers can call 033-4601-5366 for support or email for maintenance services.",
    },
  ];

  const [popupContent, setPopupContent] = useState({
      image: '',
      description: '',
      details: {},
      features: '',
      name: ''
    });
    
    const handlePopupOpen = (image, description, features, details, name) => {
      setPopupContent({ image, description, details, features, name });
       console.log("Opening popup with name:", name);
      setPopupOpen(true);
    };
    
    const handlePopupClose = () => {
      setPopupOpen(false);
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
   useEffect(() => {
      window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
    }, []);
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
    };
  return (
    <div className="min-h-screen bg-white-50">
      <Helmet>
        <title>Workplace EV Charging Solutions | TransEv</title>
        <meta
          name="description"
          content="Discover workplace electric vehicle (EV) charging solutions. Install AC & DC chargers, support employees, and future-proof your organization."
        />
        <meta name="keywords" content="EV charging, workplace charging, electric vehicle, AC chargers, DC chargers, employee benefits" />
        <meta property="og:title" content="Workplace EV Charging Solutions | YourCompany" />
        <meta property="og:description" content="Support employees with convenient EV charge point access. Install the best AC and DC charging solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/workplace-charging" />
        <meta property="og:image" content="https://transev.site/images/workplace-og.jpg" />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Navbar Section */}
      <Navbar />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div> 
      
   <section className="text-center py-16 sm:py-20 bg-white">
<h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-aeonik text-black-800 mt-10 sm:mt-16 lg:mt-20 px-4 sm:px-10 lg:px-32 xl:px-40 text-center lg:text-left">
 

 Workplace<br />
    <span className="inline-block">Charging solutions</span>
  </h2>

  <div className="flex justify-center lg:justify-start mt-12 sm:mt-16 px-4 sm:px-10 lg:px-32 xl:px-40">
  <button className="relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-yellow-300 text-white font-semibold rounded-full group transition-all duration-300 ease-in-out">
    {/* <span className="opacity-100 translate-x-0 transition-all duration-300 ease-in-out text-sm sm:text-base md:text-lg">
      Contact us
    </span> */}
<Link to="/contact">
  <span className="transition-all duration-300 ease-in-out cursor-pointer">
    Contact us
  </span>
</Link>
    <div className="ml-3 sm:ml-4 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-300 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:w-16 group-hover:ml-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:opacity-0 group-hover:translate-x-10 transition-all duration-300 ease-in-out" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
  </button>
</div>

</section>

      {/* Future-Proof Your Sites Section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-16 md:py-20 bg-white-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
  
  {/* Left Side - Heading */}
  <div className="w-full lg:w-1/2">
    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-snug">
      Support your employees <br />with convenient charge <br />point access.
    </h3>
  </div>

  {/* Right Side - Button/Link */}
  

</section>


      {/* Background Image Section */}
      <section
  className="relative w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[97%] mx-auto min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[800px] xl:min-h-[900px] bg-cover bg-center rounded-lg py-20 sm:py-28 md:py-32 lg:py-40"
  style={{
    backgroundImage: `url(${yourImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }}
>
  {/* Optional content goes here */}
</section>


<section className="flex flex-col lg:flex-row py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 gap-10 lg:gap-0 mt-10 lg:mt-30">
  {/* Left Side */}
  <div className="w-full lg:w-1/2 pr-0 lg:pr-10">
    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black mb-6">
      We’ll identify and <br /> install the best <br /> solution for you.
    </h2>

   

    {/* Content Sections */}
    <div className="text-gray-400 space-y-10 mb-20">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-black mt-20">
          Meet growing employee demand
        </h3>
        <p className="text-base sm:text-lg font-semibold">
          As the uptake of electric vehicles increases, having access to a charge
          point at work will become increasingly important to your staff.
          Being able to charge their vehicle while they work will be seen
          as a valuable employee benefit.
        </p>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
          Customized Solutions
        </h3>
        <p className="text-base sm:text-lg font-semibold">
          No two organisations’ EV charge point requirements are the same,
          so we see every project as a blank canvas, taking into consideration
          the size of your workforce, your site’s electrical capacity and any
          plans to upscale in the future.
        </p>
      </div>
       <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-6 mt-20">
      <a
        href="/contact"
        className="text-blue-800 hover:underline hover:text-green-800 "
      >
        Ready to get started? Contact us
      </a>
    </p>
    </div>
  </div>

  {/* Right Side (Image) */}
  <div className="w-full lg:w-1/2 flex justify-center items-center">
    <img
      src={mob} // Replace with actual path
      alt="EV Charging"
      className="w-full sm:w-[80%] md:w-[90%] lg:w-full max-h-[900px] object-cover rounded-lg"
    />
  </div>
</section>

<section className="py-10 sm:py-16 md:py-20 bg-white-100 mx-4 sm:mx-6 lg:mx-8 rounded-lg sm:mr-0 lg:mr-70">
  <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
    
    {/* Left Side */}
    <div className="w-full lg:w-1/2 text-center lg:text-left">
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-4 sm:mr-6 lg:mr-40">
        Take a look at the products we can <br className="hidden sm:block" />
        install for your organization's charging needs
      </h2>
    </div>

    <div className="w-full sm:w-2/3 lg:w-1/2 text-center sm:text-left mt-8 sm:mt-0 mx-auto lg:ml-0">
  <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-7xl font-semibold text-gray-800 mb-4 max-w-full">
    <span className="whitespace-nowrap block">Accessible chargepoints</span>
    {/* <span className="whitespace-nowrap block">Suitable</span> */}
    <span className="whitespace-nowrap block"> Across Organizations</span>
    {/* <span className="whitespace-nowrap block">drivers.</span> */}
  </h2>
</div>  
</div>
</section>
<div className="flex justify-center items-center mb-8 px-4 sm:px-8 lg:px-16">
  <div
    ref={containerRef}
    id="box-container"
    className="flex overflow-x-auto gap-8 py-8 px-4 sm:px-6 lg:px-10 relative"
    style={{
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      overflowY: 'hidden',
    }}
    onScroll={handleScroll}
  >
    {[ 
      //  { name: 'AC01W', description: '3.3 kW', features: 'Model No:TE-AC-01W-3.3,Rating: 3.3 kW,Single Connector,GSM/Wi-Fi/BLE', image: AC01W,details: {
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
         { name: 'DC 120 kW', description: '120 kW', features: 'Model No:TE-DC-04G-120,Rating:120 kW,High Speed Charging,OCPP1.6J Or Latest | RFID', image: DC04G150,details: {
           'Dimensions':'WxDxH (1150 mm x 625 mm x 2000 mm)',
          'Rated Power': '120 kW',
          'Input Voltage': '304V - 456V AC',
          'Number of Output':'2 or 3',
          'Output Current':'250 A',
          'Output charging Outlet ':'ccs2 DC connectors,BS EN 62196,IP55',
          'Operating Temperature':'-35°C to +60°C',
          'Connectivity':'Wi-Fi, GSM,Bluetooth,LED Indication',
          'Charging Operation':'QR code based/Scan code / App based authentication',
          'Mechanical Protection':'IP54',
          'Safety':'IEC EN61851, EN62196, DIN70121, ISO15118',
         'Mounting': 'Ground/Floor Mounting',}},
           { name: 'AC 7.4 kW', description: '7.4 kW', features: 'Model No:TE-AC-03W-7.4,Rating: 7.4 kW,Single Connector,GSM/Wi-Fi/BLE/4G', image: AC03W7,
           details: {
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
          'Safety':'IEC/EN 61851-1, EN 62311, EN 62479, IEC/EN 62955',
         'Mounting': 'Wall or floor using a pedestal',}},
               { name: 'AC 22 kW', description: ' 22 kW', features: 'Model No:TE-AC-03W-22,Rating: 22 kW,Single Connector,GSM/Wi-Fi/BLE/4G', image: AC03W22 ,details: {
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
    ].map((box, index) => (
      <div key={index} className="flex flex-col items-center">
        <div
          className="box bg-gray-200 p-6 sm:p-8 lg:p-16 rounded-lg relative cursor-pointer hover:scale-105 transform transition-all duration-300 w-[300px] sm:w-[400px] lg:w-[550px] h-[500px] sm:h-[650px] lg:h-[600px]"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex justify-center items-center w-full h-3/4">
            <img
              src={box.image}
              alt={box.name}
              className="w-3/4 h-4/4 object-cover rounded-lg mt-20 cursor-pointer"
              onClick={() => handlePopupOpen(box.image, box.description, box.features,box.details,box.name)}
            />
          </div>

          <div
            className={`absolute top-4 right-4 bg-yellow-300 w-10 h-10 rounded-full flex justify-center items-center transition-all duration-300 ${
              hovered === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => handlePopupOpen(box.image, box.description, box.features,box.details,box.name)}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">{box.name}</h2>
          <p className="text-gray-600 mt-2">{box.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="relative mt-16 px-4 sm:px-8 lg:px-16">
  {/* Underline Section with margin on both sides */}
  <div
    className="transition-all duration-500"
    style={{
      height: '2px',
      width: `${underlineWidth}%`,
      backgroundColor: underlineColor,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  ></div>



  <div className="flex justify-end w-full absolute bottom-2 right-4 px-4">
    <button
      className="text-xl p-2 rounded-full mx-4"
      onClick={() => handleArrowClick('left')}
    >
      ←
    </button>
    <button
      className="text-xl p-2 rounded-full mx-4"
      onClick={() => handleArrowClick('right')}
    >
      →
    </button>
  </div>
</div>

<section
  className="relative py-32 sm:py-40 lg:py-140 bg-cover bg-center rounded-lg mx-8 px-4 sm:px-8 lg:px-32 mt-12 sm:mt-16 lg:mt-50"
  style={{
    backgroundImage: `url(${red})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }}
>
  {/* Your content */}
</section>

<section className="flex flex-col lg:flex-row py-20 px-8">
  {/* Left Side */}
  <div className="w-full lg:w-1/2 pr-10 mb-10 lg:mb-0">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-black mb-1 mt-20">
      The benefits of investing.
    </h2>
  </div>

  {/* Right Side (Contact Us) */}
  <div className="w-full lg:w-1/2 text-center lg:text-right">
    <p className="text-xl font-semibold text-gray-700 mb-2 lg:ml-10 mt-20">
      <a
        href="/contact" // Link to your Contact Us page
        className="text-black hover:underline hover:text-blue-800"
      >
        Ready to get started? Contact Us
      </a>
    </p>
  </div>
</section>
   <div className="border-t-2 border-gray-300 w-full mb-8 mt-10"></div>
<div>
{/* ROWS START */}
{[
  {
    number: "01",
    title: "Boost recruitment ",
    desc: " Providing workplace charging will show your commitment to employees, increase staff satisfaction and help to attract the best future candidates..",
    img: new1,
  },
  {
    number: "02",
    title: "Hit sustainability targets ",
    desc: " Reducing the environmental impact of your employees’ commute will help you achieve your sustainability goals.",
    img: new2,
  },
  {
    number: "03",
    title: " Boost your reputation",
    desc: " With climate change high on today’s agenda, providing charge point access at your workplace demonstrates your commitment to sustainability to both customers and staff.",
    img: image5,
  },
  
].map((item, index) => (
  <div key={index}>
    <div className="w-full flex flex-wrap items-start justify-center lg:justify-start mb-12 px-4 lg:px-20">
      {/* Left Side (Image) */}
      <div className="w-1/3 sm:w-1/4 lg:w-1/5 flex justify-center items-center mb-4 sm:mb-0">
        <img
          src={item.img}
          alt={`EV Charging ${item.number}`}
          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-80 lg:h-48 rounded-lg object-cover"
        />
      </div>

      {/* Right Side (Text) */}
      <div className="w-full sm:w-3/4 lg:w-4/5 flex items-center">
        <div className="flex flex-col sm:flex-row sm:items-start sm:pl-6 lg:pl-12">
          {/* Number */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-start mb-2 sm:mb-0 sm:mr-6 lg:ml-60">
            <h3 className="text-3xl sm:text-4xl font-semibold text-center sm:text-left lg:text-5xl">
              {item.number}
            </h3>
          </div>

          {/* Content */}
          <div className="text-center sm:text-left sm:pr-4 lg:pr-12 lg:ml-50">
            <p className="text-lg sm:text-2xl text-black font-semibold leading-snug mb-2 lg:text-5xl">
              {item.title}
            </p>
            <p className="text-gray-500 text-sm sm:text-base lg:text-xl">
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t-2 border-gray-300 w-full mb-8 mt-10"></div>
  </div>
))}
<div/>



<section className="py-12 sm:py-16 lg:py-20 bg-white mx-4 sm:mx-6 lg:mx-8 rounded-lg">
  <div className="container mx-auto flex flex-col-reverse lg:flex-row justify-between items-center gap-10">

    {/* Left Side - Text */}
    <div className="w-full lg:w-1/2 text-center lg:text-left px-4 sm:px-6 lg:px-0">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 sm:mb-8">
        Not sure about the best solution for you?
      </h2>
    </div>

    {/* Right Side - Image */}
    <div className="w-full lg:w-1/3 flex justify-center items-center px-4 sm:px-6 lg:px-0 lg:flex-row-reverse">
      <img
        src={image} // Use your actual image path
        alt="Solution Image"
        className="w-full sm:w-[80%] md:w-[70%] lg:w-[90%] max-h-[300px] object-cover rounded-xl shadow-lg"
      />
    </div>

  </div>
</section>

<section className="py-12 sm:py-16 lg:py-20 bg-white-100 w-full px-6 lg:px-20">
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
        <div className="flex justify-between items-start ">
          {/* Left side - Question Number */}
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
              {`0${index + 1}`}
            </span>
          </div>

          {/* Right side - Question Text */}
          <div className="flex-1 ml-20">
            <span className="text-xl sm:text-2xl lg:text-3xl text-gray-800">
              {faq.question}
            </span>
          </div>

          {/* Right side - Toggle Icon ( + or - ) */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)} // Toggle the active FAQ
          >
            <div
              className={`flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full ${
                activeIndex === index ? "bg-gray-300" : "bg-yellow-300"
              }`}
            >
              {activeIndex === index ? (
                <FaMinus className="text-black" />
              ) : (
                <FaPlus className="text-black" />
              )}
            </div>
          </div>
        </div>

        {/* Answer Section - Display when active */}
        {activeIndex === index && (
          <div className="mt-4 text-gray-600 text-lg sm:text-xl lg:text-2xl ml-4 sm:ml-8 lg:ml-16">
            <p>{faq.answer}</p>
          </div>
        )}
      </div>
    ))}
  </div>
</section>

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
         <div className="bg-white-50 py-16 mx-auto sm:ml-6 ">
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
   
      {popupOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fadeIn">
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

      {/* Main Content - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-10">
        
        {/* Left Section - Image with Premium Effects */}
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
                <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🔥 LIMITED
                </span>
              </div>
              {/* Discount Badge */}
              <div className="absolute bottom-4 right-4">
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🎯 HOT DEAL
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚚</div>
              <div className="text-xs font-semibold text-gray-700">Free Delivery</div>
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

        {/* Right Section - Content */}
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

          {/* Features Section - Card Style */}
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
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        In Stock
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">Free Shipping</span>
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
                <span className="group-hover:text-gray-700">4.9/5 (2.1k reviews)</span>
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
                <span className="group-hover:text-gray-700">2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
       </div>
       </div>
     );
   };
   
   export default Workplace;
