
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export enum ServiceCategory {
  AIRTIME = 'airtime',
  DATA = 'data',
  ELECTRICITY = 'electricity',
  CABLE = 'cable',
  WALLET_FUND = 'wallet_fund'
}

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILED = 'failed'
}

export interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface User {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  walletBalance: number; // in Kobo
  virtualAccount: VirtualAccount;
  kycStatus: 'verified' | 'pending' | 'unverified';
  pinSet: boolean;
  biometricsEnabled: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: ServiceCategory;
  amount: number; // in Kobo
  previousBalance: number;
  newBalance: number;
  status: TransactionStatus;
  reference: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface Product {
  id: string;
  type: ServiceCategory;
  network?: string;
  displayName: string;
  price: number; // in Kobo
  providerCode: string;
}
