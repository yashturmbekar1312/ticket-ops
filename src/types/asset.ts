export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  assetNumber: string;
  description?: string;
  category: AssetCategory;
  subcategory: string;
  status: AssetStatus;
  state: AssetState;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location: Location;
  owner: User;
  assignedTo?: User;
  costCenter?: string;
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  depreciation?: DepreciationInfo;
  specifications?: Record<string, any>;
  customFields?: Record<string, any>;
  relationships: AssetRelationship[];
  maintenanceSchedule?: MaintenanceSchedule[];
  changeHistory: AssetChangeRecord[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  icon?: string;
  color?: string;
  subcategories: AssetSubcategory[];
  requiredFields: string[];
  customFields: CustomField[];
}

export interface AssetSubcategory {
  id: string;
  name: string;
  description?: string;
  specifications?: SpecificationTemplate[];
}

export interface Location {
  id: string;
  name: string;
  building?: string;
  floor?: string;
  room?: string;
  address?: Address;
  coordinates?: Coordinates;
  parent?: string;
  children?: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

export interface AssetRelationship {
  id: string;
  type: RelationshipType;
  relatedAssetId: string;
  relatedAssetName: string;
  description?: string;
  createdAt: Date;
}

export interface DepreciationInfo {
  method: 'straight-line' | 'declining-balance' | 'custom';
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  usefulLife: number;
  salvageValue: number;
}

export interface MaintenanceSchedule {
  id: string;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  frequency: MaintenanceFrequency;
  nextDueDate: Date;
  lastCompleted?: Date;
  assignedTo?: User;
  cost?: number;
  notes?: string;
}

export interface MaintenanceFrequency {
  interval: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
}

export interface AssetChangeRecord {
  id: string;
  changeType: 'created' | 'updated' | 'moved' | 'assigned' | 'retired' | 'disposed';
  field?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: Date;
  changedBy: string;
  approvedBy?: string;
}

export interface SpecificationTemplate {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  required: boolean;
  options?: string[];
  unit?: string;
}

export interface CustomField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface AssetDiscoveryRule {
  id: string;
  name: string;
  description: string;
  protocol: 'snmp' | 'wmi' | 'ssh' | 'api' | 'agent';
  targetRange: string;
  schedule: string;
  enabled: boolean;
  mappingRules: FieldMappingRule[];
  filters: DiscoveryFilter[];
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldMappingRule {
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: any;
}

export interface DiscoveryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
  action: 'include' | 'exclude';
}

export interface AssetMetrics {
  totalAssets: number;
  assetsByCategory: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByLocation: Record<string, number>;
  warrantyExpiring: number;
  maintenanceDue: number;
  totalValue: number;
  depreciationRate: number;
  utilizationRate: number;
  complianceScore: number;
}

export interface AssetReport {
  id: string;
  name: string;
  description: string;
  type: 'inventory' | 'financial' | 'compliance' | 'maintenance' | 'utilization';
  parameters: Record<string, any>;
  schedule?: ReportSchedule;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  recipients: string[];
  lastGenerated?: Date;
  nextGeneration?: Date;
  isActive: boolean;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
}

export interface AssetAuditLog {
  id: string;
  assetId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AssetBulkOperation {
  id: string;
  type: 'update' | 'move' | 'retire' | 'dispose' | 'assign';
  assetIds: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  errors?: string[];
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
}

export type AssetStatus = 'active' | 'inactive' | 'maintenance' | 'retired' | 'disposed';
export type AssetState = 'operational' | 'non-operational' | 'repair' | 'spare' | 'missing';
export type RelationshipType =
  | 'depends-on'
  | 'contains'
  | 'connects-to'
  | 'installed-on'
  | 'uses'
  | 'parent-child';
