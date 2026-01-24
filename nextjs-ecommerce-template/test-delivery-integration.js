// Test script to verify delivery fee integration
const { calculateDeliveryFee, ALL_NIGERIAN_STATES } = require('./delivery-fee-calculator.js');

console.log('=== DELIVERY FEE INTEGRATION TEST ===\n');

// Test 1: Local delivery (Owerri)
const localOrder = {
  deliveryState: "Imo",
  deliveryCity: "Owerri",
  items: [
    { weightKg: 0.5, sizeCategory: "SMALL", isFragile: false }
  ]
};

// Test 2: Nearby state delivery
const nearbyOrder = {
  deliveryState: "Abia",
  deliveryCity: "Umuahia",
  items: [
    { weightKg: 2, sizeCategory: "MEDIUM", isFragile: true },
    { weightKg: 1.5, sizeCategory: "SMALL", isFragile: false }
  ]
};

// Test 3: Far state delivery
const farOrder = {
  deliveryState: "Lagos",
  deliveryCity: "Lagos",
  items: [
    { weightKg: 5, sizeCategory: "LARGE", isFragile: false },
    { weightKg: 3, sizeCategory: "MEDIUM", isFragile: true }
  ]
};

console.log('Test 1 - Local Delivery (Owerri):');
try {
  const result1 = calculateDeliveryFee(localOrder);
  console.log(`✅ Zone: ${result1.zone}, Fee: ₦${result1.totalDeliveryFee}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

console.log('\nTest 2 - Nearby State (Abia):');
try {
  const result2 = calculateDeliveryFee(nearbyOrder);
  console.log(`✅ Zone: ${result2.zone}, Fee: ₦${result2.totalDeliveryFee}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

console.log('\nTest 3 - Far State (Lagos):');
try {
  const result3 = calculateDeliveryFee(farOrder);
  console.log(`✅ Zone: ${result3.zone}, Fee: ₦${result3.totalDeliveryFee}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

console.log(`\n✅ Available states: ${ALL_NIGERIAN_STATES.length} states configured`);
console.log('\n=== INTEGRATION TEST COMPLETE ===');
