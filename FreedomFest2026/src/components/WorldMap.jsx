import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, ZoomIn, ZoomOut, RotateCcw, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../utils/audioSynthesizer';

// Map Controller helper to trigger smooth flyTo animations
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

// HIGH VISIBILITY Custom Leaflet Pin Generator
const createCustomPin = (label, isActive, isBombay, era) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <!-- Glowing Pulse Effect -->
        <div class="absolute -inset-2 rounded-full bg-[#1E40AF]/40 blur-md animate-pulse"></div>

        <!-- High-Visibility Marker Circle -->
        <div class="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isActive
        ? 'bg-[#2563EB] text-white ring-4 ring-white border-2 border-[#1E3A8A] scale-110 shadow-blue-500/80'
        : 'bg-[#1D4ED8] text-white border-2 border-white hover:bg-[#2563EB] hover:scale-110 shadow-blue-900/80'
      }">
          <!-- Pin Map Icon -->
          <svg class="w-7 h-7 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>

          <!-- Sub-Map Badge -->
          ${isBombay ? `
            <span class="absolute -top-3 -right-3 bg-[#138808] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-white tracking-wider flex items-center gap-0.5">
              Sub-Map
            </span>
          ` : ''}
        </div>

        <!-- Prominent High-Contrast Label -->
        <div class="whitespace-nowrap bg-stone-900 text-white border-2 border-[#3B82F6] px-3.5 py-1.5 rounded-2xl shadow-2xl mt-1 text-center font-sans tracking-tight transform group-hover:scale-105 transition-all">
          <div class="font-extrabold text-xs text-[#60A5FA] uppercase font-heading">${label}</div>
          <div class="text-[11px] font-semibold text-white mt-0.5">${era || ''}</div>
        </div>
      </div>
    `,
    iconSize: [140, 80],
    iconAnchor: [70, 30],
  });
};

const createSubPin = (label, year, isSelected) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <div class="absolute -inset-2 rounded-2xl bg-[#1D4ED8]/30 blur-sm animate-pulse"></div>
        <div class="relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-2xl transition-all duration-300 ${isSelected
        ? 'bg-[#2563EB] text-white ring-4 ring-white border-2 border-[#1E3A8A] scale-110'
        : 'bg-[#1D4ED8] text-white border-2 border-white hover:bg-[#3B82F6] hover:scale-110'
      }">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div class="whitespace-nowrap bg-[#1E3A8A] text-white border border-[#3B82F6] px-3 py-1.5 rounded-xl shadow-2xl mt-1 text-center font-sans">
          <div class="font-extrabold text-xs text-white max-w-[170px] truncate">${label}</div>
          <div class="text-[10px] font-extrabold text-[#93C5FD]">${year}</div>
        </div>
      </div>
    `,
    iconSize: [140, 75],
    iconAnchor: [70, 25],
  });
};

export default function WorldMap({ globalNodes, onSelectNode, activeNodeId, activeSubNodeId }) {
  const [isBombayZoomed, setIsBombayZoomed] = useState(false);
  const [mapCenter, setMapCenter] = useState([32.0, 35.0]);
  const [mapZoom, setMapZoom] = useState(4);

  const bombayNode = globalNodes.find(n => n.id === 'bombay');

  const handleGlobalNodeClick = (node) => {
    playSoundEffect('click');
    if (node.id === 'bombay') {
      setIsBombayZoomed(true);
      setMapCenter([18.9634, 72.8223]);
      setMapZoom(13);
    } else {
      setIsBombayZoomed(false);
      setMapCenter([node.lat, node.lng]);
      setMapZoom(6);
      onSelectNode(node, null);
    }
  };

  const handleSubNodeClick = (subNode) => {
    playSoundEffect('click');
    onSelectNode(bombayNode, subNode);
  };

  const resetMapZoom = () => {
    playSoundEffect('click');
    setIsBombayZoomed(false);
    setMapCenter([32.0, 35.0]);
    setMapZoom(4);
  };

  const globalRouteCoords = [
    [18.9634, 72.8223],
    [51.5074, -0.1278],
    [48.7758, 9.1829],
    [48.8566, 2.3522],
    [43.2965, 5.3698],
    [46.2044, 6.1432],
    [46.1264, 3.4258]
  ];

  return (
    <div className="relative w-full h-[660px] bg-[#FDFBF7] rounded-3xl overflow-hidden border-3 border-[#FF9933]/50 shadow-2xl">

      {/* Map Header Banner */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center space-x-3 bg-stone-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-700 shadow-xl">
        {isBombayZoomed && (
          <button
            onClick={resetMapZoom}
            className="flex items-center space-x-1 px-3 py-1 bg-[#FF9933] text-white rounded-xl text-xs font-bold hover:bg-[#D97706] transition-all shadow-md mr-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Global Map</span>
          </button>
        )}
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-[#FF9933] animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-white">
            {isBombayZoomed ? "Bombay Regional Sub-Map" : "Geographic Story Map (High-Visibility Nodes)"}
          </span>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700 shadow-xl">
        <button
          onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
          className="p-2 rounded-xl text-white hover:bg-stone-800 transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#FF9933]" />
        </button>
        <button
          onClick={() => setMapZoom(prev => Math.max(prev - 1, 2))}
          className="p-2 rounded-xl text-white hover:bg-stone-800 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#FF9933]" />
        </button>
        <button
          onClick={resetMapZoom}
          className="p-2 rounded-xl text-white hover:bg-stone-800 transition-all cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-[#FF9933]" />
        </button>
      </div>

      {/* Real World Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {!isBombayZoomed && (
          <Polyline
            positions={globalRouteCoords}
            pathOptions={{
              color: '#FF9933',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9
            }}
          />
        )}

        {!isBombayZoomed && globalNodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isBombay = node.id === 'bombay';
          const icon = createCustomPin(node.name, isActive, isBombay, node.era);

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleGlobalNodeClick(node)
              }}
            />
          );
        })}

        {isBombayZoomed && bombayNode?.subNodes?.map((subNode) => {
          const isSelected = activeSubNodeId === subNode.id;
          const icon = createSubPin(subNode.name, subNode.year, isSelected);

          return (
            <Marker
              key={subNode.id}
              position={[subNode.lat, subNode.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleSubNodeClick(subNode)
              }}
            />
          );
        })}

      </MapContainer>

      {/* Bottom Status Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-stone-900/90 text-white backdrop-blur-md border border-stone-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-[#FF9933]" />
          <p className="text-xs text-stone-200 font-medium">
            {isBombayZoomed
              ? "Touch any historic site marker in Bombay to view full-screen event details."
              : "Touch 'Bombay' to zoom into sub-map, or touch any prominent pin to view full-screen location details."}
          </p>
        </div>
      </div>

    </div>
  );
}
