
export type Language = 'pt' | 'en';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'bonus' | 'fee' | 'game' | 'transfer';
  title: string;
  subtitle?: string;
  amountFiat: number;
  amountCrypto?: number;
  date: string; // ISO string or display string
  rawDate?: Date; // Helper for sorting if needed
  status: 'completed' | 'pending' | 'failed';
  isGain?: boolean; // Helper for display color
}

export interface User {
  name: string;
  balanceFiat: number;
  balanceCrypto: number;
}

export type ScreenName = 
  | 'onboarding' 
  | 'create-account'
  | 'login'
  | 'dashboard' 
  | 'deposit' 
  | 'deposit-pix' 
  | 'withdraw' 
  | 'transfer'
  | 'statement'
  | 'profile';