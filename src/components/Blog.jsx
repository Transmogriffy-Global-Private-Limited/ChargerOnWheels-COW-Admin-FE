import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiZap,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiBattery,
  FiTrendingUp,
} from 'react-icons/fi';
import Navbar from './Navbar';

// ============================================================
// ASSETS
// ============================================================
import bhiringeeFrontView from '../assets/font.jpg';
import evImage from '../assets/ev.png'; // fallback image for all other stations

// ============================================================
// STATION LIST
// ============================================================
const stations = [
  {
    id: 1,
    name: 'Bhiringee More',
    city: 'Durgapur',
    status: 'live',
    statusLabel: 'Live now',
    blurb:
      'Two dual-gun DC chargers under a covered bay just off the main road, run with WBSEDCL. Four connector points, CCS2 and Type 2.',
    connectorTypes: ['CCS2', 'Type 2'],
    chargers: [
      { type: 'DC', power: '60 kW' },
      { type: 'DC', power: '30 kW' },
      { type: 'AC', power: '7.4 kW' },
      { type: 'AC', power: '3.3 kW' },
    ],
    image: bhiringeeFrontView,
    href: '/durgapur-bhiringee-more',
    accent: '#0E2F23',
  },
  {
    id: 2,
    name: 'Bhastara',
    city: 'Bhastara',
    status: 'upcoming',
    statusLabel: 'Opening soon',
    blurb:
      'A 6-slot fast-charging point going up on the Bastara main road, near the post office. CCS2 and Type 2 connectors.',
    connectorTypes: ['CCS2', 'Type 2'],
    chargers: [
      { type: 'DC', power: '60 kW' },
      { type: 'DC', power: '30 kW' },
      { type: 'AC', power: '7.4 kW' },
      { type: 'AC', power: '3.3 kW' },
    ],
    image: evImage,
    href: null,
    accent: '#B5651D',
  },
  {
    id: 3,
    name: 'Uluberia',
    city: 'Uluberia',
    status: 'upcoming',
    statusLabel: 'Opening soon',
    blurb:
      'An ultra-fast hub taking shape by the railway station, with 6 slots and CCS2 / Type 2 connectors.',
    connectorTypes: ['CCS2', 'Type 2'],
    chargers: [
      { type: 'DC', power: '60 kW' },
      { type: 'DC', power: '30 kW' },
      { type: 'AC', power: '7.4 kW' },
      { type: 'AC', power: '3.3 kW' },
    ],
    image: evImage,
    href: null,
    accent: '#5B4B8A',
  },
  {
    id: 4,
    name: 'Khaserbheri',
    city: 'Khaserbheri',
    status: 'upcoming',
    statusLabel: 'Opening soon',
    blurb:
      'A 6-slot charging point on the Khaserbheri main road, near the local school. Type 2 and BS 1363 connectors.',
    connectorTypes: ['Type 2', 'BS 1363'],
    chargers: [
      { type: 'DC', power: '60 kW' },
      { type: 'DC', power: '30 kW' },
      { type: 'AC', power: '7.4 kW' },
      { type: 'AC', power: '3.3 kW' },
    ],
    image: evImage,
    href: null,
    accent: '#2E6E8E',
  },
  {
    id: 5,
    name: 'Chanditala',
    city: 'Chanditala',
    status: 'upcoming',
    statusLabel: 'Opening soon',
    blurb:
      'A 4-slot station planned near the Chanditala bus stand, with Type 2 and BS 1363 connectors.',
    connectorTypes: ['Type 2', 'BS 1363'],
    chargers: [
      { type: 'DC', power: '60 kW' },
      { type: 'DC', power: '30 kW' },
      { type: 'AC', power: '7.4 kW' },
      { type: 'AC', power: '3.3 kW' },
    ],
    image: evImage,
    href: null,
    accent: '#8A3B3B',
  },
];

const statusStyles = {
  live: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
  upcoming: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
};

const connectorColors = {
  CCS2: 'bg-blue-100 text-blue-800 border-blue-200',
  'Type 2': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'BS 1363': 'bg-amber-100 text-amber-800 border-amber-200',
};

const chargerColors = {
  DC: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  AC: 'bg-orange-100 text-orange-800 border-orange-200',
};

// Returns the highest-power DC charger available at a station, in kW
const getMaxDCPower = (chargers) => {
  const dcPowers = chargers
    .filter((c) => c.type === 'DC')
    .map((c) => parseInt(c.power, 10));
  return dcPowers.length ? Math.max(...dcPowers) : null;
};

// ============================================================
// STATION VISUAL
// ============================================================
const StationVisual = ({ station }) => {
  const imageSrc = station.image || evImage;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#EDEBE2]">
      <img
        src={imageSrc}
        alt={`${station.name} charging station, ${station.city}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      {station.status === 'live' && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] plex-mono px-2.5 py-1 rounded-full shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      )}
    </div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ChargingNetworkBlog = () => {
  const liveCount = stations.filter((s) => s.status === 'live').length;
  const upcomingCount = stations.length - liveCount;

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#161A17]">
      <Helmet>
        <title>Our Charging Network | TransEV</title>
        <meta
          name="description"
          content="Every TransEV public charging station across West Bengal — what's live now, and what's coming next."
        />
      </Helmet>

      <style>{`
        .plex-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .plex-sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .shadow-card {
          box-shadow: 0 8px 32px rgba(14, 47, 35, 0.06), 0 2px 8px rgba(14, 47, 35, 0.03);
        }
        .shadow-card-hover {
          box-shadow: 0 20px 60px rgba(14, 47, 35, 0.12), 0 8px 24px rgba(14, 47, 35, 0.06);
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(14,47,35,0.04) 1px, transparent 0);
          background-size: 32px 32px;
        }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Navbar />

      {/* ============================================================
          HEADER
      ============================================================ */}
      <header className="border-b border-[#D8D3C4] bg-gradient-to-b from-[#F0EDE4] to-[#F6F4EE] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16 relative z-10">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="plex-mono text-xs tracking-[0.2em] text-[#6B7268] uppercase flex items-center gap-2"
          >
            <span className="w-8 h-px bg-[#0E2F23]/40" />
            TransEV Network
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="plex-sans font-semibold text-4xl sm:text-6xl lg:text-7xl text-[#0E2F23] mt-4 leading-[1.04] tracking-tight"
          >
            Where we're charging
            <br />
            <span className="text-[#B5651D]">West Bengal</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="plex-sans text-[#3E4740] mt-5 max-w-xl leading-relaxed text-base sm:text-lg"
          >
            {liveCount} station{liveCount === 1 ? ' is' : 's are'} live today, with {upcomingCount} more on
            the way. Here's every location in the network and where each one stands.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-6 sm:gap-10"
          >
            <div className="flex items-center gap-2.5 plex-mono text-xs text-[#6B7268]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E2F23]" />
              <span>TOTAL <span className="font-semibold text-[#0E2F23]">{stations.length}</span></span>
            </div>
            <div className="flex items-center gap-2.5 plex-mono text-xs text-[#6B7268]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>LIVE <span className="font-semibold text-emerald-600">{liveCount}</span></span>
            </div>
            <div className="flex items-center gap-2.5 plex-mono text-xs text-[#6B7268]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>OPENING SOON <span className="font-semibold text-amber-600">{upcomingCount}</span></span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============================================================
          STATION LIST — PREMIUM DESIGN
      ============================================================ */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:gap-10">
          {stations.map((station, i) => {
            const Wrapper = station.href ? Link : 'div';
            const wrapperProps = station.href ? { to: station.href } : {};
            const isLive = station.status === 'live';
            const maxDCPower = getMaxDCPower(station.chargers);

            return (
              <motion.div
                key={station.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
              >
                <Wrapper
                  {...wrapperProps}
                  className={`group block bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-500 border border-[#D8D3C4]/30 hover:border-[#D8D3C4] overflow-hidden ${
                    station.href ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image — left */}
                    <div className="w-full md:w-72 lg:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto md:h-[240px] overflow-hidden">
                      <StationVisual station={station} />
                    </div>

                    {/* Content — right */}
                    <div className="flex-1 min-w-0 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                      {/* Top row: status + city + max power */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`plex-mono text-[10px] tracking-wide px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium ${
                            statusStyles[station.status]
                          }`}
                        >
                          {isLive ? (
                            <FiCheckCircle size={12} />
                          ) : (
                            <FiClock size={12} />
                          )}
                          {station.statusLabel.toUpperCase()}
                        </span>
                        <span className="plex-mono text-[11px] tracking-wide text-[#8A9088] flex items-center gap-1.5">
                          <FiMapPin size={14} />
                          {station.city.toUpperCase()}
                        </span>
                        {maxDCPower && (
                          <span className="plex-mono text-[11px] tracking-wide text-[#8A9088] flex items-center gap-1.5 ml-auto">
                            <FiTrendingUp size={14} />
                            Up to {maxDCPower} kW
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h2 className="plex-sans font-semibold text-2xl sm:text-3xl text-[#0E2F23] mt-3 flex items-center gap-2.5">
                        {station.name}
                        {station.href && (
                          <FiArrowUpRight
                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -translate-y-0.5 transition-all duration-300 text-[#B5651D]"
                            size={22}
                          />
                        )}
                      </h2>

                      {/* Blurb */}
                      <p className="plex-sans text-sm sm:text-base text-[#3E4740] mt-2 leading-relaxed max-w-2xl">
                        {station.blurb}
                      </p>

                      {/* Connector badges */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {station.connectorTypes.map((type) => (
                          <span
                            key={type}
                            className={`plex-mono text-[10px] tracking-wide px-3 py-1.5 rounded-full border font-medium ${connectorColors[type]}`}
                          >
                            {type.toUpperCase()}
                          </span>
                        ))}
                      </div>

                      {/* Charger details */}
                      {station.chargers && station.chargers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {station.chargers.map((charger, idx) => (
                            <span
                              key={idx}
                              className={`plex-mono text-[10px] tracking-wide px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-medium ${chargerColors[charger.type]}`}
                            >
                              <FiBattery size={12} />
                              {charger.type} {charger.power}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA or upcoming note */}
                      <div className="mt-5">
                        {isLive && station.href ? (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0E2F23] group-hover:text-[#B5651D] transition-colors duration-300">
                            View station details
                            <FiArrowUpRight
                              size={16}
                              className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm text-[#8A9088]">
                            <span className="w-2 h-2 rounded-full bg-amber-500/70 animate-pulse" />
                            Coming to {station.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ChargingNetworkBlog;
