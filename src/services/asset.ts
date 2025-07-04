import {
  Asset,
  AssetCategory,
  AssetMetrics,
  AssetDiscoveryRule,
  AssetReport,
  AssetBulkOperation,
  Location,
} from '../types/asset';

class AssetService {
  private assets: Asset[] = [];
  private categories: AssetCategory[] = [];
  private locations: Location[] = [];
  private discoveryRules: AssetDiscoveryRule[] = [];
  private reports: AssetReport[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock categories
    this.categories = [
      {
        id: 'cat-1',
        name: 'Hardware',
        description: 'Physical IT equipment and devices',
        subcategories: [
          {
            id: 'sub-1',
            name: 'Servers',
            specifications: [
              { name: 'CPU', type: 'text', required: true },
              { name: 'RAM', type: 'text', required: true },
              { name: 'Storage', type: 'text', required: true },
            ],
          },
          {
            id: 'sub-2',
            name: 'Workstations',
            specifications: [
              { name: 'CPU', type: 'text', required: true },
              { name: 'RAM', type: 'text', required: true },
            ],
          },
          {
            id: 'sub-3',
            name: 'Network Equipment',
            specifications: [
              { name: 'Ports', type: 'number', required: true },
              { name: 'Speed', type: 'text', required: true },
            ],
          },
        ],
        requiredFields: ['name', 'assetTag', 'location'],
        customFields: [],
      },
      {
        id: 'cat-2',
        name: 'Software',
        description: 'Software applications and licenses',
        subcategories: [
          {
            id: 'sub-4',
            name: 'Operating Systems',
            specifications: [
              { name: 'Version', type: 'text', required: true },
              { name: 'Edition', type: 'text', required: false },
            ],
          },
          {
            id: 'sub-5',
            name: 'Applications',
            specifications: [
              { name: 'Version', type: 'text', required: true },
              {
                name: 'License Type',
                type: 'select',
                required: true,
                options: ['Per User', 'Per Device', 'Site License'],
              },
            ],
          },
        ],
        requiredFields: ['name', 'version', 'licenseCount'],
        customFields: [],
      },
      {
        id: 'cat-3',
        name: 'Mobile Devices',
        description: 'Mobile phones, tablets, and accessories',
        subcategories: [
          {
            id: 'sub-6',
            name: 'Smartphones',
            specifications: [
              { name: 'OS', type: 'select', required: true, options: ['iOS', 'Android'] },
              { name: 'Storage', type: 'text', required: true },
            ],
          },
          {
            id: 'sub-7',
            name: 'Tablets',
            specifications: [
              { name: 'Screen Size', type: 'text', required: true },
              {
                name: 'OS',
                type: 'select',
                required: true,
                options: ['iOS', 'Android', 'Windows'],
              },
            ],
          },
        ],
        requiredFields: ['name', 'assetTag', 'assignedTo'],
        customFields: [],
      },
    ];

    // Initialize mock locations
    this.locations = [
      {
        id: 'loc-1',
        name: 'Headquarters',
        building: 'Main Building',
        address: {
          street: '123 Business Ave',
          city: 'Tech City',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        children: ['loc-2', 'loc-3'],
      },
      {
        id: 'loc-2',
        name: 'Data Center',
        building: 'Main Building',
        floor: 'B1',
        room: 'DC-01',
        parent: 'loc-1',
      },
      {
        id: 'loc-3',
        name: 'Office Floor 1',
        building: 'Main Building',
        floor: '1',
        parent: 'loc-1',
      },
    ];

    // Initialize mock assets
    this.assets = [
      {
        id: 'asset-1',
        name: 'Production Server 01',
        assetTag: 'SRV-001',
        assetNumber: 'AST-2024-001',
        description: 'Primary web server for production environment',
        category: this.categories[0],
        subcategory: 'Servers',
        status: 'active',
        state: 'operational',
        manufacturer: 'Dell',
        model: 'PowerEdge R750',
        serialNumber: 'DL12345678',
        location: this.locations[1],
        owner: { id: 'user-1', name: 'IT Department', email: 'it@company.com' },
        assignedTo: { id: 'user-2', name: 'System Admin', email: 'sysadmin@company.com' },
        costCenter: 'IT-001',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiration: new Date('2026-01-15'),
        specifications: {
          cpu: 'Intel Xeon Silver 4314',
          ram: '64GB DDR4',
          storage: '2TB NVMe SSD',
          network: 'Dual 10GbE',
        },
        relationships: [
          {
            id: 'rel-1',
            type: 'depends-on',
            relatedAssetId: 'asset-2',
            relatedAssetName: 'Network Switch 01',
            createdAt: new Date(),
          },
        ],
        maintenanceSchedule: [
          {
            id: 'maint-1',
            type: 'preventive',
            description: 'Monthly system health check',
            frequency: { interval: 1, unit: 'months' },
            nextDueDate: new Date('2024-02-15'),
            cost: 200,
          },
        ],
        changeHistory: [
          {
            id: 'change-1',
            changeType: 'created',
            timestamp: new Date('2023-01-15'),
            changedBy: 'user-1',
            reason: 'Initial asset registration',
          },
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      },
      {
        id: 'asset-2',
        name: 'Network Switch 01',
        assetTag: 'NET-001',
        assetNumber: 'AST-2024-002',
        description: 'Core network switch for data center',
        category: this.categories[0],
        subcategory: 'Network Equipment',
        status: 'active',
        state: 'operational',
        manufacturer: 'Cisco',
        model: 'Catalyst 9300',
        serialNumber: 'CS87654321',
        location: this.locations[1],
        owner: { id: 'user-1', name: 'IT Department', email: 'it@company.com' },
        assignedTo: { id: 'user-3', name: 'Network Admin', email: 'netadmin@company.com' },
        costCenter: 'IT-001',
        purchaseDate: new Date('2023-02-01'),
        warrantyExpiration: new Date('2026-02-01'),
        specifications: {
          ports: 48,
          speed: '1GbE',
          uplinks: '4x10GbE',
          poe: 'PoE+',
        },
        relationships: [],
        maintenanceSchedule: [
          {
            id: 'maint-2',
            type: 'preventive',
            description: 'Quarterly firmware update check',
            frequency: { interval: 3, unit: 'months' },
            nextDueDate: new Date('2024-03-01'),
            cost: 150,
          },
        ],
        changeHistory: [
          {
            id: 'change-2',
            changeType: 'created',
            timestamp: new Date('2023-02-01'),
            changedBy: 'user-1',
            reason: 'Initial asset registration',
          },
        ],
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      },
    ];

    // Initialize mock discovery rules
    this.discoveryRules = [
      {
        id: 'rule-1',
        name: 'Network Device Discovery',
        description: 'Discover network devices via SNMP',
        protocol: 'snmp',
        targetRange: '192.168.1.0/24',
        schedule: '0 2 * * *', // Daily at 2 AM
        enabled: true,
        mappingRules: [
          { sourceField: 'sysName', targetField: 'name' },
          { sourceField: 'sysDescr', targetField: 'description' },
          { sourceField: 'sysObjectID', targetField: 'model' },
        ],
        filters: [{ field: 'sysDescr', operator: 'contains', value: 'Cisco', action: 'include' }],
        lastRun: new Date('2024-01-01T02:00:00'),
        nextRun: new Date('2024-01-02T02:00:00'),
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    // Initialize mock reports
    this.reports = [
      {
        id: 'report-1',
        name: 'Asset Inventory Report',
        description: 'Complete asset inventory with details',
        type: 'inventory',
        parameters: { includeInactive: false },
        schedule: { frequency: 'monthly', dayOfMonth: 1, time: '09:00' },
        format: 'excel',
        recipients: ['it@company.com', 'manager@company.com'],
        lastGenerated: new Date('2024-01-01'),
        nextGeneration: new Date('2024-02-01'),
        isActive: true,
      },
      {
        id: 'report-2',
        name: 'Warranty Expiration Report',
        description: 'Assets with warranties expiring in next 90 days',
        type: 'maintenance',
        parameters: { daysAhead: 90 },
        schedule: { frequency: 'weekly', dayOfWeek: 1, time: '08:00' },
        format: 'pdf',
        recipients: ['procurement@company.com'],
        lastGenerated: new Date('2024-01-01'),
        nextGeneration: new Date('2024-01-08'),
        isActive: true,
      },
    ];
  }

  // Asset CRUD Operations
  getAllAssets(): Asset[] {
    return this.assets;
  }

  getAssetById(id: string): Asset | null {
    return this.assets.find((asset) => asset.id === id) || null;
  }

  createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset {
    const newAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assets.push(newAsset);
    return newAsset;
  }

  updateAsset(id: string, updates: Partial<Asset>): Asset | null {
    const index = this.assets.findIndex((asset) => asset.id === id);
    if (index === -1) return null;

    const updatedAsset = {
      ...this.assets[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.assets[index] = updatedAsset;
    return updatedAsset;
  }

  deleteAsset(id: string): boolean {
    const index = this.assets.findIndex((asset) => asset.id === id);
    if (index === -1) return false;

    this.assets.splice(index, 1);
    return true;
  }

  // Search and Filter
  searchAssets(query: string): Asset[] {
    const lowercaseQuery = query.toLowerCase();
    return this.assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(lowercaseQuery) ||
        asset.assetTag.toLowerCase().includes(lowercaseQuery) ||
        asset.assetNumber.toLowerCase().includes(lowercaseQuery) ||
        asset.description?.toLowerCase().includes(lowercaseQuery) ||
        asset.serialNumber?.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterAssets(filters: {
    category?: string;
    status?: string;
    location?: string;
    assignedTo?: string;
    warrantyExpiring?: boolean;
    maintenanceDue?: boolean;
  }): Asset[] {
    return this.assets.filter((asset) => {
      if (filters.category && asset.category.id !== filters.category) return false;
      if (filters.status && asset.status !== filters.status) return false;
      if (filters.location && asset.location.id !== filters.location) return false;
      if (filters.assignedTo && asset.assignedTo?.id !== filters.assignedTo) return false;
      if (filters.warrantyExpiring && asset.warrantyExpiration) {
        const daysUntilExpiry = Math.ceil(
          (asset.warrantyExpiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiry > 90) return false;
      }
      if (filters.maintenanceDue && asset.maintenanceSchedule) {
        const hasDueMaintenance = asset.maintenanceSchedule.some(
          (schedule) => schedule.nextDueDate <= new Date()
        );
        if (!hasDueMaintenance) return false;
      }
      return true;
    });
  }

  // Asset Relationships
  getAssetRelationships(assetId: string): Asset[] {
    const asset = this.getAssetById(assetId);
    if (!asset) return [];

    return asset.relationships
      .map((rel) => this.getAssetById(rel.relatedAssetId))
      .filter(Boolean) as Asset[];
  }

  addAssetRelationship(assetId: string, relationshipType: string, relatedAssetId: string): boolean {
    const asset = this.getAssetById(assetId);
    const relatedAsset = this.getAssetById(relatedAssetId);

    if (!asset || !relatedAsset) return false;

    const relationship = {
      id: `rel-${Date.now()}`,
      type: relationshipType as any,
      relatedAssetId,
      relatedAssetName: relatedAsset.name,
      createdAt: new Date(),
    };

    asset.relationships.push(relationship);
    return true;
  }

  // Categories and Locations
  getAllCategories(): AssetCategory[] {
    return this.categories;
  }

  getAllLocations(): Location[] {
    return this.locations;
  }

  createLocation(location: Omit<Location, 'id'>): Location {
    const newLocation: Location = {
      ...location,
      id: `loc-${Date.now()}`,
    };
    this.locations.push(newLocation);
    return newLocation;
  }

  // Asset Metrics
  getAssetMetrics(): AssetMetrics {
    const totalAssets = this.assets.length;
    const assetsByCategory = this.assets.reduce(
      (acc, asset) => {
        acc[asset.category.name] = (acc[asset.category.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const assetsByStatus = this.assets.reduce(
      (acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const assetsByLocation = this.assets.reduce(
      (acc, asset) => {
        acc[asset.location.name] = (acc[asset.location.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const warrantyExpiring = this.assets.filter((asset) => {
      if (!asset.warrantyExpiration) return false;
      const daysUntilExpiry = Math.ceil(
        (asset.warrantyExpiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    }).length;

    const maintenanceDue = this.assets.filter((asset) =>
      asset.maintenanceSchedule?.some((schedule) => schedule.nextDueDate <= new Date())
    ).length;

    return {
      totalAssets,
      assetsByCategory,
      assetsByStatus,
      assetsByLocation,
      warrantyExpiring,
      maintenanceDue,
      totalValue: 0, // Would be calculated from asset values
      depreciationRate: 0, // Would be calculated from depreciation info
      utilizationRate: 85, // Mock value
      complianceScore: 92, // Mock value
    };
  }

  // Bulk Operations
  createBulkOperation(
    type: 'update' | 'move' | 'retire' | 'dispose' | 'assign',
    assetIds: string[],
    parameters: Record<string, any>
  ): AssetBulkOperation {
    const operation: AssetBulkOperation = {
      id: `bulk-${Date.now()}`,
      type,
      assetIds,
      parameters,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      createdBy: 'current-user',
    };

    // Simulate async operation
    setTimeout(() => {
      this.processBulkOperation(operation);
    }, 1000);

    return operation;
  }

  private processBulkOperation(operation: AssetBulkOperation): void {
    // Simulate processing
    operation.status = 'in-progress';

    operation.assetIds.forEach((assetId, index) => {
      setTimeout(() => {
        // Process individual asset
        const asset = this.getAssetById(assetId);
        if (asset) {
          switch (operation.type) {
            case 'update':
              this.updateAsset(assetId, operation.parameters);
              break;
            case 'move':
              this.updateAsset(assetId, { location: operation.parameters.location });
              break;
            case 'retire':
              this.updateAsset(assetId, { status: 'retired' });
              break;
            case 'assign':
              this.updateAsset(assetId, { assignedTo: operation.parameters.assignedTo });
              break;
          }
        }

        operation.progress = Math.round(((index + 1) / operation.assetIds.length) * 100);

        if (index === operation.assetIds.length - 1) {
          operation.status = 'completed';
          operation.completedAt = new Date();
        }
      }, index * 500);
    });
  }

  // Discovery
  getAllDiscoveryRules(): AssetDiscoveryRule[] {
    return this.discoveryRules;
  }

  runDiscovery(ruleId: string): Promise<Asset[]> {
    const rule = this.discoveryRules.find((r) => r.id === ruleId);
    if (!rule) {
      return Promise.reject(new Error('Discovery rule not found'));
    }

    return new Promise((resolve) => {
      // Simulate discovery process
      setTimeout(() => {
        const discoveredAssets: Asset[] = [
          // Mock discovered assets would go here
        ];
        resolve(discoveredAssets);
      }, 2000);
    });
  }

  // Reports
  getAllReports(): AssetReport[] {
    return this.reports;
  }

  generateReport(reportId: string): Promise<Blob> {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) {
      return Promise.reject(new Error('Report not found'));
    }

    return new Promise((resolve) => {
      // Simulate report generation
      setTimeout(() => {
        const reportData = JSON.stringify(this.assets, null, 2);
        const blob = new Blob([reportData], { type: 'application/json' });
        resolve(blob);
      }, 1000);
    });
  }
}

export const assetService = new AssetService();
