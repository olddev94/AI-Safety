import { Incident } from '../types/incident';

// Generate realistic incident data with 100 deaths in US and 30 accidents in Japan
const generateUSDeaths = (): Incident[] => {
  const usStates = [
    { name: 'California', coords: [-119.4179, 36.7783] },
    { name: 'Texas', coords: [-99.9018, 31.9686] },
    { name: 'Florida', coords: [-81.5158, 27.6648] },
    { name: 'New York', coords: [-74.0059, 40.7128] },
    { name: 'Pennsylvania', coords: [-77.1945, 40.2732] },
    { name: 'Illinois', coords: [-89.3985, 40.6331] },
    { name: 'Ohio', coords: [-82.7649, 40.3888] },
    { name: 'Georgia', coords: [-83.2572, 32.1656] },
    { name: 'North Carolina', coords: [-79.0193, 35.7596] },
    { name: 'Michigan', coords: [-84.5361, 43.3266] },
  ];

  const categories = [
    'Autonomous Mobility',
    'Clinical & Medical AI',
    'Industrial & Workplace Robotics',
    'Consumer Chatbots & LLM Advice',
    'AI-Generated Manipulation & Abuse',
    'Public Safety & Critical Infrastructure'
  ];

  const incidents: Incident[] = [];

  for (let i = 1; i <= 100; i++) {
    const state = usStates[i % usStates.length];
    const category = categories[i % categories.length];
    const date = new Date(2024, 0, Math.floor(Math.random() * 30) + 1);

    // Add some randomness to coordinates within state
    const lat = state.coords[1] + (Math.random() - 0.5) * 2;
    const lng = state.coords[0] + (Math.random() - 0.5) * 2;

    incidents.push({
      id: `us-death-${i}`,
      title: `AI-Related Fatal Incident in ${state.name} #${i}`,
      url: `https://example.com/news/us-death-${i}`,
      description: `Fatal AI incident reported in ${state.name} involving ${category.split('/')[0].toLowerCase()}`,
      content: `Detailed report of AI-related fatality in ${state.name}...`,
      pubDate: date.toISOString(),
      country: ['United States'],
      category,
      coordinates: [lng, lat],
      severity: 'Death',
      casualties: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 2 : 1,
      financialLoss: Math.floor(Math.random() * 10000000) + 1000000
    });
  }

  return incidents;
};

const generateJapanAccidents = (): Incident[] => {
  const japanCities = [
    { name: 'Tokyo', coords: [139.6917, 35.6895] },
    { name: 'Osaka', coords: [135.5023, 34.6937] },
    { name: 'Kyoto', coords: [135.7681, 35.0116] },
    { name: 'Yokohama', coords: [139.6380, 35.4437] },
    { name: 'Nagoya', coords: [136.9066, 35.1815] },
    { name: 'Sapporo', coords: [141.3544, 43.0642] },
    { name: 'Fukuoka', coords: [130.4017, 33.5904] },
    { name: 'Kobe', coords: [135.1955, 34.6901] },
  ];

  const categories = [
    'Industrial & Workplace Robotics/Accident',
    'AI-Generated Manipulation & Abuse/Accident',
    'Public Safety & Critical Infrastructure/Accident',
    'Autonomous Mobility/Accident',
    'Consumer Chatbots & LLM Advice/Accident',
    'Clinical & Medical AI/Accident'
  ];

  const incidents: Incident[] = [];

  for (let i = 1; i <= 30; i++) {
    const city = japanCities[i % japanCities.length];
    const category = categories[i % categories.length];
    const date = new Date(2024, 0, Math.floor(Math.random() * 30) + 1);

    // Add some randomness to coordinates within city
    const lat = city.coords[1] + (Math.random() - 0.5) * 0.5;
    const lng = city.coords[0] + (Math.random() - 0.5) * 0.5;

    incidents.push({
      id: `japan-accident-${i}`,
      title: `AI System Malfunction in ${city.name} #${i}`,
      url: `https://example.com/news/japan-accident-${i}`,
      description: `AI-related accident reported in ${city.name} involving ${category.split('/')[0].toLowerCase()}`,
      content: `Detailed report of AI-related accident in ${city.name}...`,
      pubDate: date.toISOString(),
      country: ['Japan'],
      category,
      coordinates: [lng, lat],
      severity: 'Accident',
      casualties: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      financialLoss: Math.floor(Math.random() * 5000000) + 100000
    });
  }

  return incidents;
};

// Additional global incidents for context
const additionalGlobalIncidents: Incident[] = [
  {
    id: 'uk-1',
    title: 'NHS AI Diagnostic System Critical Failure',
    url: 'https://example.com/news/uk-1',
    description: 'Medical AI system in London hospital leads to treatment delays',
    content: 'A major NHS hospital AI diagnostic system failed to identify critical conditions...',
    pubDate: '2024-01-15T10:30:00Z',
    country: ['United Kingdom'],
    category: 'Clinical & Medical AI/Death',
    coordinates: [-0.1276, 51.5074],
    severity: 'Death',
    casualties: 3,
    financialLoss: 8500000
  },
  {
    id: 'germany-1',
    title: 'Automated Factory System Workplace Deaths',
    url: 'https://example.com/news/germany-1',
    description: 'Industrial AI system malfunction at automotive plant',
    content: 'An advanced manufacturing AI system experienced critical failure...',
    pubDate: '2024-01-14T14:22:00Z',
    country: ['Germany'],
    category: 'Industrial & Workplace Robotics/Death',
    coordinates: [10.4515, 51.1657],
    severity: 'Death',
    casualties: 2,
    financialLoss: 12000000
  },
  {
    id: 'china-1',
    title: 'Smart City AI Infrastructure Collapse',
    url: 'https://example.com/news/china-1',
    description: 'AI-controlled traffic system causes multiple vehicle collisions',
    content: 'A sophisticated smart city AI system controlling traffic lights malfunctioned...',
    pubDate: '2024-01-13T09:15:00Z',
    country: ['China'],
    category: 'Public Safety & Critical Infrastructure/Death',
    coordinates: [116.4074, 39.9042],
    severity: 'Death',
    casualties: 8,
    financialLoss: 25000000
  },
  {
    id: 'france-1',
    title: 'AI-Powered Medical Robot Surgical Error',
    url: 'https://example.com/news/france-1',
    description: 'Robotic surgery system causes patient fatalities in Paris',
    content: 'An AI-powered surgical robot experienced software failure during operations...',
    pubDate: '2024-01-12T16:45:00Z',
    country: ['France'],
    category: 'Clinical & Medical AI/Death',
    coordinates: [2.3522, 48.8566],
    severity: 'Death',
    casualties: 4,
    financialLoss: 15000000
  },
  {
    id: 'canada-1',
    title: 'Autonomous Vehicle Multi-Car Collision',
    url: 'https://example.com/news/canada-1',
    description: 'Self-driving car convoy system fails on highway',
    content: 'A coordinated autonomous vehicle system lost communication leading to fatal crashes...',
    pubDate: '2024-01-11T11:30:00Z',
    country: ['Canada'],
    category: 'Autonomous Mobility/Death',
    coordinates: [-106.3468, 52.9399],
    severity: 'Death',
    casualties: 6,
    financialLoss: 18000000
  }
];

export const mockIncidents: Incident[] = [
  ...generateUSDeaths(),
  ...generateJapanAccidents(),
  ...additionalGlobalIncidents
];

export const categories = [
  'Autonomous Mobility',
  'Industrial & Workplace Robotics',
  'Clinical & Medical AI',
  'Consumer Chatbots & LLM Advice',
  'AI-Generated Manipulation & Abuse',
  'Public Safety & Critical Infrastructure'
];

export const countries = [
  'United States',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];