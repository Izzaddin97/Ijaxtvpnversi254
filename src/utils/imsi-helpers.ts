// IMSI generation and management utilities
export const MALAYSIAN_CARRIERS = [
  { mnc: "12", name: "Celcom" },
  { mnc: "16", name: "Digi" },
  { mnc: "19", name: "U Mobile" },
  { mnc: "153", name: "Webe" }
];

export const generateRandomIMSI = (): string => {
  // MCC (Mobile Country Code) - 3 digits (502 for Malaysia)
  const mcc = "502";
  // MNC (Mobile Network Code) - 2 digits from carriers
  const carriers = MALAYSIAN_CARRIERS.map(c => c.mnc);
  const mnc = carriers[Math.floor(Math.random() * carriers.length)];
  // MSIN (Mobile Subscriber Identification Number) - 10 digits
  const msin = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  
  return `${mcc}${mnc}${msin}`;
};

export const getCarrierFromIMSI = (imsi: string): string => {
  const mnc = imsi.slice(3, 5);
  const carrier = MALAYSIAN_CARRIERS.find(c => c.mnc === mnc);
  return carrier?.name || "Unknown";
};

export const formatIMSI = (imsi: string, showIMSI: boolean = true): string => {
  if (!showIMSI) {
    return "••• •• ••••••••••";
  }
  return `${imsi.slice(0, 3)} ${imsi.slice(3, 5)} ${imsi.slice(5)}`;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
