import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CountryIncident {
  country: string;
  count: number;
}

interface IncidentMapProps {
  incidents: CountryIncident[];
}

// Country coordinates mapping (approximate center coordinates)
const countryCoordinates: { [key: string]: [number, number] } = {
  'united states': [-95.7129, 37.0902],
  'usa': [-95.7129, 37.0902],
  'united states of america': [-95.7129, 37.0902],
  'us': [-95.7129, 37.0902],
  'japan': [138.2529, 36.2048],
  'germany': [10.4515, 51.1657],
  'united kingdom': [-3.4360, 55.3781],
  'uk': [-3.4360, 55.3781],
  'france': [2.2137, 46.2276],
  'canada': [-106.3468, 56.1304],
  'china': [104.1954, 35.8617],
  'india': [78.9629, 20.5937],
  'brazil': [-51.9253, -14.2350],
  'australia': [133.7751, -25.2744],
  'russia': [105.3188, 61.5240],
  'italy': [12.5674, 41.8719],
  'spain': [-3.7492, 40.4637],
  'south korea': [127.7669, 35.9078],
  'mexico': [-102.5528, 23.6345],
  'netherlands': [5.2913, 52.1326],
  'sweden': [18.6435, 60.1282],
  'norway': [8.4689, 60.4720],
  'switzerland': [8.2275, 46.8182],
  'belgium': [4.4699, 50.5039],
  'austria': [14.5501, 47.5162],
  'denmark': [9.5018, 56.2639],
  'finland': [25.7482, 61.9241],
  'poland': [19.1343, 51.9194],
  'portugal': [-8.2245, 39.3999],
  'greece': [21.8243, 39.0742],
  'turkey': [35.2433, 38.9637],
  'south africa': [22.9375, -30.5595],
  'egypt': [30.8025, 26.8206],
  'israel': [34.8516, 32.7940],
  'argentina': [-63.6167, -38.4161],
  'chile': [-71.5430, -35.6751],
  'colombia': [-74.2973, 4.5709],
  'peru': [-75.0152, -9.1900],
  'venezuela': [-66.5897, 6.4238],
  'thailand': [100.9925, 15.8700],
  'vietnam': [108.2772, 14.0583],
  'indonesia': [113.9213, -0.7893],
  'malaysia': [101.9758, 4.2105],
  'singapore': [103.8198, 1.3521],
  'philippines': [121.7740, 12.8797],
  'new zealand': [174.8860, -40.9006],
  'ireland': [-8.2439, 53.4129],
  'czech republic': [15.4730, 49.8175],
  'hungary': [19.5033, 47.1625],
  'romania': [24.9668, 45.9432],
  'bulgaria': [25.4858, 42.7339],
  'croatia': [15.2, 45.1],
  'serbia': [21.0059, 44.0165],
  'ukraine': [31.1656, 48.3794],
  'belarus': [27.9534, 53.7098],
  'lithuania': [23.8813, 55.1694],
  'latvia': [24.6032, 56.8796],
  'estonia': [25.0136, 58.5953],
  'slovenia': [14.9955, 46.1512],
  'slovakia': [19.6990, 48.6690],
  'luxembourg': [6.1296, 49.8153],
  'malta': [14.3754, 35.9375],
  'cyprus': [33.4299, 35.1264],
  'iceland': [-19.0208, 64.9631],
  'morocco': [-7.0926, 31.7917],
  'algeria': [1.6596, 28.0339],
  'tunisia': [9.5375, 33.8869],
  'libya': [17.2283, 26.3351],
  'sudan': [30.2176, 12.8628],
  'ethiopia': [40.4897, 9.1450],
  'kenya': [37.9062, -0.0236],
  'tanzania': [34.8888, -6.3690],
  'uganda': [32.2903, 1.3733],
  'ghana': [-1.0232, 7.9465],
  'nigeria': [8.6753, 9.0820],
  'senegal': [-14.4524, 14.4974],
  'mali': [-3.9962, 17.5707],
  'burkina faso': [-2.1832, 12.2383],
  'niger': [8.0817, 17.6078],
  'chad': [18.7322, 15.4542],
  'cameroon': [12.3547, 7.3697],
  'central african republic': [20.9394, 6.6111],
  'democratic republic of congo': [21.7587, -4.0383],
  'republic of congo': [15.8277, -0.2280],
  'gabon': [11.6094, -0.8037],
  'equatorial guinea': [10.2679, 1.6508],
  'sao tome and principe': [6.6131, 0.1864],
  'cape verde': [-24.0132, 16.5388],
  'guinea-bissau': [-15.1804, 11.8037],
  'guinea': [-9.6966, 9.9456],
  'sierra leone': [-11.7799, 8.4606],
  'liberia': [-9.4295, 6.4281],
  'ivory coast': [-5.5471, 7.5400],
  'togo': [0.8248, 8.6195],
  'benin': [2.3158, 9.3077],
  'mauritania': [-10.9408, 21.0079],
  'gambia': [-15.3101, 13.4432],
  'madagascar': [46.8691, -18.7669],
  'mauritius': [57.5522, -20.3484],
  'seychelles': [55.4920, -4.6796],
  'comoros': [43.8711, -11.8750],
  'djibouti': [42.5903, 11.8251],
  'eritrea': [39.7823, 15.7394],
  'somalia': [46.1996, 5.1521],
  'rwanda': [29.8739, -1.9403],
  'burundi': [29.9189, -3.3731],
  'malawi': [34.3015, -13.2543],
  'zambia': [27.8546, -13.1339],
  'zimbabwe': [29.1549, -19.0154],
  'botswana': [24.6849, -22.3285],
  'namibia': [18.4241, -22.9576],
  'lesotho': [28.2336, -29.6100],
  'eswatini': [31.4659, -26.5225],
  'mozambique': [35.5296, -18.6657],
  'angola': [17.8739, -11.2027],
  'iran': [53.6880, 32.4279],
  'iraq': [43.6793, 33.2232],
  'syria': [38.9968, 34.8021],
  'lebanon': [35.8623, 33.8547],
  'jordan': [36.2384, 31.9539],
  'saudi arabia': [45.0792, 23.8859],
  'yemen': [48.5164, 15.5527],
  'oman': [55.9754, 21.5129],
  'united arab emirates': [53.8478, 23.4241],
  'uae': [53.8478, 23.4241],
  'qatar': [51.1839, 25.3548],
  'bahrain': [50.6344, 26.0667],
  'kuwait': [47.4818, 29.3117],
  'afghanistan': [67.7090, 33.9391],
  'pakistan': [69.3451, 30.3753],
  'bangladesh': [90.3563, 23.6850],
  'sri lanka': [80.7718, 7.8731],
  'maldives': [73.2207, 3.2028],
  'bhutan': [90.4336, 27.5142],
  'nepal': [84.1240, 28.3949],
  'myanmar': [95.9560, 21.9162],
  'laos': [102.4955, 19.8563],
  'cambodia': [104.9910, 12.5657],
  'mongolia': [103.8467, 46.8625],
  'north korea': [127.5101, 40.3399],
  'taiwan': [120.9605, 23.6978],
  'hong kong': [114.1694, 22.3193],
  'macau': [113.5439, 22.1987],
  'brunei': [114.7277, 4.5353],
  'east timor': [125.7275, -8.8742],
  'papua new guinea': [143.9555, -6.3150],
  'fiji': [179.4144, -16.5790],
  'solomon islands': [160.1562, -9.6457],
  'vanuatu': [166.9592, -15.3767],
  'new caledonia': [165.6189, -20.9043],
  'french polynesia': [-149.4068, -17.6797],
  'samoa': [-172.1046, -13.7590],
  'tonga': [-175.1982, -21.1789],
  'kiribati': [-157.3630, 1.8709],
  'tuvalu': [179.1940, -7.1095],
  'nauru': [166.9315, -0.5228],
  'palau': [134.5825, 7.5150],
  'marshall islands': [171.1845, 7.1315],
  'micronesia': [150.5508, 7.4256],
  'cook islands': [-159.7777, -21.2367],
  'niue': [-169.8672, -19.0544],
  'tokelau': [-171.8484, -8.9672],
  'american samoa': [-170.1320, -14.3064],
  'guam': [144.7937, 13.4443],
  'northern mariana islands': [145.3887, 17.3308],
  'puerto rico': [-66.5901, 18.2208],
  'us virgin islands': [-64.8963, 18.3358],
  'british virgin islands': [-64.6963, 18.4207],
  'anguilla': [-63.1691, 18.2206],
  'antigua and barbuda': [-61.7965, 17.0608],
  'dominica': [-61.3710, 15.4149],
  'saint lucia': [-60.9789, 13.9094],
  'saint vincent and the grenadines': [-61.2872, 12.9843],
  'barbados': [-59.5432, 13.1939],
  'grenada': [-61.6790, 12.2628],
  'trinidad and tobago': [-61.2225, 10.6918],
  'saint kitts and nevis': [-62.7830, 17.3578],
  'montserrat': [-62.2130, 16.7425],
  'turks and caicos islands': [-71.7979, 21.6940],
  'cayman islands': [-80.5665, 19.2866],
  'jamaica': [-77.2975, 18.1096],
  'haiti': [-72.2852, 18.9712],
  'dominican republic': [-70.1627, 18.7357],
  'cuba': [-77.7812, 21.5218],
  'bahamas': [-77.3963, 25.0343],
  'bermuda': [-64.7505, 32.3078],
  'greenland': [-42.6043, 71.7069],
  'faroe islands': [-6.9118, 61.8926],
  'svalbard and jan mayen': [23.6702, 77.5536],
  'antarctica': [0.0000, -90.0000],
};

export const IncidentMap = ({ incidents }: IncidentMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    // Add OpenStreetMap tile layer (free, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map.current);

    // Add dark theme tile layer for better aesthetics
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 18,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !incidents) return;

    // Clear existing markers
    markersRef.current.forEach(marker => map.current?.removeLayer(marker));
    markersRef.current = [];

    // Add new markers for country incidents
    incidents.forEach((countryIncident) => {
      const coordinates = countryCoordinates[countryIncident.country.toLowerCase()];
      if (!coordinates) {
        console.warn(`No coordinates found for country: ${countryIncident.country}`);
        return;
      }

      // Calculate marker size based on incident count
      const count = countryIncident.count;
      const size = Math.min(Math.max(12, count * 1.5), 30);

      // Color based on incident count (red gradient)
      const intensity = Math.min(count / 20, 1); // Normalize to 0-1
      const markerColor = `hsl(${4 - intensity * 4}, ${86}%, ${76 - intensity * 20}%)`;

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-country-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${markerColor};
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: ${Math.max(8, size * 0.4)}px;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
          ">
            ${count}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: customIcon
      }).addTo(map.current!);

      // Create popup content
      const popupContent = `
        <div style="
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px;
          border-radius: 8px;
          min-width: 200px;
          max-width: 300px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <h3 style="
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: ${markerColor};
            line-height: 1.3;
          ">${countryIncident.country}</h3>
          <div style="
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
          ">
            <strong>Total Incidents: ${count}</strong>
          </div>
          <div style="
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.4;
          ">
            AI-related incidents reported in this country
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });
  }, [incidents]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />

      {/* Legend */}
      {/*<div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50 z-[1000]">
        <h4 className="text-sm font-medium mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-400 rounded-full border border-white/50 flex items-center justify-center text-xs font-bold text-white">
              #
            </div>
            <span className="text-xs text-foreground">Incident Count</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            • Larger circles = More incidents
            • Darker red = Higher intensity
          </div>
        </div>
      </div>*/}
    </div>
  );
};