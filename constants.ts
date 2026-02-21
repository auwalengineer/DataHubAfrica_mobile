
import { Product, ServiceCategory } from './types';

export const COLORS = {
  primary: '#5E00A3', // Deep Purple from logo text
  secondary: '#FF5100', // Sunset Orange from logo icon
  accent: '#FFB800', // Warm Yellow from logo icon
  dark: '#1A0033', // Darker shade of purple for text
  light: '#F9F8FD', // Soft purple-tinted background
  white: '#FFFFFF',
  gray: '#94A3B8'
};

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', type: ServiceCategory.DATA, network: 'MTN', displayName: 'MTN 1GB Monthly', price: 50000, providerCode: 'mtn-1gb' },
  { id: '2', type: ServiceCategory.DATA, network: 'MTN', displayName: 'MTN 2.5GB Monthly', price: 100000, providerCode: 'mtn-2.5gb' },
  { id: '3', type: ServiceCategory.AIRTIME, network: 'Airtel', displayName: 'Airtel Airtime', price: 0, providerCode: 'airtel-vtu' },
  { id: '4', type: ServiceCategory.ELECTRICITY, displayName: 'EKEDC Postpaid', price: 0, providerCode: 'ekedc' },
  { id: '5', type: ServiceCategory.CABLE, displayName: 'DSTV Compact', price: 1250000, providerCode: 'dstv-compact' },
];

export const APP_NAME = "DataHub Africa";
