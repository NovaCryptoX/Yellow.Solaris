// Utility for formatting amounts in Botswana Pula (BWP)

export const CURRENCY_CODE = "BWP";
export const CURRENCY_SYMBOL = "P";

// Format a number into readable currency (e.g., P 1,234.56)
export function formatCurrency(amount) {
  if (isNaN(amount)) return `${CURRENCY_SYMBOL} 0.00`;
  return new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Convert between currencies if needed (demo conversion rates)
const conversionRates = {
  USD: 0.073,  // 1 BWP ≈ 0.073 USD
  EUR: 0.068,  // 1 BWP ≈ 0.068 EUR
  ZAR: 1.36,   // 1 BWP ≈ 1.36 ZAR
  BWP: 1,
};

// Convert BWP to another currency
export function convertCurrency(amount, targetCurrency = "BWP") {
  const rate = conversionRates[targetCurrency.toUpperCase()] || 1;
  return amount * rate;
}

// Example: formatCurrency(convertCurrency(100, "USD"))
