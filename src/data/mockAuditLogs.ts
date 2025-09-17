import { AuditLog } from '../types/audit';

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:45Z',
    module: 'Products',
    action: 'Created',
    user: 'John Smith',
    details: 'Created new product: Wireless Headphones Pro',
    entityId: 'PROD-001',
    changes: [
      { field: 'name', before: '', after: 'Wireless Headphones Pro' },
      { field: 'price', before: '', after: '$199.99' },
      { field: 'category', before: '', after: 'Electronics' }
    ],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:15:22Z',
    module: 'Orders',
    action: 'Status Changed',
    user: 'Sarah Johnson',
    details: 'Changed order status from Processing to Shipped',
    entityId: 'ORD-002',
    changes: [
      { field: 'status', before: 'Processing', after: 'Shipped' },
      { field: 'tracking_number', before: '', after: 'TRK123456789' }
    ],
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: '3',
    timestamp: '2024-01-15T08:45:10Z',
    module: 'Inventory',
    action: 'Updated',
    user: 'Mike Davis',
    details: 'Updated inventory levels for SKU-12345',
    entityId: 'INV-003',
    changes: [
      { field: 'quantity', before: '150', after: '125' },
      { field: 'last_updated', before: '2024-01-14T10:00:00Z', after: '2024-01-15T08:45:10Z' }
    ],
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '4',
    timestamp: '2024-01-14T16:20:33Z',
    module: 'Shipments',
    action: 'Created',
    user: 'Emma Wilson',
    details: 'Created new shipment for Order #ORD-001',
    entityId: 'SHIP-004',
    changes: [
      { field: 'carrier', before: '', after: 'FedEx' },
      { field: 'service_type', before: '', after: 'Ground' },
      { field: 'estimated_delivery', before: '', after: '2024-01-18' }
    ],
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: '5',
    timestamp: '2024-01-14T14:30:15Z',
    module: 'Products',
    action: 'Deleted',
    user: 'Alex Brown',
    details: 'Deleted discontinued product: Old Model Phone',
    entityId: 'PROD-005',
    changes: [
      { field: 'status', before: 'Discontinued', after: 'Deleted' },
      { field: 'deleted_at', before: '', after: '2024-01-14T14:30:15Z' }
    ],
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  },
  {
    id: '6',
    timestamp: '2024-01-14T12:15:45Z',
    module: 'Orders',
    action: 'Created',
    user: 'Lisa Chen',
    details: 'New order placed by customer ID: CUST-789',
    entityId: 'ORD-006',
    changes: [
      { field: 'total_amount', before: '', after: '$299.98' },
      { field: 'payment_method', before: '', after: 'Credit Card' },
      { field: 'status', before: '', after: 'Pending' }
    ],
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  }
];