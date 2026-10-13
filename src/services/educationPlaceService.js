import { getDistricts, getStates } from 'india-location-kit'

const GEOCODER_URL = 'https://nominatim.openstreetmap.org/search'
const INSTITUTIONS_URL = 'https://overpass-api.de/api/interpreter'
const cachePrefix = 'campusconnect-education-places:'
const cacheDuration = 30 * 24 * 60 * 60 * 1000
const districtCityLimit = 100
let lastGeocoderRequestAt = 0
const cityCache = new Map()
const sangliCities = [
  'Aarala', 'Alsund', 'Ambak', 'Amrapur', 'Ankale', 'Antri Bk', 'Arag', 'Ashta',
  'Asvalwadi', 'Atpadi', 'Atugadewadi', 'Bahadurwadi', 'Balgaon', 'Balwadi', 'Bavchi',
  'Belanki', 'Belondgi', 'Bhadkimbe', 'Bhose', 'Bilashi', 'Bilur', 'Budhgaon', 'Chikhli',
  'Chincholi', 'Daphalapur', 'Daribadachi', 'Dhavli', 'Dighanchi', 'Dudhgaon', 'Gatarwadi',
  'Girgaon', 'Girjawade', 'Gotkhindi', 'Hategaon', 'Hingangaon Khurd', 'Jath', 'Kadegaon',
  'Kadepur', 'Kameri', 'Kande', 'Karajagi', 'Kasegaon', 'Kavathe Ekand', 'Kavathe Mahankal',
  'Kavathe Piran', 'Khambale', 'Khanapur', 'Khanderajuri', 'Khirwade', 'Kokarud', 'Koregaon',
  'Kuchi', 'Kundal', 'Kundalwadi', 'Malgaon', 'Mandur', 'Manerajuri', 'Mangle', 'Mangrul',
  'Miraj', 'Mouje Digraj', 'Nagaj', 'Nagaon', 'Narsimhapur', 'Nathavde', 'Natoli', 'Nerle',
  'Nigadi', 'Nimblak', 'Padliwadi', 'Palus', 'Parumude', 'Peth', 'Pharnewadi', 'Pokharni',
  'Ramapur', 'Rils', 'Sagaon', 'Salgare', 'Sangli', 'Sankh', 'Sawarde', 'Shirala',
  'Shivajinagar', 'Sindura', 'Sonalagi', 'Sonavade', 'Tandulwadi', 'Tasgaon', 'Tondoli',
  'Umadi', 'Umarani', 'Uran Ishwarpur', 'Utagi', 'Visapur', 'Vita', 'Wangi', 'Yede Nipani',
  'Yelapur',
]

export const INDIAN_STATES = getStates().sort((left, right) => left.name.localeCompare(right.name))

export function getDistrictsForState(stateName) {
  const state = INDIAN_STATES.find((item) => item.name === stateName)
  if (!state) return []
  return getDistricts(state.code).sort((left, right) => left.name.localeCompare(right.name))
}

const waitForGeocoderLimit = async () => {
  const delay = Math.max(0, 1100 - (Date.now() - lastGeocoderRequestAt))
  if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
  lastGeocoderRequestAt = Date.now()
}

const getCachedPlaces = (key) => {
  try {
    const cached = JSON.parse(localStorage.getItem(`${cachePrefix}${key}`) || 'null')
    if (cached?.savedAt && Date.now() - cached.savedAt < cacheDuration) return cached.places
  } catch {
    return null
  }
  return null
}

const cachePlaces = (key, places) => {
  try {
    localStorage.setItem(`${cachePrefix}${key}`, JSON.stringify({ savedAt: Date.now(), places }))
  } catch {
    return
  }
}

export async function findEducationPlaces(city, district, state) {
  const normalizedCity = city.trim()
  const normalizedDistrict = district.trim()
  const normalizedState = state.trim()
  if (!normalizedCity) throw new Error('Enter a city first to find nearby schools and colleges.')

  const cacheKey = `${normalizedCity},${normalizedDistrict},${normalizedState || 'India'}`.toLowerCase()
  const cachedPlaces = getCachedPlaces(cacheKey)
  if (cachedPlaces) return cachedPlaces

  await waitForGeocoderLimit()
  const search = new URLSearchParams({
    q: `${normalizedCity}${normalizedDistrict ? `, ${normalizedDistrict}` : ''}${normalizedState ? `, ${normalizedState}` : ''}, India`,
    format: 'jsonv2',
    limit: '1',
  })
  const geocodeResponse = await fetch(`${GEOCODER_URL}?${search}`, {
    headers: { Accept: 'application/json' },
  })
  if (!geocodeResponse.ok) {
    throw new Error('Location search is temporarily unavailable. You can still type your school or college name.')
  }

  const locations = await geocodeResponse.json()
  if (!locations.length) throw new Error('We could not find that city. Check the city and state, or type the institution name.')

  const { lat, lon } = locations[0]
  const radius = 15000
  const query = `[out:json][timeout:20];(nwr(around:${radius},${lat},${lon})[amenity~"^(school|college|university)$"][name];nwr(around:${radius},${lat},${lon})[landuse=education][name];nwr(around:${radius},${lat},${lon})[building~"^(school|college|university)$"][name];);out center tags ${districtCityLimit};`
  const placesResponse = await fetch(INSTITUTIONS_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ data: query }),
  })
  if (!placesResponse.ok) {
    throw new Error('Nearby institution search is temporarily unavailable. You can still type the institution name.')
  }

  const placeData = await placesResponse.json()
  const uniquePlaces = new Map()
  placeData.elements.forEach((element) => {
    const name = element.tags?.name?.trim()
    if (!name) return
    const kind = element.tags.amenity || 'educational institution'
    const key = name.toLowerCase()
    if (!uniquePlaces.has(key)) uniquePlaces.set(key, { name, kind })
  })

  const places = Array.from(uniquePlaces.values()).sort((left, right) => left.name.localeCompare(right.name))
  cachePlaces(cacheKey, places)
  return places
}

export async function getCitiesForDistrict(stateName, districtName) {
  const state = INDIAN_STATES.find((item) => item.name === stateName)
  const district = state && getDistricts(state.code).find((item) => item.name === districtName)
  if (!state || !district) throw new Error('Select a valid state and district first.')
  if (state.code === 'MH' && district.code === 'SGL') return sangliCities

  const cacheKey = `${state.code}:${district.code}`
  if (cityCache.has(cacheKey)) return cityCache.get(cacheKey)

  await waitForGeocoderLimit()
  const search = new URLSearchParams({
    q: `${district.name} District, ${state.name}, India`,
    format: 'jsonv2',
    limit: '1',
  })
  const geocodeResponse = await fetch(`${GEOCODER_URL}?${search}`, {
    headers: { Accept: 'application/json' },
  })
  if (!geocodeResponse.ok) throw new Error('District city lookup is temporarily unavailable.')

  const locations = await geocodeResponse.json()
  const districtLocation = locations.find((location) => location.osm_type === 'relation')
  if (!districtLocation) throw new Error('Cities could not be found for this district. You can enter the city manually.')

  const areaId = 3600000000 + Number(districtLocation.osm_id)
  const query = `[out:json][timeout:20];area(${areaId})->.district;(nwr(area.district)[place~"^(city|town|village)$"][name];);out center tags ${districtCityLimit};`
  const placesResponse = await fetch(INSTITUTIONS_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ data: query }),
  })
  if (!placesResponse.ok) throw new Error('District city lookup is temporarily unavailable.')

  const placeData = await placesResponse.json()
  const cities = Array.from(new Set(
    placeData.elements
      .map((element) => element.tags?.name?.trim())
      .filter(Boolean),
  )).sort((left, right) => left.localeCompare(right))
  cityCache.set(cacheKey, cities)
  return cities
}