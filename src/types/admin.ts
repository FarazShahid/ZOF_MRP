import { GetClientsType } from "@/store/useClientStore";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  status: 'Active' | 'Inactive';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  totalOrders: number;
  status: 'Active' | 'Inactive';
  ordersInProgress: number;
  completedOrders: number;
  lastOrderDate?: string;
  lastOrderAmount?: number;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  associatedClient: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  description?: string;
  createdAt: string;
}

export interface Carrier {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: 'Active' | 'Inactive';
  serviceType: string;
  createdAt: string;
}

export type ViewMode = 'table' | 'grid';
export type ActiveModule = 'users' | 'customers' | 'events' | 'carriers' | 'roles';


export type ShipmentStatus = 'In Transit' | 'Damaged' | 'Delivered' | 'Cancelled';

export type OrderStatus = 'Production' | 'Shipped' | 'Packing' | 'Kept in stock';


export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

export const MAX_CLIENT_CHIPS = 4;