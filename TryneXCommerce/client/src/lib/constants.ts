export const WHATSAPP_NUMBER = "01747292277";
export const COMPANY_EMAIL = "support@trynex.com";

export const DELIVERY_FEES = {
  DHAKA_METRO: 80,
  OUTSIDE_DHAKA: 120,
  OTHER_DISTRICTS: 150
};

export const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "cod", label: "Cash on Delivery" }
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "orange" },
  { value: "confirmed", label: "Confirmed", color: "blue" },
  { value: "processing", label: "Processing", color: "yellow" },
  { value: "shipped", label: "Shipped", color: "purple" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" }
];

export const LANGUAGES = {
  EN: { code: "en", name: "English" },
  BN: { code: "bn", name: "বাংলা" }
};
