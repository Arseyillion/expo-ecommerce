// ======= NIGERIA DELIVERY FEE CALCULATOR =======
// Origin: Owerri, Imo State
// This system calculates delivery fees based on zones, weight, size, and risk factors

// ======= CONFIGURATION =======
// Base delivery fee per zone (in Naira)
const ZONE_BASE_FEE = {
  A: 1000,  // Same city (Owerri)
  B: 2000,  // Same state (Imo)
  C: 3500,  // Nearby/contiguous states
  D: 5000,  // Far but accessible states
  E: 8000   // Remote/high-risk areas
};

// Size-based additional fees (in Naira)
const SIZE_FEE = {
  SMALL: 0,    // Items that fit in standard envelope/small box
  MEDIUM: 800, // Medium-sized packages
  LARGE: 2000  // Large/bulky items
};

// Weight configuration
const BASE_WEIGHT_KG = 2;           // First 2kg included in base fee
const EXTRA_WEIGHT_FEE_PER_KG = 400; // Fee per additional kg beyond base weight

// Special handling fees (in Naira)
const FRAGILE_FEE = 1200;  // Extra care for fragile items
const RISK_FEE = 2500;     // Surcharge for high-risk/security areas

// ======= NIGERIA GEOGRAPHIC CONFIGURATION =======
// Comprehensive mapping of nearby states for Zone C logic
// Based on geographic proximity and major road connections
const NEARBY_STATES = {
  "Imo": ["Abia", "Anambra", "Rivers", "Akwa Ibom", "Cross River"], // States bordering Imo
  "Abia": ["Imo", "Anambra", "Enugu", "Cross River", "Akwa Ibom"],
  "Anambra": ["Imo", "Abia", "Enugu", "Delta", "Kogi"],
  "Rivers": ["Imo", "Abia", "Cross River", "Akwa Ibom", "Bayelsa"],
  "Akwa Ibom": ["Imo", "Cross River", "Rivers", "Ebonyi"],
  "Cross River": ["Imo", "Abia", "Akwa Ibom", "Rivers", "Benue"],
  "Enugu": ["Abia", "Anambra", "Ebonyi", "Benue", "Kogi"],
  "Ebonyi": ["Abia", "Enugu", "Cross River", "Benue"],
  "Delta": ["Anambra", "Edo", "Bayelsa", "Rivers", "Kogi"],
  "Edo": ["Delta", "Ondo", "Kogi", "Ekiti"],
  "Bayelsa": ["Rivers", "Delta"],
  "Benue": ["Enugu", "Ebonyi", "Cross River", "Kogi", "Nasarawa", "Taraba"],
  "Kogi": ["Anambra", "Delta", "Edo", "Enugu", "Benue", "Nasarawa", "Kwara", "Niger"],
  "Ondo": ["Edo", "Ogun", "Ekiti", "Oyo", "Kogi"],
  "Ekiti": ["Ondo", "Edo", "Kwara", "Osun", "Oyo"],
  "Kwara": ["Kogi", "Ekiti", "Osun", "Oyo", "Niger"],
  "Oyo": ["Ogun", "Ondo", "Ekiti", "Osun", "Kwara", "Ogun"],
  "Osun": ["Oyo", "Ondo", "Ekiti", "Kwara", "Ogun"],
  "Ogun": ["Oyo", "Lagos", "Ondo", "Osun", "Kwara"],
  "Lagos": ["Ogun", "Oyo"],
  "Niger": ["Kogi", "Kwara", "Nasarawa", "Abuja", "Kaduna", "Zamfara", "Kebbi"],
  "Nasarawa": ["Benue", "Kogi", "Niger", "Abuja", "Plateau", "Taraba"],
  "Abuja": ["Niger", "Nasarawa", "Kogi", "Kaduna", "Plateau"],
  "Plateau": ["Nasarawa", "Abuja", "Kaduna", "Bauchi", "Taraba"],
  "Kaduna": ["Abuja", "Niger", "Katsina", "Kano", "Bauchi", "Plateau", "Zamfara"],
  "Kano": ["Kaduna", "Katsina", "Jigawa", "Bauchi"],
  "Katsina": ["Kaduna", "Kano", "Jigawa", "Zamfara"],
  "Jigawa": ["Kano", "Katsina", "Bauchi", "Yobe"],
  "Bauchi": ["Kano", "Jigawa", "Yobe", "Gombe", "Plateau", "Kaduna"],
  "Yobe": ["Jigawa", "Bauchi", "Gombe", "Borno"],
  "Gombe": ["Bauchi", "Yobe", "Borno", "Adamawa", "Taraba", "Plateau"],
  "Borno": ["Yobe", "Gombe", "Adamawa"],
  "Adamawa": ["Borno", "Gombe", "Taraba"],
  "Taraba": ["Adamawa", "Gombe", "Benue", "Nasarawa", "Plateau"],
  "Sokoto": ["Zamfara", "Kebbi", "Katsina"],
  "Zamfara": ["Sokoto", "Kebbi", "Niger", "Kaduna", "Katsina"],
  "Kebbi": ["Sokoto", "Zamfara", "Niger"]
};

// List of all Nigerian states for validation
const ALL_NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Major cities and towns in each Nigerian state for dropdown selection
const NIGERIAN_CITIES = {
  "Abia": ["Aba", "Umuahia", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa", "Isuikwuato", "Obioma Ngwa", "Ohafia", "Osisioma", "Ukwa", "Umunneochi"],
  "Adamawa": ["Yola", "Mubi", "Jimeta", "Numan", "Ganye", "Lamurde", "Madagali", "Mayo Belwa", "Michika", "Song", "Toungo", "Yola South"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Ikot Abasi", "Oron", "Abak", "Etinan", "Ibeno", "Itu", "Mbo", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Ukanafun", "Uruan", "Urue Offong"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguata", "Anambra", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Ogbaru", "Oyi"],
  "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are", "Katagum", "Kirfi", "Alkaleri", "Bogoro", "Dambam", "Darazo", "Gamawa", "Giade", "Itas/Gadau", "Kirfi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  "Bayelsa": ["Yenagoa", "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw"],
  "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina Ala", "Vandeikya", "Ado", "Agatu", "Apa", "Buruku", "Guma", "Gwer East", "Gwer West", "Homa", "Juju", "Kashimbila", "Konshisha", "Kwande", "Logo", "Obi", "Oju", "Okpokwu", "Tarka", "Ukum", "Ushongo", "Utonkon"],
  "Borno": ["Maiduguri", "Bama", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River": ["Calabar", "Ikom", "Ogoja", "Obubra", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Etung", "Igede", "Obanliku", "Obudu", "Odukpani", "Yala"],
  "Delta": ["Warri", "Asaba", "Sapele", "Ughelli", "Agbor", "Abraka", "Burutu", "Effurun", "Ekpan", "Ibusa", "Issele Uku", "Koko", "Kwale", "Obi", "Oghara", "Ogwashi Uku", "Oleh", "Ozoro", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "Edo": ["Benin City", "Auchi", "Uromi", "Ekpoma", "Irrua", "Sabongida Ora", "Ubiaja", "Agbede", "Esan Central", "Esan North East", "Esan South East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North East", "Ovia South West", "Owan East", "Owan West", "Uhunmwonde"],
  "Ekiti": ["Ado Ekiti", "Ikere Ekiti", "Ijero Ekiti", "Ikole Ekiti", "Oye Ekiti", "Efon", "Ekiti East", "Ekiti South West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikole", "Ikere", "Ilejemeje", "Ise/Orun", "Moba", "Oye"],
  "Enugu": ["Enugu", "Nsukka", "Awgu", "Udi", "Oji River", "Ezeagu", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Udenu", "Uzo Uwani"],
  "Abuja": ["Abuja Municipal", "Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  "Gombe": ["Gombe", "Kaltungo", "Balanga", "Dukku", "Akko", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu Deba"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise", "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Owerri Municipal", "Owerri North", "Owerri West", "Orlu", "Oru East", "Oru West"],
  "Jigawa": ["Dutse", "Gumel", "Hadejia", "Kazaure", "Ringim", "Birnin Kudu", "Birniwa", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi", "Auyo", "Babura", "Biriniwa", "Bulangu", "Chut", "Dabarkaran"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Zangon Kataf", "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kauru", "Kawo", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Tudun Wada", "Zangon Kataf", "Zaria"],
  "Kano": ["Kano", "Kano Municipal", "Dala", "Fagge", "Gwale", "Kano Municipal", "Kumbotso", "Nassarawa", "Rimin Gado", "Sabon Gari", "Tarauni", "Ungogo", "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Hadejia", "Kabo", "Kaita", "Kano", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Zango", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibiya", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", " Matazu", "Rimi", "Rugu", "Sabuwa", "Safana", "Shema", "Zango"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Aleiro", "Arewa Dandi", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "Kogi": ["Lokoja", "Okene", "Kabba", "Idah", "Ajaokuta", "Adavi", "Aiyegbu", "Ankpa", "Bassa", "Dekina", "Ibaji", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "Kwara": ["Ilorin", "Offa", "Omu Aran", "Jebba", "Patigi", "Kaiama", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Isin", "Kaima", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "Lagos": ["Ikeja", "Lagos Island", "Lagos Mainland", "Victoria Island", "Ikoyi", "Apapa", "Badagry", "Ikeja", "Ikorodu", "Agege", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju Lekki", "Ifako Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Shomolu", "Surulere"],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Wamba", "Karu", "Doma", "Nasarawa Egon", "Obi", "Toto", "Awe", "Bokkos", "Bokkos", "Doma", "Karu", "Keana", "Keffi", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  "Niger": ["Minna", "Bida", "Kontagora", "Suleja", "Agaie", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mashegu", "Mokwa", "Muya", "Paikoro", "Rafi", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "Ogun": ["Abeokuta", "Ijebu Ode", "Sagamu", "Ifo", "Ota", "Ilaro", "Abeokuta North", "Abeokuta South", "Ado Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Remo South", "Shagamu"],
  "Ondo": ["Akure", "Ondo", "Owo", "Akoko", "Akure North", "Akure South", "Akoko North East", "Akoko North West", "Akoko South Akure", "Akoko South West", "Ese Odo", "Idanre", "Ifedore", "Igbara Oke", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  "Osun": ["Osogbo", "Ile Ife", "Ilesha", "Ede", "Ikire", "Iwo", "Atakumosa East", "Atakumosa West", "Ayedaade", "Ayedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  "Oyo": ["Ibadan", "Ibadan North", "Ibadan North East", "Ibadan North West", "Ibadan South East", "Ibadan South West", "Ibadan Municipal", "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere", "Oyo Town"],
  "Plateau": ["Jos", "Barkin Ladi", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase", "Bassa", "Bokkos", "Barkin Ladi", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  "Rivers": ["Port Harcourt", "Obio Akpor", "Bonny", "Okrika", "Degema", "Ahoada East", "Ahoada West", "Akuku Toru", "Andoni", "Asari Toru", "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio Akpor", "Ogba/Egbema/Ndoni", "Oyigbo", "Port Harcourt", "Tai"],
  "Sokoto": ["Sokoto", "Wamako", "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  "Taraba": ["Jalingo", "Wukari", "Bali", "Gembu", "Takum", "Ardo Kola", "Bali", "Bashir", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "Yobe": ["Damaturu", "Gashua", "Potiskum", "Nguru", "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Bakura", "Birnin Magaji", "Bukkuyum", "Bungudu", "Chafe", "Gummi", "Gusau", "Isa", "Kaura Namoda", "Kiyawa", "Maradun", "Maru", "Mafara", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi", "Anka", "Birnin Magaji", "Bukkuyum", "Bungudu", "Chafe", "Gummi", "Gusau", "Isa", "Kaura Namoda", "Kiyawa", "Maradun", "Maru", "Mafara", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"]
};

// ======= UTILITY FUNCTIONS =======

/**
 * Check if a location is considered high-risk for delivery
 * High-risk areas may have security challenges, poor infrastructure, or limited access
 * @param {string} state - Destination state
 * @param {string} city - Destination city
 * @returns {boolean} - True if location is high-risk
 */
function isHighRiskArea(state, city) {
  // Define high-risk areas based on current security and infrastructure assessment
  const highRiskLocations = [
    // States with known security challenges
    { state: "Borno" },
    { state: "Yobe" },
    { state: "Zamfara" },
    { state: "Sokoto" },
    { state: "Katsina" },
    // Specific cities/towns with delivery challenges
    { state: "Adamawa", city: "Mubi" },
    { state: "Borno", city: "Maiduguri" },
    { state: "Yobe", city: "Damaturu" },
    { state: "Zamfara", city: "Gusau" }
  ];
  
  return highRiskLocations.some(loc => 
    loc.state === state && (!loc.city || loc.city === city)
  );
}

/**
 * Determine delivery zone based on origin (Owerri) and destination
 * Zone A: Same city (Owerri)
 * Zone B: Same state (Imo)
 * Zone C: Nearby/contiguous states
 * Zone D: Far but accessible states
 * Zone E: Remote/high-risk areas
 * @param {string} destState - Destination state
 * @param {string} destCity - Destination city
 * @returns {string} - Delivery zone (A, B, C, D, or E)
 */
function resolveDeliveryZone(destState, destCity) {
  const originState = "Imo";
  const originCity = "Owerri";
  
  // Zone A: Same city
  if (destState === originState && destCity === originCity) {
    return "A";
  }
  
  // Zone B: Same state, different city
  if (destState === originState) {
    return "B";
  }
  
  // Zone C: Nearby/contiguous states
  if (NEARBY_STATES[originState] && NEARBY_STATES[originState].includes(destState)) {
    return "C";
  }
  
  // Zone D: Far but accessible states (all other Nigerian states)
  if (ALL_NIGERIAN_STATES.includes(destState)) {
    return "D";
  }
  
  // Zone E: Unknown or international locations
  return "E";
}

/**
 * Validate that the state is a valid Nigerian state
 * @param {string} state - State to validate
 * @returns {boolean} - True if valid Nigerian state
 */
function isValidNigerianState(state) {
  return ALL_NIGERIAN_STATES.includes(state);
}

// ======= CORE DELIVERY FEE CALCULATION =======

/**
 * Calculate comprehensive delivery fee for an order
 * @param {Object} order - Order object containing delivery info and items
 * @param {string} order.deliveryState - Destination state
 * @param {string} order.deliveryCity - Destination city
 * @param {Array} order.items - Array of items in the order
 * @param {Object} order.items[].weightKg - Weight of item in kilograms
 * @param {string} order.items[].sizeCategory - Size category: "SMALL", "MEDIUM", or "LARGE"
 * @param {boolean} order.items[].isFragile - Whether item is fragile
 * @returns {Object} - Detailed breakdown of delivery costs
 */
function calculateDeliveryFee(order) {
  // Input validation
  if (!order.deliveryState || !order.deliveryCity) {
    throw new Error("Delivery state and city are required");
  }
  
  if (!isValidNigerianState(order.deliveryState)) {
    throw new Error(`Invalid Nigerian state: ${order.deliveryState}`);
  }
  
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  
  // 1️⃣ Determine delivery zone
  const zone = resolveDeliveryZone(order.deliveryState, order.deliveryCity);
  
  // 2️⃣ Get base fee for the zone
  const zoneBaseFee = ZONE_BASE_FEE[zone];
  
  // 3️⃣ Calculate cart metrics (weight, size, fragility)
  let totalWeightKg = 0;
  let largestSize = "SMALL";
  let hasFragileItem = false;
  
  for (const item of order.items) {
    // Validate item
    if (!item.weightKg || item.weightKg <= 0) {
      throw new Error("Item weight must be greater than 0");
    }
    
    if (!["SMALL", "MEDIUM", "LARGE"].includes(item.sizeCategory)) {
      throw new Error("Item size must be SMALL, MEDIUM, or LARGE");
    }
    
    // Accumulate weight
    totalWeightKg += item.weightKg;
    
    // Track largest size (use highest size for pricing)
    if (item.sizeCategory === "LARGE") {
      largestSize = "LARGE";
    } else if (item.sizeCategory === "MEDIUM" && largestSize !== "LARGE") {
      largestSize = "MEDIUM";
    }
    
    // Check for fragile items
    if (item.isFragile) {
      hasFragileItem = true;
    }
  }
  
  // 4️⃣ Calculate extra weight fee (beyond base weight)
  const extraWeightKg = Math.max(0, totalWeightKg - BASE_WEIGHT_KG);
  const weightFee = extraWeightKg * EXTRA_WEIGHT_FEE_PER_KG;
  
  // 5️⃣ Calculate size fee based on largest item
  const sizeFee = SIZE_FEE[largestSize];
  
  // 6️⃣ Calculate fragile fee (charged once if any item is fragile)
  const fragileFee = hasFragileItem ? FRAGILE_FEE : 0;
  
  // 7️⃣ Calculate risk fee for high-risk areas
  const riskFee = isHighRiskArea(order.deliveryState, order.deliveryCity) ? RISK_FEE : 0;
  
  // 8️⃣ Calculate total delivery fee
  const totalDeliveryFee = zoneBaseFee + weightFee + sizeFee + fragileFee + riskFee;
  
  // Return detailed breakdown for transparency
  return {
    zone,
    zoneDescription: getZoneDescription(zone),
    breakdown: {
      baseFee: zoneBaseFee,
      weightFee,
      sizeFee,
      fragileFee,
      riskFee
    },
    metrics: {
      totalWeightKg: Math.round(totalWeightKg * 100) / 100, // Round to 2 decimal places
      largestSize,
      hasFragileItem,
      isHighRisk: riskFee > 0
    },
    totalDeliveryFee
  };
}

/**
 * Get human-readable description of delivery zone
 * @param {string} zone - Zone letter
 * @returns {string} - Description of the zone
 */
function getZoneDescription(zone) {
  const descriptions = {
    A: "Same City (Owerri)",
    B: "Same State (Imo)",
    C: "Nearby States",
    D: "Far States",
    E: "Remote/High-Risk Areas"
  };
  return descriptions[zone] || "Unknown Zone";
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateDeliveryFee,
    resolveDeliveryZone,
    isHighRiskArea,
    isValidNigerianState,
    ZONE_BASE_FEE,
    SIZE_FEE,
    ALL_NIGERIAN_STATES,
    NIGERIAN_CITIES
  };
}

// Export for ES6 modules
export {
  calculateDeliveryFee,
  resolveDeliveryZone,
  isHighRiskArea,
  isValidNigerianState,
  ZONE_BASE_FEE,
  SIZE_FEE,
  ALL_NIGERIAN_STATES,
  NIGERIAN_CITIES
};
