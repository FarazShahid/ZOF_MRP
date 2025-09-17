import { User, Customer, Event, Carrier } from '../types/admin';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-08-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2024-01-10T11:20:00Z',
    createdAt: '2023-09-10T10:15:00Z'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-01-15T08:15:00Z',
    createdAt: '2023-07-05T13:45:00Z'
  },
  {
    id: '5',
    name: 'Alex Brown',
    email: 'alex.brown@company.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-13T15:30:00Z',
    createdAt: '2023-10-12T11:00:00Z'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contact: 'Robert Johnson',
    email: 'robert@acme.com',
    totalOrders: 45,
    status: 'Active',
    ordersInProgress: 3,
    completedOrders: 42,
    lastOrderDate: '2024-01-14T10:00:00Z',
    lastOrderAmount: 2500.00,
    createdAt: '2023-03-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'TechStart Inc.',
    contact: 'Lisa Chen',
    email: 'lisa@techstart.com',
    totalOrders: 28,
    status: 'Active',
    ordersInProgress: 2,
    completedOrders: 26,
    lastOrderDate: '2024-01-12T14:30:00Z',
    lastOrderAmount: 1800.00,
    createdAt: '2023-05-20T11:30:00Z'
  },
  {
    id: '3',
    name: 'Global Solutions',
    contact: 'David Miller',
    email: 'david@globalsolutions.com',
    totalOrders: 67,
    status: 'Inactive',
    ordersInProgress: 0,
    completedOrders: 67,
    lastOrderDate: '2023-12-20T16:45:00Z',
    lastOrderAmount: 3200.00,
    createdAt: '2023-01-10T08:15:00Z'
  },
  {
    id: '4',
    name: 'Innovation Labs',
    contact: 'Maria Garcia',
    email: 'maria@innovationlabs.com',
    totalOrders: 15,
    status: 'Active',
    ordersInProgress: 1,
    completedOrders: 14,
    lastOrderDate: '2024-01-13T09:20:00Z',
    lastOrderAmount: 950.00,
    createdAt: '2023-08-05T12:00:00Z'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Product Launch Event',
    associatedClient: 'Acme Corporation',
    date: '2024-02-15T10:00:00Z',
    status: 'Scheduled',
    description: 'Launch event for new product line',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '2',
    name: 'Annual Conference',
    associatedClient: 'TechStart Inc.',
    date: '2024-01-20T09:00:00Z',
    status: 'In Progress',
    description: 'Annual technology conference',
    createdAt: '2024-01-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'Training Workshop',
    associatedClient: 'Global Solutions',
    date: '2024-01-10T13:00:00Z',
    status: 'Completed',
    description: 'Staff training workshop',
    createdAt: '2023-12-20T11:15:00Z'
  },
  {
    id: '4',
    name: 'Strategy Meeting',
    associatedClient: 'Innovation Labs',
    date: '2024-01-25T14:00:00Z',
    status: 'Scheduled',
    description: 'Quarterly strategy planning meeting',
    createdAt: '2024-01-12T16:45:00Z'
  }
];

export const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'FedEx Express',
    contact: 'James Wilson',
    email: 'james@fedex.com',
    status: 'Active',
    serviceType: 'Express Delivery',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'UPS Ground',
    contact: 'Susan Taylor',
    email: 'susan@ups.com',
    status: 'Active',
    serviceType: 'Ground Shipping',
    createdAt: '2023-02-20T11:30:00Z'
  },
  {
    id: '3',
    name: 'DHL International',
    contact: 'Michael Brown',
    email: 'michael@dhl.com',
    status: 'Inactive',
    serviceType: 'International Shipping',
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'USPS Priority',
    contact: 'Jennifer Davis',
    email: 'jennifer@usps.com',
    status: 'Active',
    serviceType: 'Priority Mail',
    createdAt: '2023-04-05T14:20:00Z'
  }
];