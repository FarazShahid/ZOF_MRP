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

export type FilterState = {
  dateRange: { start: string; end: string }; // 'YYYY-MM-DD'
  module: string;
  action: string;
  user: string;   // will match against Email
  search: string; // global search
};