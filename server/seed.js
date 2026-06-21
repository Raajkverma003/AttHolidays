const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Package = require('./models/Package');

dotenv.config();

const defaultPackages = [
  // ==================== EUROPE (10) ====================
  {
    title: "Paris Romantic Escapade",
    description: "Experience the magic of Paris. Walk along the Seine, visit the Eiffel Tower, and enjoy delicious French cuisine. This standard package offers the perfect balance of sightseeing and leisure.",
    price: 1499,
    location: "Paris, France",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: true },
    amenities: { wifi: true, pool: false, gym: true, bar: true },
    activities: ["Eiffel Tower Skip-the-Line Tour", "Seine River Cruise with Champagne", "Louvre Museum Guided Walk", "Macaron Baking Class"],
    touristPlaces: ["Eiffel Tower", "Louvre Museum", "Notre Dame Cathedral", "Arc de Triomphe", "Montmartre"],
    itinerary: [
      { day: 1, title: "Arrival & Seine Cruise", details: "Land at CDG. Private airport pickup transfer to your 4-star boutique hotel. In the evening, enjoy a sunset cruise on the Seine River." },
      { day: 2, title: "Historical Paris & Eiffel Tower", details: "Guided city tour visiting Notre Dame and Montmartre. Ascent to the Eiffel Tower summit in the evening." },
      { day: 3, title: "Louvre Museum & Leisure", details: "Skip-the-line entrance to the Louvre. Afternoon free for shopping on the Champs-Élysées." },
      { day: 4, title: "Departure", details: "Breakfast at hotel. Free time until checkout and private transfer to airport." }
    ],
    importantDetails: "Passport must be valid for at least 6 months. Visa services are included for eligible nationalities.",
    images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800"],
    ratings: { average: 4.8, count: 2 },
    reviews: [
      { username: "TravelerJohn", rating: 5, comment: "Absolutely breathtaking! Hotel was premium and the cruise was magical." },
      { username: "SarahM", rating: 4, comment: "Great inclusions. The visa guidance was very helpful. Hotel location was superb." }
    ],
    isLastMinute: false
  },
  {
    title: "Swiss Alps Adventure",
    description: "Enjoy skiing, snowshoeing, and scenic cable car rides through Interlaken and Zermatt. Perfect for mountain and snow lovers.",
    price: 1899,
    location: "Interlaken, Switzerland",
    starCategory: 3,
    travelType: "standard",
    inclusions: { airportPickup: false, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: true },
    activities: ["Jungfraujoch Top of Europe Rail Tour", "Zermatt Glacier Paradise Ride", "Swiss Cheese Fondue Experience", "Paragliding over Interlaken Lakes"],
    touristPlaces: ["Jungfraujoch", "Zermatt Matterhorn", "Lake Brienz", "Harder Kulm"],
    itinerary: [
      { day: 1, title: "Arrive in Zurich & Train to Interlaken", details: "Arrive in Zurich. Board the scenic train to Interlaken. Check in to your alpine chalet hotel." },
      { day: 2, title: "Jungfraujoch Peak Tour", details: "Ascend the cogwheel railway to Europe's highest railway station at 3,454 meters. Witness the Aletsch Glacier." },
      { day: 3, title: "Zermatt & Matterhorn Views", details: "Day excursion to the car-free village of Zermatt. Marvel at the pyramid-shaped Matterhorn peak." },
      { day: 4, title: "Lake Brienz Cruise & Departure", details: "Morning lake cruise. Check out in the afternoon and train transfer back to Zurich airport." }
    ],
    importantDetails: "Swiss Rail Pass is optional but highly recommended. Thermal layers are required year-round.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
    ratings: { average: 4.6, count: 1 },
    reviews: [ { username: "SnowLover", rating: 5, comment: "Top of Europe Jungfraujoch was unforgettable. Well worth the price!" } ],
    isLastMinute: true,
    lastMinutePrice: 1699
  },
  {
    title: "Rome & Amalfi Coast Splendors",
    description: "Explore the ancient wonders of Rome before relaxing along the dramatic, sun-drenched cliffs of the Amalfi Coast.",
    price: 2199,
    location: "Rome & Amalfi, Italy",
    starCategory: 5,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: true },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Colosseum & Forum Guided Tour", "Positano Private Boat Excursion", "Vatican Museums Entrance", "Pizza & Pasta Making Masterclass"],
    touristPlaces: ["Colosseum", "Trevi Fountain", "Vatican City", "Positano cliffs", "Ravello Gardens"],
    itinerary: [
      { day: 1, title: "Arrive in the Eternal City", details: "Private pickup from Fiumicino Airport. Check into your luxury Roman boutique hotel. Sunset walk to the Trevi Fountain." },
      { day: 2, title: "Colosseum & Vatican Treasures", details: "Express skip-the-line tours of the Colosseum in the morning and the Sistine Chapel in the afternoon." },
      { day: 3, title: "Scenic Drive to Amalfi Coast", details: "Private transfer to Amalfi. Check into a cliffside resort. Enjoy an evening cocktails overlooking the Tyrrhenian Sea." },
      { day: 4, title: "Positano Boat Cruise", details: "Board a private boat to cruise along Positano, swim in hidden caves, and explore Amalfi town." },
      { day: 5, title: "Departure", details: "Morning espresso on the terrace. Private transfer to Naples airport for departure." }
    ],
    importantDetails: "Schengen Visa required. Italian city tourist taxes must be paid directly to hotels.",
    images: ["https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800"],
    ratings: { average: 4.9, count: 4 },
    isLastMinute: false
  },
  {
    title: "London Royal Heritage",
    description: "Discover London's royal landmarks, world-class theatre, and rich historical estates on this comprehensive group tour.",
    price: 1599,
    location: "London, United Kingdom",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: true },
    amenities: { wifi: true, pool: false, gym: true, bar: true },
    activities: ["Tower of London Crown Jewels Tour", "West End Musical Show", "Buckingham Palace Changing of the Guard", "Traditional Afternoon High Tea"],
    touristPlaces: ["Big Ben", "Tower Bridge", "Buckingham Palace", "London Eye", "Windsor Castle"],
    itinerary: [
      { day: 1, title: "London Arrival", details: "Airport transfer to central London hotel. Meet your tour leader and group for a pint at a historic British pub." },
      { day: 2, title: "Royals & Landmarks", details: "View the Changing of the Guard. Afternoon tour of the Tower of London to see the Crown Jewels." },
      { day: 3, title: "Windsor Day Trip", details: "Take a group coach to Windsor Castle. Evening West End musical theatre performance with the group." },
      { day: 4, title: "Departure", details: "Enjoy a leisurely morning of shopping on Oxford Street. Afternoon transfer to Heathrow Airport." }
    ],
    importantDetails: "UK Visa is required. High tea bookings are fully managed.",
    images: ["https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=800", "https://images.unsplash.com/photo-1505761671935-60b6a7cc09d3?w=800"],
    ratings: { average: 4.5, count: 2 },
    isLastMinute: false
  },
  {
    title: "Barcelona Sunshine & Architecture",
    description: "Immerse yourself in Gaudi's whimsical designs, vibrant tapas bars, and the golden city beaches of Catalonia.",
    price: 1399,
    location: "Barcelona, Spain",
    starCategory: 4,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Sagrada Familia Skip-the-Line Tour", "Park Guell Guided Walk", "Gothic Quarter Tapas Crawl", "Flamenco Show in Tablao de Carmen"],
    touristPlaces: ["Sagrada Familia", "Park Guell", "La Rambla", "Barceloneta Beach", "Montserrat Mountain"],
    itinerary: [
      { day: 1, title: "Hola Barcelona", details: "Private transfer to your Gothic Quarter hotel. Enjoy an evening of authentic Spanish tapas and local wines." },
      { day: 2, title: "Gaudi Masterpieces", details: "Skip-the-line tours of the unfinished Sagrada Familia basilica and Park Guell." },
      { day: 3, title: "Montserrat Pilgrimage", details: "Scenic train trip to the mountain monastery of Montserrat. Evening flamenco show and dinner." },
      { day: 4, title: "Departure", details: "Leisurely morning at Barceloneta beach. Checkout and transfer to El Prat Airport." }
    ],
    importantDetails: "Passport must have at least 3 months validity beyond the planned stay in Spain.",
    images: ["https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=800", "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800"],
    ratings: { average: 4.7, count: 3 },
    isLastMinute: true,
    lastMinutePrice: 1249
  },
  {
    title: "Santorini Sunset & Blue Domes",
    description: "Wake up to breathtaking caldera views, tour local volcanic vineyards, and watch the legendary Oia sunsets in luxury.",
    price: 2599,
    location: "Santorini, Greece",
    starCategory: 5,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Caldera Sunset Catamaran Cruise", "Bespoke Wine Tasting Tour", "Akrotiri Archaeological Guided Walk", "Volcanic Hot Springs Bathing"],
    touristPlaces: ["Oia Blue Domes", "Fira Caldera", "Red Beach", "Akrotiri Ruins", "Pyrgos Village"],
    itinerary: [
      { day: 1, title: "Caldera Dreamland", details: "Arrival in Santorini. Transfer to a 5-star cave suite with private infinity pool. Sunset dinner overlooking the sea." },
      { day: 2, title: "Vineyards & Historic Ruins", details: "Morning tour of Akrotiri excavations. Afternoon wine tasting across traditional volcanic soil vineyards." },
      { day: 3, title: "Catamaran Cruise", details: "Board a luxury catamaran for sailing, snorkeling at the Red Beach, and hot springs bathing. Watch the sunset from the deck." },
      { day: 4, title: "Farewell Greece", details: "Final morning dip in the pool. Checkout and transfer to Santorini airport/port." }
    ],
    importantDetails: "Luggage porter services are included for steep cliffside hotel check-ins.",
    images: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", "https://images.unsplash.com/photo-1469796466635-455edd028abd?w=800"],
    ratings: { average: 5.0, count: 5 },
    isLastMinute: false
  },
  {
    title: "Amsterdam Canals & Windmills",
    description: "Cruise the historic ring of canals, browse world-famous museums, and visit the colourful tulip fields and countryside windmills.",
    price: 1199,
    location: "Amsterdam, Netherlands",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: false, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: false, gym: true, bar: true },
    activities: ["Classic Canal Cruise", "Van Gogh Museum Ticket", "Rijksmuseum Tour", "Zaanse Schans Windmills Tour"],
    touristPlaces: ["Van Gogh Museum", "Dam Square", "Zaanse Schans", "Jordaan District", "Keukenhof Gardens"],
    itinerary: [
      { day: 1, title: "Arrive in Amsterdam", details: "Check into a historic canal-side hotel. Afternoon historic boat tour with cheese and wine." },
      { day: 2, title: "Art & Heritage", details: "Guided walk through the Rijksmuseum and Van Gogh Museum. Evening stroll around the Jordaan." },
      { day: 3, title: "Windmills & Countryside", details: "Day excursion to Zaanse Schans to witness functional historic windmills and clog workshops." },
      { day: 4, title: "Departure", details: "Leisure morning biking. Checkout and self-arranged travel to Schiphol Airport." }
    ],
    importantDetails: "Keukenhof Garden visits are substituted with cheese tasting in winter months.",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800", "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800"],
    ratings: { average: 4.6, count: 3 },
    isLastMinute: false
  },
  {
    title: "Icelandic Northern Lights Adventure",
    description: "Hunt the elusive Aurora Borealis, explore geological wonders along the Golden Circle, and bathe in the healing geothermal Blue Lagoon.",
    price: 1999,
    location: "Reykjavik, Iceland",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Guided Aurora Hunt Night Cruise", "Golden Circle Geo-Tour", "Blue Lagoon Geothermal Spa Bath", "Black Sand Beach Walk"],
    touristPlaces: ["Thingvellir National Park", "Gullfoss Waterfall", "Geysir", "Reynisfjara Black Sand Beach", "Blue Lagoon"],
    itinerary: [
      { day: 1, title: "Welcome & Blue Lagoon Soak", details: "Airport pickup. Transfer directly to the Blue Lagoon for a relaxing silica mud bath. Check in to your Reykjavik hotel." },
      { day: 2, title: "Golden Circle Exploration", details: "Explore Thingvellir continental plates, Strokkur geyser eruptions, and the double-cascading Gullfoss waterfall." },
      { day: 3, title: "South Coast & Aurora Hunt", details: "Walk behind Seljalandsfoss waterfall. Hike Reynisfjara black sands. In the evening, set off on a coach tour hunting the Northern Lights." },
      { day: 4, title: "Departure", details: "Final shopping in Laugavegur street. Checkout and transfer to Keflavik Airport." }
    ],
    importantDetails: "Northern Lights are a natural phenomenon; sightings depend on weather and solar activity.",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800", "https://images.unsplash.com/photo-1504829857797-ddff28127792?w=800"],
    ratings: { average: 4.8, count: 4 },
    isLastMinute: true,
    lastMinutePrice: 1799
  },
  {
    title: "Prague & Budapest Imperial Cities",
    description: "Walk the fairy-tale streets of Prague, cruise the Danube River under illuminated palaces, and dip in historical thermal baths.",
    price: 1099,
    location: "Prague & Budapest, Czechia",
    starCategory: 3,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: true },
    amenities: { wifi: true, pool: false, gym: false, bar: true },
    activities: ["Prague Castle Walking Tour", "Danube Evening Cruise in Budapest", "Charles Bridge Sunset Walk", "Szechenyi Thermal Bath Entry"],
    touristPlaces: ["Charles Bridge", "Prague Old Town Square", "Buda Castle", "Hungarian Parliament", "Szechenyi Baths"],
    itinerary: [
      { day: 1, title: "Prague Arrival", details: "Group welcome at Prague Airport. Transfer to hotel. Stroll across the Charles Bridge at sunset." },
      { day: 2, title: "Prague Castles & Architecture", details: "Guided tour of Prague Castle and the Astronomical Clock. Afternoon train ride through historic landscapes to Budapest." },
      { day: 3, title: "Budapest Baths & Danube", details: "Morning soaking at Szechenyi Thermal Baths. Evening dinner cruise on the Danube to witness the illuminated Parliament." },
      { day: 4, title: "Departure", details: "Final breakfast with the group. Checkout and airport transfer." }
    ],
    importantDetails: "Train tickets from Prague to Budapest are fully managed and included.",
    images: ["https://images.unsplash.com/photo-1541343072874-3ee362dac609?w=800", "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=800"],
    ratings: { average: 4.4, count: 2 },
    isLastMinute: false
  },
  {
    title: "Austrian Melodies: Vienna & Salzburg",
    description: "Explore baroque castles in Vienna, listen to classical Mozart concertos, and walk through the alpine Sound of Music landscapes in Salzburg.",
    price: 1699,
    location: "Vienna & Salzburg, Austria",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: false, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: false, gym: true, bar: true },
    activities: ["Schonbrunn Palace Grand Tour", "Mozart Concert at Musikverein", "Salzburg Sound of Music Excursion", "Hallstatt Fairytale Village Day Trip"],
    touristPlaces: ["Schonbrunn Palace", "St. Stephen's Cathedral", "Salzburg Fortress", "Hallstatt Lake", "Mirabell Gardens"],
    itinerary: [
      { day: 1, title: "Vienna Imperial Arrival", details: "Check into your historic Vienna hotel. Attend an evening classical concert at the Golden Hall." },
      { day: 2, title: "Habsburg Palaces & Train", details: "Grand tour of Schonbrunn Palace. Take the express train to Salzburg in the afternoon." },
      { day: 3, title: "Hallstatt Day Trip", details: "Private coach to the picturesque lakeside village of Hallstatt. Walk along the skywalk and salt mines." },
      { day: 4, title: "Salzburg Sound of Music & Farewell", details: "Tour Mirabell Gardens. Checkout and transfer to Munich/Vienna Airport." }
    ],
    importantDetails: "Concert attire is smart-casual. Hallstatt entry tickets are included.",
    images: ["https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800"],
    ratings: { average: 4.7, count: 1 },
    isLastMinute: false
  },

  // ==================== INDIA (10) ====================
  {
    title: "Taj Mahal & Rajasthan Heritage",
    description: "Embark on India's golden triangle. Witness the pristine white marble Taj Mahal, explore massive forts, and stay in royal palaces.",
    price: 899,
    location: "Agra & Jaipur, India",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Taj Mahal Sunrise Guided Tour", "Amer Fort Jeep Ascent", "Jaipur Palace Heritage Walk", "Traditional Rajasthani Folk Dance"],
    touristPlaces: ["Taj Mahal", "Agra Fort", "Amber Palace", "Hawa Mahal (Palace of Winds)", "City Palace Jaipur"],
    itinerary: [
      { day: 1, title: "Delhi to Agra & Taj Mahal Sunset", details: "Pickup from Delhi Airport. Drive to Agra. Visit the Agra Fort and watch the Taj Mahal glow at sunset." },
      { day: 2, title: "Sunrise Taj Mahal & Drive to Jaipur", details: "Experience the Taj Mahal in the quiet morning light. Drive to Jaipur (the Pink City) checking into a heritage Haveli." },
      { day: 3, title: "Amber Fort & Royal Palaces", details: "Ride a jeep to Amer Fort. Tour the Hawa Mahal and the astronomical observatory Jantar Mantar. Dine at Chokhi Dhani." },
      { day: 4, title: "Departure", details: "Leisurely breakfast. Drive back to Delhi Airport for departure." }
    ],
    importantDetails: "Taj Mahal is closed on Fridays. Ensure conservative dress codes for temples.",
    images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800", "https://images.unsplash.com/photo-1477584322813-ac28498f395c?w=800"],
    ratings: { average: 4.9, count: 8 },
    isLastMinute: false
  },
  {
    title: "Kerala Backwaters & Munnar Hills",
    description: "Cruise along calm emerald palm-fringed backwaters on a private houseboat and relax amidst the sprawling tea hills of Munnar.",
    price: 799,
    location: "Kerala, India",
    starCategory: 4,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: false },
    activities: ["Overnight Luxury Houseboat Cruise", "Munnar Tea Plantation Safari", "Kathakali Classical Dance Performance", "Spice Plantation Walk"],
    touristPlaces: ["Munnar Tea Gardens", "Mattupetty Dam", "Alleppey Backwaters", "Kochi Fort"],
    itinerary: [
      { day: 1, title: "Welcome to Kochi & Drive to Munnar", details: "Pickup from Cochin Airport. Drive through winding roads and waterfalls to Munnar. Check into a valley-view resort." },
      { day: 2, title: "Tea Plantations & Spice Walks", details: "Visit the Tata Tea Museum. Hike through cardamom forests and tea estates. Attend a Kathakali performance." },
      { day: 3, title: "Board the Private Houseboat", details: "Drive to Alleppey. Board your luxury wooden Kettuvallam houseboat. Cruise through channels while freshly caught fish is prepared." },
      { day: 4, title: "Departure", details: "Breakfast onboard. Cruise back to jetty, checkout, and transfer back to Kochi Airport." }
    ],
    importantDetails: "Houseboat AC is operational only in the evening/night. Ayurvedic massages can be booked locally.",
    images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800", "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800"],
    ratings: { average: 4.8, count: 5 },
    isLastMinute: true,
    lastMinutePrice: 699
  },
  {
    title: "Goa Beach & Sun Retreat",
    description: "Sip mocktails on white sand beaches, explore Portuguese colonial cathedrals, and experience Goa's legendary night markets.",
    price: 499,
    location: "Goa, India",
    starCategory: 3,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Scuba Diving & Watersports package", "Old Goa Heritage Church Walk", "Dudhsagar Waterfalls Jeep Trek", "Sunset Yacht Cruise"],
    touristPlaces: ["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada", "Anjuna Flea Market"],
    itinerary: [
      { day: 1, title: "Arrive in Goa", details: "Pickup from Dabolim/Mopa Airport. Check into your boutique beach resort in North Goa. Relax by the pool." },
      { day: 2, title: "Heritage Churches & Sunset Sail", details: "Visit Old Goa's 16th-century cathedrals. Evening sunset yacht cruise with drinks on the Mandovi River." },
      { day: 3, title: "Waterfalls & Spice Farm", details: "Take a jeep safari to the cascading Dudhsagar waterfalls. Traditional Goan buffet lunch at a spice farm." },
      { day: 4, title: "Departure", details: "Leisure morning beach shopping. Checkout and transfer to Airport." }
    ],
    importantDetails: "Watersports are subject to weather conditions. Best visited between October and April.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", "https://images.unsplash.com/photo-1587922449443-f782f6e9b53c?w=800"],
    ratings: { average: 4.7, count: 6 },
    isLastMinute: false
  },
  {
    title: "Kashmir Valley: Paradise on Earth",
    description: "Stay in ornate cedar houseboats on Dal Lake, take gondola rides above snowy heights in Gulmarg, and walk through Mughal gardens.",
    price: 999,
    location: "Srinagar & Gulmarg, India",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: false },
    activities: ["Dal Lake Shikara Boat Ride", "Gulmarg Gondola Snow Cable Car", "Mughal Gardens Guided Walk", "Pahalgam Valley River Rafting"],
    touristPlaces: ["Dal Lake", "Shalimar Bagh", "Gulmarg Phase 1 & 2", "Betaab Valley Pahalgam"],
    itinerary: [
      { day: 1, title: "Srinagar Airport & Luxury Houseboat", details: "Pickup from Srinagar. Check in to a premium floating houseboat. Enjoy a peaceful evening Shikara ride on Dal Lake." },
      { day: 2, title: "Mughal Gardens & Local Bazaars", details: "Visit Shalimar and Nishat Bagh gardens. Shop for authentic cashmere shawls and saffron." },
      { day: 3, title: "Gulmarg Snow Mountains", details: "Day excursion to Gulmarg. Ride the world's second-highest cable car (Gondola) to Apharwat Peak." },
      { day: 4, title: "Pahalgam Valley View & Departure", details: "Drive to Pahalgam (Valley of Shepherds). Stroll along the Lidder River before driving back to Srinagar Airport." }
    ],
    importantDetails: "Warm coats and heavy boots can be rented locally in Gulmarg. Prepaid mobile cards from other states do not work in Kashmir.",
    images: ["https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f6?w=800", "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"],
    ratings: { average: 4.9, count: 5 },
    isLastMinute: false
  },
  {
    title: "Leh Ladakh Himalayan Adventure",
    description: "Cross the highest motorable roads in the world, stand in awe of the blue saltwater Pangong Lake, and explore ancient Buddhist monasteries.",
    price: 1199,
    location: "Leh Ladakh, India",
    starCategory: 3,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: false },
    activities: ["Khardung La Pass Crossing", "Pangong Lake Camping", "Thiksey Monastery Prayer", "Double-Humped Bactrian Camel Ride"],
    touristPlaces: ["Pangong Lake", "Khardung La Pass", "Nubra Valley", "Magnetic Hill", "Thiksey Monastery"],
    itinerary: [
      { day: 1, title: "Arrival & Acclimatization", details: "Land at Leh Airport (3,500m). Direct transfer to hotel. Rest the entire day to prevent altitude sickness." },
      { day: 2, title: "Monasteries & Hall of Fame", details: "Visit Spituk and Thiksey monasteries. Experience the gravity-defying Magnetic Hill." },
      { day: 3, title: "Cross Khardung La to Nubra Valley", details: "Drive over Khardung La (5,359m). Check into Nubra camps. Ride double-humped camels on the sand dunes." },
      { day: 4, title: "Pangong Lake & Back to Leh", details: "Drive to the border lake of Pangong. Walk along the turquoise saltwater shoreline. Return to Leh." },
      { day: 5, title: "Departure", details: "Early morning checkout and transfer to Leh Airport." }
    ],
    importantDetails: "Inner Line permits are included. First day rest is strictly mandatory for health safety.",
    images: ["https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800", "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=800"],
    ratings: { average: 4.8, count: 4 },
    isLastMinute: true,
    lastMinutePrice: 1049
  },
  {
    title: "Varanasi Spiritual Walk",
    description: "Immerse in the spiritual core of India. Witness the grand Ganga Aarti ceremonies and walk the ancient river ghats.",
    price: 399,
    location: "Varanasi, India",
    starCategory: 3,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: false },
    activities: ["Sunrise Ganges Boat Ride", "Ganga Aarti Evening Ceremony Tour", "Sarnath Buddhist Ruins Visit", "Ancient Temples Walking Tour"],
    touristPlaces: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Banaras Hindu University"],
    itinerary: [
      { day: 1, title: "Arrive in Varanasi & Evening Aarti", details: "Pickup from Lal Bahadur Shastri Airport. Check into hotel. Attend the spectacular evening oil-lamp Aarti at Dashashwamedh Ghat." },
      { day: 2, title: "Sunrise Boat & Heritage Walk", details: "Board a wooden boat at dawn to see pilgrims bath. Walk through narrow, ancient alleyways lined with shrines." },
      { day: 3, title: "Sarnath Excursion", details: "Visit Sarnath where Gautama Buddha gave his first sermon. Inspect the Ashoka pillar and Dhamek stupa." },
      { day: 4, title: "Departure", details: "Taste local breakfast (Kachori Sabzi). Checkout and transfer to Airport." }
    ],
    importantDetails: "Conservative clothing covering shoulders and knees is mandatory inside temples.",
    images: ["https://images.unsplash.com/photo-1561361531-9952a8a3ee30?w=800", "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800"],
    ratings: { average: 4.6, count: 4 },
    isLastMinute: false
  },
  {
    title: "Shimla & Manali Snow Escapes",
    description: "Traverse high Himalayan passes, walk colonial avenues in Shimla, and experience snowfall in Solang Valley.",
    price: 599,
    location: "Himachal Pradesh, India",
    starCategory: 3,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: false },
    activities: ["Solang Valley Paragliding & Quad Bike", "Kufri Snow Adventure Park", "Shimla Ridge British Heritage Walk", "Atal Tunnel Drive"],
    touristPlaces: ["Mall Road Shimla", "Kufri", "Hadimba Temple Manali", "Solang Valley", "Atal Tunnel"],
    itinerary: [
      { day: 1, title: "Chandigarh to Shimla Hill Station", details: "Pickup from Chandigarh Airport. Scenic drive to Shimla. Check in to hotel and walk along the colonial Mall Road." },
      { day: 2, title: "Kufri Peak & Drive to Manali", details: "Explore Kufri peak pine forests. Drive along the scenic Beas River valley to Manali." },
      { day: 3, title: "Solang Valley & Atal Tunnel", details: "Play in the snow at Solang Valley. Drive through the engineering marvel of Atal Tunnel. Barbecue dinner." },
      { day: 4, title: "Hadimba Temple & Departure", details: "Visit the 16th-century wooden Hadimba Temple. Checkout and drive back to Chandigarh for departure." }
    ],
    importantDetails: "Adventure sports like paragliding and skiing are paid directly to local vendors.",
    images: ["https://images.unsplash.com/photo-1548263591-19059f268a3e?w=800", "https://images.unsplash.com/photo-1626416172036-7c385b0d0a51?w=800"],
    ratings: { average: 4.5, count: 3 },
    isLastMinute: false
  },
  {
    title: "Amritsar & Punjab Cultural Tour",
    description: "Bow at the serene Golden Temple, witness the border military ceremony at Wagah, and taste rich Punjabi highway cuisine.",
    price: 449,
    location: "Amritsar, India",
    starCategory: 3,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: false, gym: true, bar: false },
    activities: ["Golden Temple Sacred Walk", "Wagah Border Flag Lowering Ceremony", "Jallianwala Bagh Historic Tour", "Dhaba Cuisine Culinary Tasting"],
    touristPlaces: ["Harmandir Sahib (Golden Temple)", "Wagah Border", "Jallianwala Bagh", "Partition Museum"],
    itinerary: [
      { day: 1, title: "Arrive Amritsar & Night Temple Walk", details: "Pickup from Amritsar Airport. Visit the Golden Temple at night when it is beautifully illuminated and serene." },
      { day: 2, title: "Jallianwala Memorial & Wagah Border", details: "Tour the historic gardens of Jallianwala. In the afternoon, drive to the India-Pakistan border for the Wagah Border parade." },
      { day: 3, title: "Culinary Punjab & Departure", details: "Breakfast at a local eatery for Amritsari Kulcha. Visit the Partition Museum. Checkout and airport transfer." }
    ],
    importantDetails: "Head covering is mandatory for both men and women inside the Golden Temple.",
    images: ["https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800", "https://images.unsplash.com/photo-1588598126483-241249713837?w=800"],
    ratings: { average: 4.8, count: 5 },
    isLastMinute: false
  },
  {
    title: "Andaman Islands Coral Escape",
    description: "Explore crystal-clear turquoise waters, walk under dense tropical canopies, and dive into vibrant coral reefs on Havelock Island.",
    price: 949,
    location: "Andaman Islands, India",
    starCategory: 4,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Radhanagar Beach Sunset Walk", "Scuba Diving at Havelock Reef", "Cellular Jail Sound & Light Show", "Glass Bottom Boat Ride"],
    touristPlaces: ["Radhanagar Beach", "Cellular Jail", "Elephant Beach", "Ross Island"],
    itinerary: [
      { day: 1, title: "Port Blair Arrival & Historic Jail", details: "Pickup from Port Blair. Check in to resort. Evening tour of the historical Cellular Jail with its sound and light show." },
      { day: 2, title: "Ferry to Havelock Island & Sunset", details: "Board a cruise ferry to Havelock. Walk on Radhanagar Beach, rated among Asia's best beaches." },
      { day: 3, title: "Coral Snorkeling & Watersports", details: "Speedboat ride to Elephant beach for snorkeling, sea walking, or scuba diving." },
      { day: 4, title: "Ferry Back & Departure", details: "Cruise ferry back to Port Blair. Checkout and transfer to Airport." }
    ],
    importantDetails: "Ferry tickets are booked in advance. Mobile internet connectivity is very limited on the islands.",
    images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    ratings: { average: 4.9, count: 3 },
    isLastMinute: true,
    lastMinutePrice: 899
  },
  {
    title: "Darjeeling Tea Hills & Sikkim",
    description: "Wake up to views of Mount Kanchenjunga, ride the vintage toy train, and tour Buddhist monasteries in Gangtok.",
    price: 749,
    location: "Darjeeling & Sikkim, India",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: true },
    activities: ["Tiger Hill Himalayan Sunrise View", "DHR Toy Train Ride", "Rumtek Monastery Tour", "Tsomgo Lake Yak Ride"],
    touristPlaces: ["Tiger Hill", "Batasia Loop", "Rumtek Monastery", "Tsomgo Lake", "Darjeeling Peace Pagoda"],
    itinerary: [
      { day: 1, title: "Arrive in Darjeeling", details: "Pickup from Bagdogra Airport. Drive through tea gardens to Darjeeling. Check into a heritage hotel." },
      { day: 2, title: "Tiger Hill Sunrise & Toy Train", details: "Wake up at 4 AM to watch the sunrise over Kanchenjunga from Tiger Hill. Ride the UNESCO heritage toy train." },
      { day: 3, title: "Scenic Drive to Gangtok", details: "Drive along the Teesta River to Gangtok (Sikkim). Tour the Rumtek Monastery in the evening." },
      { day: 4, title: "Tsomgo Sacred Lake & Departure", details: "Visit the high-altitude Tsomgo Lake. Checkout the following morning and transfer back to Bagdogra Airport." }
    ],
    importantDetails: "Sikkim requires a special permit (RAP) which will be processed by our team for you.",
    images: ["https://images.unsplash.com/photo-1559139225-88a63ec9cfd5?w=800", "https://images.unsplash.com/photo-1608930514133-7498b8fd0306?w=800"],
    ratings: { average: 4.7, count: 2 },
    isLastMinute: false
  },

  // ==================== SOUTH ASIAN COUNTRIES (10) ====================
  {
    title: "Bali Tropical Paradise",
    description: "Relax on pristine beaches, explore lush rice fields, and immerse yourself in the spiritual culture of Ubud. The ultimate custom-ready tropical getaway.",
    price: 999,
    location: "Bali, Indonesia",
    starCategory: 5,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Ubud Sacred Monkey Forest Tour", "Tanah Lot Temple Sunset Visit", "Mount Batur Sunrise Trekking", "Traditional Balinese Spa Massage"],
    touristPlaces: ["Ubud Monkey Forest", "Tegallalang Rice Terraces", "Tanah Lot Temple", "Kuta Beach"],
    itinerary: [
      { day: 1, title: "Welcome to Bali", details: "Airport pickup with flower garland welcome. Transfer to a luxury 5-star beachfront resort in Seminyak." },
      { day: 2, title: "Cultural Ubud & Swings", details: "Visit the Tegallalang Rice Terraces and swing high above the forest. Spend the afternoon in Ubud Art Market." },
      { day: 3, title: "Adventure or Relaxation", details: "Optional sunrise trek up Mount Batur, or enjoy a 2-hour premium Balinese spa session at the resort." },
      { day: 4, title: "Sunset Temple & Farewell", details: "Visit the iconic Tanah Lot Temple perched on a rock. Buffet dinner featuring roasted pig and traditional dance." },
      { day: 5, title: "Departure", details: "Lazy morning at the pool. Check-out and transfer to Ngurah Rai International Airport." }
    ],
    importantDetails: "Visa on arrival is available for most countries. Bring comfortable footwear for hikes.",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "https://images.unsplash.com/photo-1518548419070-ad8e3b547217?w=800"],
    ratings: { average: 4.9, count: 1 },
    reviews: [ { username: "DavidL", rating: 5, comment: "Best vacation ever. The 5-star resort was world-class, dinner buffet was delicious!" } ],
    isLastMinute: true,
    lastMinutePrice: 849
  },
  {
    title: "Tokyo & Kyoto Explorer",
    description: "A group tour mapping the high-tech streets of Tokyo and the historic temples of Kyoto. Includes bullet train transfers and group dinners.",
    price: 2499,
    location: "Tokyo & Kyoto, Japan",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: true },
    amenities: { wifi: true, pool: false, gym: true, bar: false },
    activities: ["Shibuya Crossing & Harajuku Guided Walk", "Mt. Fuji & Hakone Day Trip", "Shinkansen (Bullet Train) Experience", "Fushimi Inari Shrine Hike"],
    touristPlaces: ["Shibuya", "Meiji Shrine", "Mt. Fuji", "Fushimi Inari Shrine", "Kinkaku-ji (Golden Pavilion)"],
    itinerary: [
      { day: 1, title: "Arrive in Tokyo", details: "Meet your tour leader at Haneda/Narita airport. Transfer to hotel in Shinjuku and attend a welcome group dinner." },
      { day: 2, title: "Tokyo City Sightseeing", details: "Explore Senso-ji temple in Asakusa, take photos at Shibuya Crossing, and shop in high-tech Akihabara." },
      { day: 3, title: "Mt. Fuji & Lake Ashi Cruise", details: "Full-day coach trip to Mount Fuji 5th station. Scenic boat cruise on Lake Ashi." },
      { day: 4, title: "Shinkansen to Kyoto & Temples", details: "Board the high-speed bullet train. Check into Kyoto hotel and explore the red torii gates of Fushimi Inari." },
      { day: 5, title: "Arashiyama Bamboo Grove", details: "Stroll through the towering bamboo forest and visit the Golden Pavilion. Final evening farewell banquet." },
      { day: 6, title: "Kyoto Departure", details: "Breakfast at hotel, free checkout time, and transfer to Kansai Airport." }
    ],
    importantDetails: "Group sizes are limited to 15 travelers. JR Train Pass is included in the package.",
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"],
    ratings: { average: 4.7, count: 3 },
    reviews: [
      { username: "KenG", rating: 5, comment: "Extremely well organized. The bullet train was awesome, local food was great." },
      { username: "EmmaW", rating: 4, comment: "Kyoto was magical. Loved the Fushimi Inari hike." }
    ],
    isLastMinute: false
  },
  {
    title: "Bangkok & Phuket Getaway",
    description: "Explore the ornate golden grand palaces of Bangkok, then fly south to relax on the pristine tropical sandy shores of Phuket.",
    price: 799,
    location: "Bangkok & Phuket, Thailand",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Grand Palace & Wat Pho Tour", "Phi Phi Islands Speedboat Day Trip", "Chao Phraya Dinner Cruise", "Phuket FantaSea Show"],
    touristPlaces: ["Wat Arun", "Grand Palace", "Phi Phi Islands", "Patong Beach", "Big Buddha Phuket"],
    itinerary: [
      { day: 1, title: "Arrive in Bangkok & Dinner Cruise", details: "Pickup from Suvarnabhumi Airport. Check into hotel. Evening luxury dinner cruise along the Chao Phraya River." },
      { day: 2, title: "Golden Temples & Flight to Phuket", details: "Visit the Reclining Buddha temple (Wat Pho). Take a domestic flight to Phuket. Check into a beachfront resort." },
      { day: 3, title: "Phi Phi Islands Day Trip", details: "Full-day speed boat cruise to Phi Phi Leh, snorkelling in Maya Bay, and buffet lunch on the island." },
      { day: 4, title: "Phuket Departure", details: "Leisure breakfast. Checkout and transfer to Phuket International Airport." }
    ],
    importantDetails: "Visa-free entries are available for many nationalities. Speedboats are not recommended for pregnant women.",
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800", "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
    ratings: { average: 4.7, count: 4 },
    isLastMinute: true,
    lastMinutePrice: 729
  },
  {
    title: "Singapore City Lights Escape",
    description: "Witness future designs in action. Tour Gardens by the Bay, ride the cable cars, and shop along Orchard Road in style.",
    price: 1299,
    location: "Singapore",
    starCategory: 5,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: true },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Gardens by the Bay Supertree & Dome tickets", "Sentosa Island Cable Car Ride", "Universal Studios Ticket", "Night Safari Guided Tram Tour"],
    touristPlaces: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Merlion Park", "Night Safari"],
    itinerary: [
      { day: 1, title: "Welcome to Singapore", details: "Private pickup from Changi Airport. Check into a luxury 5-star hotel near Marina Bay. Explore the Night Safari in the evening." },
      { day: 2, title: "Future Gardens & Sentosa", details: "Tour the Cloud Forest and Flower Dome at Gardens by the Bay. Take the cable car to Sentosa Island for evening shows." },
      { day: 3, title: "Universal Studios Adventure", details: "Full-day entry tickets to Universal Studios Singapore. Buffet dinner at Marina Bay Sands." },
      { day: 4, title: "Departure", details: "Morning shopping at Jewel Changi. Checkout and board your flight." }
    ],
    importantDetails: "SG Arrival Card must be filled out online 3 days prior to departure. Visa processing takes 5-7 working days.",
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800"],
    ratings: { average: 4.8, count: 3 },
    isLastMinute: false
  },
  {
    title: "Kuala Lumpur & Langkawi Explorer",
    description: "Explore the bustling skyline of Kuala Lumpur's Petronas Towers, then fly to the duty-free tropical island of Langkawi.",
    price: 899,
    location: "Kuala Lumpur, Malaysia",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Petronas Twin Towers Skybridge Walk", "Batu Caves Climb", "Langkawi Cable Car & SkyBridge Ride", "Mangrove Kayak Tour"],
    touristPlaces: ["Petronas Towers", "Batu Caves", "Langkawi SkyBridge", "Eagle Square"],
    itinerary: [
      { day: 1, title: "KL Arrival & Batu Caves", details: "Pickup from KLIA. Check into your hotel. Visit the grand Batu Caves steps in the afternoon." },
      { day: 2, title: "Petronas Twin Towers & Fly to Langkawi", details: "Walk across the Petronas Twin Towers skybridge. Take a flight to the duty-free island of Langkawi." },
      { day: 3, title: "SkyBridge & Island Hopping", details: "Ride the steep cable car to the Langkawi SkyBridge. Evening boat tour around the geopark." },
      { day: 4, title: "Departure", details: "Breakfast at resort. Checkout and transfer to Langkawi Airport." }
    ],
    importantDetails: "Langkawi is a duty-free zone. Bring light summer clothing and sunscreen.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800"],
    ratings: { average: 4.6, count: 2 },
    isLastMinute: false
  },
  {
    title: "Maldives Luxury Overwater Villa",
    description: "Stay in a premium overwater villa with direct lagoon slide entry. Swim with sea turtles and dine under the stars.",
    price: 2999,
    location: "Male, Maldives",
    starCategory: 5,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Guided House Reef Snorkeling", "Private Sunset Dolphin Cruise", "Undersea Restaurant Lunch", "Romantic Beach Candlelit Dinner"],
    touristPlaces: ["Male Lagoon", "Maafushi Reefs", "Sandbank Island"],
    itinerary: [
      { day: 1, title: "Speedboat Transfer to Paradise", details: "Arrive at Velana Airport. Board a speedboat to your luxury resort. Check into your overwater villa." },
      { day: 2, title: "Snorkeling & Dolphin Watch", details: "Explore the resort reef guided by marine biologists. Evening dolphin cruise with mocktails." },
      { day: 3, title: "Undersea Dining & Spa", details: "Experience dining in a glass undersea restaurant. Afternoon couples massage session." },
      { day: 4, title: "Departure", details: "Enjoy final views from your villa deck. Speedboat transfer back to Male Airport." }
    ],
    importantDetails: "All speedboats transfers are fully coordinated and included. Free visa on arrival for all visitors.",
    images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", "https://images.unsplash.com/photo-1439066610537-d79a71a590e8?w=800"],
    ratings: { average: 4.9, count: 6 },
    isLastMinute: false
  },
  {
    title: "Sri Lanka Scenic Wonders",
    description: "Explore the ancient lion fortress Sigiriya, ride the scenic train through Ella tea hills, and visit wild elephant sanctuaries.",
    price: 949,
    location: "Kandy & Ella, Sri Lanka",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: true },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Sigiriya Lion Rock Fortress Climb", "Ella Scenic Toy Train Ride", "Minneriya National Park Safari", "Temple of the Tooth Visit"],
    touristPlaces: ["Sigiriya Rock", "Ella Nine Arch Bridge", "Temple of the Tooth Kandy", "Pinnawala Elephant Orphanage"],
    itinerary: [
      { day: 1, title: "Colombo to Sigiriya Fortress", details: "Pickup from Bandaranaike Airport. Drive to Sigiriya. Visit the elephant orphanage on the way. Check in to resort." },
      { day: 2, title: "Sigiriya Climb & Kandy Temples", details: "Scale the Sigiriya Lion Rock at dawn. Drive to Kandy and visit the sacred Temple of the Tooth." },
      { day: 3, title: "Ella Scenic Train & Bridge", details: "Board the famous blue train to Ella. Hike to the historic Nine Arch Bridge." },
      { day: 4, title: "Departure", details: "Morning tea overlooking the Ella Gap. Drive back to Colombo Airport for departure." }
    ],
    importantDetails: "Sri Lanka ETA (visa) is required and managed in this package. Walking shoes are highly recommended.",
    images: ["https://images.unsplash.com/photo-1588598126483-241249713837?w=800", "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800"],
    ratings: { average: 4.7, count: 2 },
    isLastMinute: true,
    lastMinutePrice: 849
  },
  {
    title: "Nepal Everest Base Camp Trek",
    description: "Fly to Lukla and embark on the legendary trek through Sherpa villages to the base of Mount Everest.",
    price: 1799,
    location: "Kathmandu & Everest, Nepal",
    starCategory: 3,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: false, gym: false, bar: false },
    activities: ["Scenic Lukla Flight", "Namche Bazaar Acclimatization Hike", "Tengboche Monastery visit", "Everest Base Camp Ascent Walk"],
    touristPlaces: ["Namche Bazaar", "Tengboche Monastery", "Everest Base Camp", "Kathmandu Durbar Square"],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", details: "Pickup from Tribhuvan Airport. Check into hotel and buy final trekking gear. Group brief dinner." },
      { day: 2, title: "Lukla Flight & Phakding Trek", details: "Board a scenic flight to Lukla (2,860m). Trek to Phakding village beside the Dudh Koshi River." },
      { day: 3, title: "Trek to Namche Bazaar", details: "Hike up steep pine forests to the Sherpa capital of Namche Bazaar (3,440m)." },
      { day: 4, title: "Tengboche & Everest Base", details: "Trek through Tengboche Monastery. Reach Everest Base Camp (5,364m) before helicoper transfer back to Lukla and Kathmandu." },
      { day: 5, title: "Kathmandu Departure", details: "Checkout from hotel, buy local crafts, and transfer to Airport." }
    ],
    importantDetails: "High physical fitness is required. Helicopter evacuation insurance is mandatory.",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800", "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800"],
    ratings: { average: 4.9, count: 5 },
    isLastMinute: false
  },
  {
    title: "Hanoi & Halong Bay Cruise",
    description: "Explore the colonial quarters of Hanoi, then cruise amidst thousands of towering limestone karsts in Halong Bay.",
    price: 699,
    location: "Hanoi & Halong Bay, Vietnam",
    starCategory: 4,
    travelType: "standard",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: false },
    amenities: { wifi: true, pool: true, gym: false, bar: true },
    activities: ["Hanoi Rickshaw Old Quarter Tour", "Overnight Halong Bay Luxury Cruise", "Surprise Cave Kayaking Tour", "Vietnamese Spring Roll Class"],
    touristPlaces: ["Hanoi Old Quarter", "Ho Chi Minh Mausoleum", "Sung Sot (Surprise) Cave", "Ti Top Island"],
    itinerary: [
      { day: 1, title: "Arrive in Hanoi", details: "Pickup from Noi Bai Airport. Check into your boutique hotel. Experience a traditional water puppet show." },
      { day: 2, title: "Hanoi City & Halong Bay Cruise", details: "Tour the Old Quarter. Drive to Halong Bay. Board a luxury wooden junk boat cruise. Visit floating villages." },
      { day: 3, title: "Cave Kayaking & Ti Top Island", details: "Kayaking through rock tunnels into hidden lagoons. Hike to the peak of Ti Top Island for panoramic views." },
      { day: 4, title: "Departure", details: "Tai Chi session on the sundeck. Cruise back to port and transfer back to Hanoi Airport." }
    ],
    importantDetails: "E-visa is easily available online. Bring light layers for the evening cruise breeze.",
    images: ["https://images.unsplash.com/photo-1528127269322-539801943592?w=800", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    ratings: { average: 4.8, count: 4 },
    isLastMinute: false
  },
  {
    title: "Bhutan Kingdom of Happiness",
    description: "Climb the magical cliffside Tiger's Nest Monastery, walk through fortress valleys, and breathe pure Himalayan air.",
    price: 1699,
    location: "Paro & Thimphu, Bhutan",
    starCategory: 4,
    travelType: "group",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: true, visaServices: true },
    amenities: { wifi: true, pool: false, gym: false, bar: true },
    activities: ["Tiger's Nest Monastery Hike", "Punakha Dzong Fortress Guided Walk", "Thimphu Buddha Point Visit", "Traditional Bhutanese Hot Stone Bath"],
    touristPlaces: ["Tiger's Nest (Paro Taktsang)", "Punakha Dzong", "Buddha Dordenma Thimphu"],
    itinerary: [
      { day: 1, title: "Arrive Paro & Drive to Thimphu", details: "Spectacular landing at Paro Airport. Meet your guide and drive to the capital city Thimphu. Check into hotel." },
      { day: 2, title: "Thimphu Dzongs & Punakha", details: "Visit the massive Buddha statue. Drive over Dochu La Pass (3,100m) to Punakha. Explore Punakha Dzong." },
      { day: 3, title: "Tiger's Nest Monastery Climb", details: "Drive back to Paro. Embark on the 4-hour hike to the cliffside Taktsang Monastery hanging 900m above the valley." },
      { day: 4, title: "Departure", details: "Enjoy a traditional hot stone bath. Checkout and transfer to Paro Airport." }
    ],
    importantDetails: "Daily Bhutan Sustainable Development Fee (SDF) and visa fees are fully included in this price.",
    images: ["https://images.unsplash.com/photo-1548108712-4d0094dff93b?w=800", "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800"],
    ratings: { average: 5.0, count: 3 },
    isLastMinute: false
  },
  {
    title: "Boracay Coral Beach Escape",
    description: "Settle on the powdery white sand of Boracay. Enjoy snorkeling, parasailing, and vibrant nightlife on the beachfront.",
    price: 849,
    location: "Boracay, Philippines",
    starCategory: 4,
    travelType: "custom",
    inclusions: { airportPickup: true, breakfast: true, dinnerBuffet: false, visaServices: false },
    amenities: { wifi: true, pool: true, gym: true, bar: true },
    activities: ["Boracay Island Hopping & Snorkel Tour", "Sunset Paraw Sailing Boat Cruise", "Helmet Diving & Coral Sea Walk", "Beachfront BBQ Dinner"],
    touristPlaces: ["White Beach Station 1", "Puka Shell Beach", "Mount Luho Viewpoint"],
    itinerary: [
      { day: 1, title: "Arrive Caticlan & Boracay Transfer", details: "Airport pickup at Caticlan. Express boat transfer to Boracay Island. Check in to your luxury beach resort." },
      { day: 2, title: "Island Hopping & Snorkeling", details: "Tour Puka beach and Crocodile Island reefs. Afternoon free for relaxing on White Beach." },
      { day: 3, title: "Paraw Sailing & Sunset", details: "Board a traditional double-outrigger sailboat (Paraw) for a sunset cruise. Beachfront BBQ dinner." },
      { day: 4, title: "Departure", details: "Morning swim in the ocean. Checkout and speedboat transfer back to Caticlan Airport." }
    ],
    importantDetails: "Environmental fees are included. Direct flights to Caticlan (MPH) are recommended.",
    images: ["https://images.unsplash.com/photo-1540206395-68808572332f?w=800", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    ratings: { average: 4.8, count: 2 },
    isLastMinute: true,
    lastMinutePrice: 799
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      console.error('CRITICAL ERROR: MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }
    await mongoose.connect(connStr);
    console.log('MongoDB connected for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Package.deleteMany();
    console.log('Cleaned up existing users and packages...');

    // Seed default packages
    await Package.insertMany(defaultPackages);
    console.log(`${defaultPackages.length} packages successfully seeded!`);

    // Seed users
    // Admin user
    const adminUser = new User({
      name: "AttHolidays Admin",
      email: "admin@attholidays.com",
      password: "admin123",
      role: "admin"
    });
    await adminUser.save();

    // Regular customer user
    const regularUser = new User({
      name: "John Doe",
      email: "user@attholidays.com",
      password: "user123",
      role: "customer",
      kittySubscription: {
        tier: "Silver",
        points: 350,
        lastPaymentDate: new Date()
      }
    });
    await regularUser.save();

    console.log('Test users successfully seeded!');
    console.log('Credentials:');
    console.log('Admin: admin@attholidays.com / admin123');
    console.log('Customer: user@attholidays.com / user123');

    mongoose.disconnect();
    console.log('DB disconnected. Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
