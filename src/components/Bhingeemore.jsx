// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FiArrowLeft,
//   FiArrowUpRight,
//   FiMapPin,
//   FiZap,
//   FiClock,
//   FiShield,
//   FiNavigation,
// } from 'react-icons/fi';
// import Navbar from './Navbar';

// // ============================================================
// // ASSETS
// // Update these paths to match wherever you actually placed the
// // photos in src/assets/. Using the filenames from your project.
// // ============================================================
// import gateChargers from '../assets/bhiringee-gate-chargers.jpg';
// import wideSignage from '../assets/bhiringee-wide-signage.jpg';
// import carCharging from '../assets/bhiringee-car-charging.jpg';
// import frontView from '../assets/font.jpg';
// import roadsideView from '../assets/bhiringee-roadside-view.jpg';

// // ============================================================
// // STATION RECORD
// // ============================================================
// const station = {
//   name: 'Bhiringee More',
//   city: 'Durgapur',
//   region: 'West Bengal',
//   status: 'Live',
//   operator: 'TransEV, in collaboration with WBSEDCL',
//   chargers: 2,
//   connectorPoints: 4,
//   connectorTypes: ['CCS2', 'Type 2'],
//   hero: carCharging,
//   gallery: [
//     { src: frontView, caption: 'Straight-on view of the charging bay, with both dual-gun units under cover.' },
//     { src: gateChargers, caption: 'The charging bay from the entrance — two Public EV Charging Station units side by side.' },
//     { src: wideSignage, caption: 'Full station footprint, with the WBSEDCL / TransEV signage board at the roadside edge.' },
//     { src: roadsideView, caption: 'The station as seen from the main road, ahead of the approach lane.' },
//   ],
// };

// const specs = [
//   { label: 'Status', value: station.status, icon: FiZap },
//   { label: 'Operator', value: station.operator, icon: FiShield },
//   { label: 'Chargers on site', value: `${station.chargers} dual-gun units`, icon: FiZap },
//   { label: 'Connector points', value: `${station.connectorPoints}`, icon: FiZap },
//   { label: 'Connector types', value: station.connectorTypes.join(' · '), icon: FiZap },
//   { label: 'Location', value: `${station.name}, ${station.city}`, icon: FiMapPin },
// ];

// const DurgapurBhiringeeStation = () => {
//   const [activeImage, setActiveImage] = useState(null);

//   return (
//     <div className="min-h-screen bg-[#F6F4EE] text-[#161A17]">
//       <Helmet>
//         <title>Bhiringee More Charging Station, Durgapur | TransEV</title>
//         <meta
//           name="description"
//           content="TransEV's public EV charging station at Bhiringee More, Durgapur — live now, in collaboration with WBSEDCL."
//         />
//       </Helmet>

//       <style>{`
//         .plex-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
//         .plex-sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
//       `}</style>
//       <link
//         href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />

//       <Navbar />

//       {/* ---------------------------------------------------------
//           TOP BAR
//       --------------------------------------------------------- */}
//       <div className="border-b border-[#D8D3C4]">
//         <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between plex-sans">
//           <Link
//             to="/blog"
//             className="inline-flex items-center gap-2 text-sm text-[#3E4740] hover:text-[#0E2F23] transition-colors"
//           >
//             <FiArrowLeft />
//             All charging stations
//           </Link>
//           <span className="plex-mono text-xs tracking-tight text-[#6B7268]">
//             {station.city.toUpperCase()} · {station.name.toUpperCase()}
//           </span>
//         </div>
//       </div>

//       {/* ---------------------------------------------------------
//           HERO
//       --------------------------------------------------------- */}
//       <section className="relative">
//         <div className="relative h-[52vh] sm:h-[64vh] w-full overflow-hidden">
//           <img
//             src={station.hero}
//             alt={`EV charger in use at ${station.name}, ${station.city}`}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0E2F23]/85 via-[#0E2F23]/10 to-transparent" />

//           <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-5 sm:px-8 pb-8 sm:pb-10 w-full">
//             <div className="flex items-center gap-2 mb-3">
//               <span className="w-2 h-2 rounded-full bg-[#7FD9A8] animate-pulse" />
//               <span className="plex-mono text-xs tracking-wide text-[#CFE9DA]">
//                 Station live — accepting vehicles
//               </span>
//             </div>
//             <h1 className="plex-sans font-semibold text-white text-4xl sm:text-6xl leading-[1.02]">
//               {station.name}
//             </h1>
//             <p className="plex-sans text-[#DDE7E0] text-base sm:text-lg mt-2 max-w-xl">
//               Public EV charging station on the Durgapur–Bhiringee stretch, run by TransEV with WBSEDCL.
//             </p>
//           </div>
//         </div>

//         {/* Plaque strip */}
//         <div className="bg-[#0E2F23] text-[#EFEEE6]">
//           <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap gap-x-8 gap-y-1 plex-mono text-xs">
//             <span>CITY: {station.city.toUpperCase()}</span>
//             <span>REGION: {station.region.toUpperCase()}</span>
//             <span>UNITS: {station.chargers} × DUAL-GUN</span>
//             <span>CONNECTORS: {station.connectorTypes.join(' / ').toUpperCase()}</span>
//           </div>
//         </div>
//       </section>

//       {/* ---------------------------------------------------------
//           BODY: PHOTO SET + SPEC PANEL
//       --------------------------------------------------------- */}
//       <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
//         {/* Left: story + gallery */}
//         <div>
//           <h2 className="plex-sans font-semibold text-2xl sm:text-3xl text-[#0E2F23]">
//             On the ground at Bhiringee More
//           </h2>
//           <p className="plex-sans text-[#3E4740] mt-3 max-w-xl leading-relaxed">
//             These photos were taken on site. Both charging units sit under a covered bay just off the main
//             road, with WBSEDCL and TransEV signage marking the entrance so drivers can spot it from the
//             street.
//           </p>

//           <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//             {station.gallery.map((item, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveImage(item)}
//                 className="group text-left rounded-none overflow-hidden border border-[#D8D3C4] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2F23]"
//               >
//                 <div className="aspect-[4/3] overflow-hidden">
//                   <img
//                     src={item.src}
//                     alt={item.caption}
//                     className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
//                   />
//                 </div>
//                 <div className="px-4 py-3 flex items-start justify-between gap-3">
//                   <p className="plex-sans text-sm text-[#3E4740] leading-snug">{item.caption}</p>
//                   <FiArrowUpRight className="mt-0.5 flex-shrink-0 text-[#0E2F23] opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right: spec panel, sticky */}
//         <aside className="lg:sticky lg:top-8 h-fit border border-[#D8D3C4] bg-white">
//           <div className="plex-mono text-xs tracking-wide text-[#6B7268] px-5 pt-5">
//             STATION RECORD
//           </div>
//           <div className="px-5 pb-5 pt-3 divide-y divide-[#E7E3D6]">
//             {specs.map((spec, i) => {
//               const Icon = spec.icon;
//               return (
//                 <div key={i} className="py-3 flex items-start gap-3">
//                   <Icon className="mt-0.5 text-[#4E8F76] flex-shrink-0" size={16} />
//                   <div>
//                     <p className="plex-mono text-[10px] tracking-wide text-[#8A9088]">
//                       {spec.label.toUpperCase()}
//                     </p>
//                     <p className="plex-sans text-sm text-[#161A17] mt-0.5">{spec.value}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="px-5 pb-5">
//             <a
//               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                 `${station.name} EV Charging Station ${station.city} West Bengal`
//               )}`}
//               target="_blank"
//               rel="noreferrer"
//               className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#0E2F23] text-white plex-sans text-sm font-medium py-3 hover:bg-[#123C2D] transition-colors"
//             >
//               <FiNavigation size={15} />
//               Get directions
//             </a>
//           </div>
//         </aside>
//       </section>

//       {/* ---------------------------------------------------------
//           FOOTER STRIP
//       --------------------------------------------------------- */}
//       <section className="border-t border-[#D8D3C4] bg-white">
//         <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <FiClock className="text-[#4E8F76]" />
//             <p className="plex-sans text-sm text-[#3E4740]">
//               Looking for a different location? The network page shows every TransEV station and its status.
//             </p>
//           </div>
//           <Link
//             to="/blog"
//             className="plex-sans text-sm font-medium text-[#0E2F23] inline-flex items-center gap-2 hover:gap-3 transition-all"
//           >
//             View all stations <FiArrowUpRight />
//           </Link>
//         </div>
//       </section>

//       {/* ---------------------------------------------------------
//           LIGHTBOX
//       --------------------------------------------------------- */}
//       <AnimatePresence>
//         {activeImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[100] bg-[#0E2F23]/95 flex items-center justify-center p-4 sm:p-8"
//             onClick={() => setActiveImage(null)}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.97 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.97 }}
//               className="max-w-4xl w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img src={activeImage.src} alt={activeImage.caption} className="w-full h-auto" />
//               <p className="plex-sans text-sm text-[#DDE7E0] mt-3">{activeImage.caption}</p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default DurgapurBhiringeeStation;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiMapPin,
  FiZap,
  FiClock,
  FiShield,
  FiNavigation,
  FiDollarSign,
  FiBookOpen,
  FiCheckCircle,
  FiSmartphone,
  FiBattery,
  FiCreditCard,
  FiThumbsUp,
} from 'react-icons/fi';
import Navbar from './Navbar';

// ============================================================
// ASSETS
// ============================================================
import gateChargers from '../assets/bhiringee-gate-chargers.jpg';
import wideSignage from '../assets/bhiringee-wide-signage.jpg';
import carCharging from '../assets/bhiringee-car-charging.jpg';
import frontView from '../assets/font.jpg';
import roadsideView from '../assets/bhiringee-roadside-view.jpg';

// ============================================================
// STATION RECORD
// ============================================================
const station = {
  name: 'Bhiringee More',
  city: 'Durgapur',
  region: 'West Bengal',
  status: 'Live',
  operator: 'TransEV, in collaboration with WBSEDCL',
  chargers: 2,
  connectorPoints: 4,
  connectorTypes: ['CCS2', 'Type 2'],
  pricePerKwh: '₹16.95',
  gst: '18% GST applicable',
  hero: carCharging,
  gallery: [
    { src: frontView, caption: 'Straight-on view of the charging bay, with both dual-gun units under cover.' },
    { src: gateChargers, caption: 'The charging bay from the entrance — two Public EV Charging Station units side by side.' },
    { src: wideSignage, caption: 'Full station footprint, with the WBSEDCL / TransEV signage board at the roadside edge.' },
    { src: roadsideView, caption: 'The station as seen from the main road, ahead of the approach lane.' },
  ],
};

// Pricing and charging steps for manual
const chargingSteps = [
  {
    icon: FiMapPin,
    title: 'Park at the station',
    description: 'Pull into the covered bay and switch off your vehicle. Ensure you are within cable reach of the charger.',
  },
  {
    icon: FiBattery, // replaced FiPlug with FiBattery
    title: 'Connect the cable',
    description: 'Select the appropriate connector (CCS2 or Type 2) and plug it securely into your vehicle’s charging port.',
  },
  {
    icon: FiSmartphone,
    title: 'Start via app or card',
    description: 'Use the TransEV mobile app or your RFID card to authenticate and start the charging session.',
  },
  {
    icon: FiCreditCard,
    title: 'Payment & pricing',
    description: `Charging costs ₹${station.pricePerKwh} per kWh + ${station.gst}. Payment is handled through the app or at the station terminal.`,
  },
  {
    icon: FiClock,
    title: 'Monitor the session',
    description: 'Track charging progress in real-time on the app. The charger will stop automatically when your vehicle is full or you end the session.',
  },
  {
    icon: FiThumbsUp,
    title: 'Disconnect and go',
    description: 'Unplug the cable, return it to the holster, and you’re ready to hit the road. Safe travels!',
  },
];

const specs = [
  { label: 'Status', value: station.status, icon: FiZap },
  { label: 'Operator', value: station.operator, icon: FiShield },
  { label: 'Chargers on site', value: `${station.chargers} dual-gun units`, icon: FiZap },
  { label: 'Connector points', value: `${station.connectorPoints}`, icon: FiZap },
  { label: 'Connector types', value: station.connectorTypes.join(' · '), icon: FiZap },
  { label: 'Location', value: `${station.name}, ${station.city}`, icon: FiMapPin },
  {
    label: 'Charging rate',
    value: `₹{station.pricePerKwh} / kWh + ${station.gst}`,
    icon: FiDollarSign,
  },
];

const DurgapurBhiringeeStation = () => {
  const [activeImage, setActiveImage] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#161A17]">
      <Helmet>
        <title>Bhiringee More Charging Station, Durgapur | TransEV</title>
        <meta
          name="description"
          content="TransEV's public EV charging station at Bhiringee More, Durgapur — live now, in collaboration with WBSEDCL."
        />
      </Helmet>

      <style>{`
        .plex-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .plex-sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .shadow-card { box-shadow: 0 4px 24px rgba(14, 47, 35, 0.06), 0 1px 4px rgba(14, 47, 35, 0.04); }
        .shadow-card-hover { box-shadow: 0 12px 48px rgba(14, 47, 35, 0.10), 0 4px 16px rgba(14, 47, 35, 0.06); }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Navbar />

      {/* ---------------------------------------------------------
          TOP BAR
      --------------------------------------------------------- */}
      <div className="border-b border-[#D8D3C4] bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between plex-sans">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#3E4740] hover:text-[#0E2F23] transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
            All charging stations
          </Link>
          <span className="plex-mono text-xs tracking-tight text-[#6B7268]">
            {station.city.toUpperCase()} · {station.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------
          HERO
      --------------------------------------------------------- */}
      <section className="relative">
        <div className="relative h-[52vh] sm:h-[64vh] w-full overflow-hidden">
          <img
            src={station.hero}
            alt={`EV charger in use at ${station.name}, ${station.city}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E2F23]/85 via-[#0E2F23]/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-5 sm:px-8 pb-8 sm:pb-10 w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#7FD9A8] animate-pulse" />
              <span className="plex-mono text-xs tracking-wide text-[#CFE9DA]">
                Station live — accepting vehicles
              </span>
            </div>
            <h1 className="plex-sans font-semibold text-white text-4xl sm:text-6xl leading-[1.02]">
              {station.name}
            </h1>
            <p className="plex-sans text-[#DDE7E0] text-base sm:text-lg mt-2 max-w-xl">
              Public EV charging station on the Durgapur–Bhiringee stretch, run by TransEV with WBSEDCL.
            </p>
          </div>
        </div>

        {/* Plaque strip with pricing highlight */}
        <div className="bg-[#0E2F23] text-[#EFEEE6]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-x-8 gap-y-1 plex-mono text-xs">
            <span>CITY: {station.city.toUpperCase()}</span>
            <span>UNITS: {station.chargers} × DUAL-GUN</span>
            <span>CONNECTORS: {station.connectorTypes.join(' / ').toUpperCase()}</span>
            <span className="ml-auto flex items-center gap-1.5 bg-[#B5651D]/20 px-3 py-1 rounded-full">
              {/* <FiDollarSign size={12} /> */}
              {station.pricePerKwh}/kWh + {station.gst}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          BODY: PHOTO SET + SPEC PANEL
      --------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
        {/* Left: story + gallery */}
        <div>
          <h2 className="plex-sans font-semibold text-2xl sm:text-3xl text-[#0E2F23]">
            On the ground at Bhiringee More
          </h2>
          <p className="plex-sans text-[#3E4740] mt-3 max-w-xl leading-relaxed">
            These photos were taken on site. Both charging units sit under a covered bay just off the main
            road, with WBSEDCL and TransEV signage marking the entrance so drivers can spot it from the
            street.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {station.gallery.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(item)}
                className="group text-left rounded-none overflow-hidden border border-[#D8D3C4] bg-white shadow-card hover:shadow-card-hover transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2F23]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="px-4 py-3 flex items-start justify-between gap-3">
                  <p className="plex-sans text-sm text-[#3E4740] leading-snug">{item.caption}</p>
                  <FiArrowUpRight className="mt-0.5 flex-shrink-0 text-[#0E2F23] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {/* Charging Manual CTA */}
          <div className="mt-12 border-t border-[#D8D3C4] pt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="plex-sans font-semibold text-xl text-[#0E2F23] flex items-center gap-2">
                  <FiBookOpen className="text-[#B5651D]" />
                  Charging Manual
                </h3>
                <p className="plex-sans text-[#3E4740] text-sm mt-1">
                  Step-by-step guide to using the Bhiringee More station.
                </p>
              </div>
              <button
                onClick={() => setManualOpen(true)}
                className="plex-sans text-sm font-medium bg-[#0E2F23] text-white px-6 py-3 hover:bg-[#123C2D] transition-colors flex items-center gap-2"
              >
                <FiBookOpen size={16} />
                Open manual
              </button>
            </div>
          </div>
        </div>

        {/* Right: spec panel, sticky */}
        <aside className="lg:sticky lg:top-8 h-fit border border-[#D8D3C4] bg-white shadow-card">
          <div className="plex-mono text-xs tracking-wide text-[#6B7268] px-5 pt-5">
            STATION RECORD
          </div>
          <div className="px-5 pb-5 pt-3 divide-y divide-[#E7E3D6]">
            {specs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div key={i} className="py-3 flex items-start gap-3">
                  <Icon className="mt-0.5 text-[#4E8F76] flex-shrink-0" size={16} />
                  <div>
                    <p className="plex-mono text-[10px] tracking-wide text-[#8A9088]">
                      {spec.label.toUpperCase()}
                    </p>
                    <p className="plex-sans text-sm text-[#161A17] mt-0.5">{spec.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 pb-5 flex flex-col gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${station.name} EV Charging Station ${station.city} West Bengal`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0E2F23] text-white plex-sans text-sm font-medium py-3 hover:bg-[#123C2D] transition-colors"
            >
              <FiNavigation size={15} />
              Get directions
            </a>
            <button
              onClick={() => setManualOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F6F4EE] border border-[#D8D3C4] text-[#0E2F23] plex-sans text-sm font-medium py-3 hover:bg-[#EDEBE2] transition-colors"
            >
              <FiBookOpen size={15} />
              View charging manual
            </button>
          </div>
        </aside>
      </section>

      {/* ---------------------------------------------------------
          FOOTER STRIP
      --------------------------------------------------------- */}
      <section className="border-t border-[#D8D3C4] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-[#4E8F76]" />
            <p className="plex-sans text-sm text-[#3E4740]">
              Looking for a different location? The network page shows every TransEV station and its status.
            </p>
          </div>
          <Link
            to="/blog"
            className="plex-sans text-sm font-medium text-[#0E2F23] inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            View all stations <FiArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------
          LIGHTBOX FOR GALLERY
      --------------------------------------------------------- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0E2F23]/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={activeImage.src} alt={activeImage.caption} className="w-full h-auto" />
              <p className="plex-sans text-sm text-[#DDE7E0] mt-3">{activeImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------
          CHARGING MANUAL MODAL
      --------------------------------------------------------- */}
      <AnimatePresence>
        {manualOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0E2F23]/90 flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
            onClick={() => setManualOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="max-w-3xl w-full bg-[#F6F4EE] p-6 sm:p-10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-[#B5651D] text-2xl" />
                  <h2 className="plex-sans font-semibold text-2xl sm:text-3xl text-[#0E2F23]">
                    Charging Manual
                  </h2>
                </div>
                <button
                  onClick={() => setManualOpen(false)}
                  className="text-[#6B7268] hover:text-[#0E2F23] transition-colors p-1"
                >
                  <FiArrowLeft size={20} />
                </button>
              </div>

              <p className="plex-sans text-[#3E4740] mb-8">
                Follow these steps to charge your electric vehicle at the Bhiringee More station.
              </p>

              <div className="space-y-6">
                {chargingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 bg-white p-4 border border-[#D8D3C4] shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0E2F23]/10 flex items-center justify-center text-[#0E2F23]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="plex-sans font-semibold text-[#0E2F23] flex items-center gap-2">
                          <span className="plex-mono text-xs text-[#6B7268]">0{index + 1}.</span>
                          {step.title}
                        </h3>
                        <p className="plex-sans text-sm text-[#3E4740] mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-[#0E2F23]/5 border-l-4 border-[#B5651D]">
                <p className="plex-sans text-sm text-[#3E4740]">
                  <strong className="text-[#0E2F23]">Note:</strong> The charging rate is{' '}
                  <span className="font-bold">{station.pricePerKwh}/kWh + {station.gst}</span>. Payment can be made
                  via the TransEV app or the station's card terminal. For assistance, call the helpline number
                  displayed on the charger.
                </p>
              </div>

              <button
                onClick={() => setManualOpen(false)}
                className="mt-8 w-full bg-[#0E2F23] text-white py-3 plex-sans text-sm font-medium hover:bg-[#123C2D] transition-colors"
              >
                Close manual
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DurgapurBhiringeeStation;