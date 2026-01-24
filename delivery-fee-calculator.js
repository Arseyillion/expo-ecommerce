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

// ======= EXAMPLE USAGE AND TEST CASES =======

/**
 * Test function to demonstrate delivery fee calculation
 */
function runDeliveryFeeExamples() {
  console.log("=== NIGERIA DELIVERY FEE CALCULATOR ===");
  console.log("Origin: Owerri, Imo State\n");
  
  // Example 1: Local delivery within Owerri
  const localOrder = {
    deliveryState: "Imo",
    deliveryCity: "Owerri",
    items: [
      { weightKg: 0.5, sizeCategory: "SMALL", isFragile: false }
    ]
  };
  
  // Example 2: Delivery to nearby state (Abia)
  const nearbyOrder = {
    deliveryState: "Abia",
    deliveryCity: "Umuahia",
    items: [
      { weightKg: 2, sizeCategory: "MEDIUM", isFragile: true },
      { weightKg: 1.5, sizeCategory: "SMALL", isFragile: false }
    ]
  };
  
  // Example 3: Delivery to far state (Lagos)
  const farOrder = {
    deliveryState: "Lagos",
    deliveryCity: "Lagos",
    items: [
      { weightKg: 5, sizeCategory: "LARGE", isFragile: false },
      { weightKg: 3, sizeCategory: "MEDIUM", isFragile: true }
    ]
  };
  
  // Example 4: Delivery to high-risk area
  const riskOrder = {
    deliveryState: "Borno",
    deliveryCity: "Maiduguri",
    items: [
      { weightKg: 1, sizeCategory: "SMALL", isFragile: false }
    ]
  };
  
  // Calculate and display results
  const examples = [
    { name: "Local Delivery (Owerri)", order: localOrder },
    { name: "Nearby State (Abia)", order: nearbyOrder },
    { name: "Far State (Lagos)", order: farOrder },
    { name: "High-Risk Area (Borno)", order: riskOrder }
  ];
  
  examples.forEach(({ name, order }) => {
    try {
      const result = calculateDeliveryFee(order);
      console.log(`--- ${name} ---`);
      console.log(`Zone: ${result.zone} (${result.zoneDescription})`);
      console.log(`Total Weight: ${result.metrics.totalWeightKg}kg`);
      console.log(`Largest Size: ${result.metrics.largestSize}`);
      console.log(`Fragile Items: ${result.metrics.hasFragileItem ? 'Yes' : 'No'}`);
      console.log(`High-Risk Area: ${result.metrics.isHighRisk ? 'Yes' : 'No'}`);
      console.log(`Base Fee: ₦${result.breakdown.baseFee}`);
      console.log(`Weight Fee: ₦${result.breakdown.weightFee}`);
      console.log(`Size Fee: ₦${result.breakdown.sizeFee}`);
      console.log(`Fragile Fee: ₦${result.breakdown.fragileFee}`);
      console.log(`Risk Fee: ₦${result.breakdown.riskFee}`);
      console.log(`Total Delivery Fee: ₦${result.totalDeliveryFee}\n`);
    } catch (error) {
      console.log(`Error calculating ${name}: ${error.message}\n`);
    }
  });
}

// Run examples if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  runDeliveryFeeExamples();
}

// Export functions for use in other modules
if (typeof module !== 'undefined') {
  module.exports = {
    calculateDeliveryFee,
    resolveDeliveryZone,
    isHighRiskArea,
    isValidNigerianState,
    ZONE_BASE_FEE,
    SIZE_FEE,
    ALL_NIGERIAN_STATES
  };
}
