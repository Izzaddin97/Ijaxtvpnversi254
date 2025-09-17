// Payment account details and configuration constants
export const PAYMENT_ACCOUNTS = {
  card: {
    accountName: "Muhammad Izzaddin Bin Idris",
    cardType: "MasterCard MyDebit",
    cardNumber: "5491 8620 4391 2045",
    expiryDate: "10/32",
    cvv: "964"
  },
  bank: {
    accountName: "Muhammad Izzaddin Bin Idris",
    bankName: "Maybank",
    accountNumber: "152116463728"
  },
  ewallet: {
    accountName: "Muhammad Izzaddin Bin Idris",
    provider: "Touch & Go eWallet",
    phoneNumber: "171253115508"
  }
};

export const BANK_OPTIONS = [
  { value: "maybank", label: "Maybank" },
  { value: "cimb", label: "CIMB Bank" },
  { value: "publicbank", label: "Public Bank" },
  { value: "rhb", label: "RHB Bank" },
  { value: "hongleong", label: "Hong Leong Bank" }
];

export const PAYMENT_INSTRUCTIONS = [
  "Fill in your payment details above",
  "Click \"Complete Payment\" to process", 
  "Transfer to the account shown",
  "Keep transaction receipt for verification",
  "Access will be activated within 1-2 hours"
];

export const SECURITY_FEATURES = [
  "No payment information stored on our servers",
  "Instant payment confirmation", 
  "24/7 customer support available"
];
