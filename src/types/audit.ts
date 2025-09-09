export interface AuditLog {
  id: string;
  timestamp: string;
  module: 'Products' | 'Orders' | 'Inventory' | 'Shipments';
  action: 'Created' | 'Updated' | 'Deleted' | 'Status Changed' | 'Shipped' | 'Received';
  user: string;
  details: string;
  entityId: string;
  changes?: {
    field: string;
    before: string;
    after: string;
  }[];
  ipAddress?: string;
  userAgent?: string;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  module: string;
  action: string;
  user: string;
  search: string;
}