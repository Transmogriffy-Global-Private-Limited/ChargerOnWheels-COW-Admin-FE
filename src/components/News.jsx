
import React, { useEffect } from 'react';
import Navbar from './Navbar';  
import logo from '../assets/transev logo.png';  
import newsImage1 from '../assets/image1.png';  
import newsImage2 from '../assets/imagee2.jpg';  
import newsImage3 from '../assets/new3.jpg';  
import newsImage4 from '../assets/holiday.jpg';  
import newsImage5 from '../assets/nwe1.jpg';  
import newsImage6 from '../assets/c4.png';  
import newsImage7 from '../assets/c1.png';  
import newsImage8 from '../assets/new4.png';  
import newsImage9 from '../assets/image.png';  
import logos from '../assets/up.png';
import logo1 from '../assets/tv.png';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
const newsArticles = [
  {
    id: 1,
    title: "E-Rickshaws Drive EV Sales increase in West Bengal",
    date: "April 2, 2024",
    description: "A total of 1,25,531 electric vehicles, including battery-operated ones, were registered in Bengal till Dec 2024.",
    image: newsImage1,
    link: "#"
  },
  {
    id: 2,
    title: "Electric vehicles make an impact: EV sales soar at the start of New Year",
    date: "March 28, 2025",
    description: "The electric wave has reached Calcutta, and the city is slowly but surely adopting battery-electric vehicles (BEVs) as a mode of transport.",
    image: newsImage2,
    link: "#"
  },
  {
    id: 3,
    title: "Kolkata to Get India’s Largest EV Charging Hub, Second Biggest Globally",
    date: "March 22, 2025",
    description: "It will be the second-largest EV charging hub in the world with 300 chargers, he said, adding that China has the largest facility housing 650 chargers at a single location",
    image: newsImage3,
    link: "#"
  },
  {
    id: 4,
    title: "India world's largest 3 wheeler EV market - 2nd year in a row - factors behind driving the surge",
    date: "March 15, 2025",
    description: "It will be the second-largest EV charging hub in the world with 300 chargers, he said, adding that China has the largest facility housing 650 chargers at a single location.",
    image: newsImage4,
    link: "#"
  },
  {
    id: 5,
    title: "Bengal records 1.2L e-vehicles, govt offers tax cut for green transport ",
    date: "March 10, 2025",
    description: "To further incentivise the adoption of electric vehicles, the state's transport department would offer reduced tax rattes for EVs, making it more affordable for individuals as well as businesses.",
    image: newsImage5,
    link: "#"
  },
  {
    id: 6,
    title: "India Leads Electric Three-Wheeler Market",
    date: "March 5, 2025",
    description: "A new smart grid technology is being implemented by Energy Park, which promises to enhance the efficiency of power distribution across citieWith over 90% of both conventional and electric 3W sales coming from China and India combined, the market is extremely concentrated.",
    image: newsImage6,
    link: "#"
  },
  {
    id: 7,
    title: "EV dilemma: Pragmatic Indian buyers fight between reliability and novelty",
    date: "Friday May 16, 2025",
    description: "Reliability remains at the heart of automotive decision-making in India. For many, automobiles are long-term investments, and consumers seek assurance in areas like EV battery life, driving range, and service accessibility",
    image: newsImage7,
    link: "#"
  },
  {
    id: 8,
    title: "Going electric: On India and the electric vehicle space",
    date: "February 20, 2025",
    description: "India’s decision to exempt import duties on 35 capital goods used in the manufacture of electric vehicle (EV) batteries and 28 items used in the making of mobile phone batteries is a welcome step toward boosting domestic manufacturing and clean technology adoption.",
    image: newsImage8,
    link: "#"
  },
  {
    id: 9,
    title: "Trends in electric car markets – Global EV Outlook 2025 – Analysis",
    date: "February 15, 2025",
    description: "Global electric car sales exceeded 17 million in 2024.More than 20% of new cars sold worldwide were electric.Electric car sales topped 17 million worldwide in 2024, rising by more than 25%.",
    image: newsImage9,
    link: "#"
  }
];
 
function NewsPage() {
   useEffect(() => {
        window.scrollTo(0, 0); // Ensures the page scrolls to the top whenever the page is loaded
      }, []);
  return (
    <div className="min-h-screen bg-white">
       <Helmet>
        <title>Latest EV News | TransEV Updates & Insights</title>
        <meta
          name="description"
          content="Stay updated with the latest electric vehicle news, trends, and innovations in India and globally. Read articles on EV sales, charging hubs, and industry insights."
        />
        <link rel="canonical" href="https://transev.site/news" />
<meta name="robots" content="index, follow" />
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Latest EV News | TransEV Updates & Insights" />
        <meta property="og:description" content="Stay updated with the latest electric vehicle news, trends, and innovations in India and globally." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/news" />
        <meta property="og:image" content="https://transev.site/images/news-og.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest EV News | TransEV Updates & Insights" />
        <meta name="twitter:description" content="Stay updated with the latest electric vehicle news, trends, and innovations in India and globally." />
        <meta name="twitter:image" content="https://transev.site/images/news-og.jpg" />

        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Navbar Section */}
      <Navbar />
      <div className="absolute top-0 w-full border-b-6 border-yellow-300 z-10"></div>

      {/* Latest News Section */}
      <section className="py-16 px-4 md:px-16">
        <h1 className="text-4xl sm:text-5xl lg:text-9xl font-bold text-black mt-12">Latest news</h1>
        <p className="mt-5 text-xl sm:text-2xl text-gray-500">All the latest news and articles from TransEV.</p>
      </section>

      <section className="px-4 md:px-16 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="zoom-image w-full h-80 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-sm sm:text-base text-gray-500 mt-2">{article.date}</h3>
                <h2 className="text-xl sm:text-2xl font-semibold text-black mt-5">{article.title}</h2>
                <p className="mt-4 text-gray-700 text-sm sm:text-base">{article.description}</p>
                <div className="flex justify-between items-center mt-6">
                  <a href={article.link} className="text-yellow-500 font-semibold hover:text-black">
                    Read More
                  </a>
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer">
                    <a href={article.link}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom CSS for Zoom-In Effect */}
      <style jsx>{`
        .zoom-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .zoom-image:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .zoom-image:active {
          transform: scale(1.05);
        }
      `}</style>

      {/* Footer Section */}
      <div className="mt-20 border-t-2 border-gray-300 mx-8 "></div>
      <div className="bg-white py-16 mt-10">
        <div className="container mx-auto flex justify-between items-center px-8">
          <div className="flex items-center space-x-4">
            <img src={logo1} alt="TransEV Logo" className="w-32 h-32" />
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              <a href="tel:+02033453310" className="relative inline-block hover:text-black">
                <span className="hover:underline">033-4601 5366</span>
              </a>
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-800">
              <a href="mailto:tgwbin@gmail.com" className="relative inline-block hover:text-black">
                <span className="hover:underline">tgwbin@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-10 border-t-2 border-gray-300 mx-8"></div>
      <footer className="bg-white text-black py-8 mt-20">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between px-8">
          {/* First Section */}
          <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
            <h4 className="text-xl font-semibold mb-4">
             Pioneers in smart EV charging solutions <br/> 
            </h4>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-yellow-500 hover:text-black"
            >
              <span>Client portal</span>
              <div className="ml-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
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

          {/* Second Section */}
          <div className="w-full sm:w-2/3 flex flex-col sm:flex-row justify-between sm:space-x-12 mt-10 sm:mt-0">
            <div className="mb-8 sm:mb-0">
              <h5 className="text-lg font-semibold mb-5">Navigation</h5>
              <ul className="space-y-2">
                <li><a href="/solution" className="text-gray hover:underline">Solutions</a></li>
                <li><a href="/contact" className="text-gray hover:underline">Contact</a></li>
                <li><a href="/about" className="text-gray hover:underline">About</a></li>
               
              </ul>
            </div>

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

            <div>
              <h5 className="text-lg font-semibold mb-5">Legal</h5>
              <ul className="space-y-2">
                <li><a href="/terms-conditions" className="text-gray hover:underline">Terms & Conditions</a></li>
                <li><a href="/privacy-policy" className="text-gray hover:underline">Privacy Policy</a></li>
                   <li><a href="/shipping-policy" className="text-gray hover:underline text-lg">Shipping Policy</a></li>
                        <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center mt-8 text-lg sm:mr-4 md:mr-8 lg:mr-16 xl:mr-300">
  <p>&copy; TransEV 2025. All Rights Reserved.</p>
</div>

      </footer>
    </div>
  );
}

export default NewsPage;
