// 1. Service Category (Screen 1)
export interface ServiceCategory {
  id: string;
  title: string;
  badgeText?: string;
  description?: string;
}

// 2. Service Sub-Card (Screen 2: Per service 2 to 6 cards)
export interface ServiceCard {
  id: string;
  serviceId: string;
  title: string;
  description?: string;
  iconName?: string;
}

// 3. Package Option / Pricing Card (Screen 3: Per option 2 to 5 cards with price)
export interface PackageOption {
  id: string;
  serviceId: string;
  planName: string; // e.g., 'FULL DAY', 'HALF DAY'
  price: number;
  features: string[]; // List of included features
  isPopular?: boolean;
}

// 4. Booking Submission Data
export interface BookingRequest {
  id?: string;
  fullName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  serviceType: string;
  selectedPlan: string;
  businessType?: string;
  teamSize?: string;
  targetShootDate: string;
  preferredContact?: string;
  description?: string;
  createdAt?: string;
}