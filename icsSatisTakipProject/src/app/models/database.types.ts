export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  customer_id: string;
  customer?: Customer;
  proposal_date: string;
  status: 'draft' | 'pending' | 'accepted' | 'rejected';
  total_amount: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalDetail {
  id: string;
  proposal_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}
