// Advanced analytics and reporting types

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;

  // Dashboard configuration
  layout: DashboardLayout;
  widgets: DashboardWidget[];

  // Access control
  isPublic: boolean;
  ownerId: string;
  ownerName: string;
  sharedWith: string[];
  allowedRoles: string[];

  // Settings
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  timezone: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  responsive: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'progress' | 'list' | 'heatmap' | 'treemap';
  title: string;
  description?: string;

  // Position and size
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Data configuration
  dataSource: string;
  query: AnalyticsQuery;

  // Visualization settings
  visualization: {
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar';
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    showLabels?: boolean;
    animate?: boolean;
    responsive?: boolean;
  };

  // Interaction
  clickable: boolean;
  drillDown?: DrillDownConfig;

  // Caching
  cacheEnabled: boolean;
  cacheDuration: number; // seconds

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsQuery {
  metric: string;
  dimensions: string[];
  filters: AnalyticsFilter[];
  dateRange: {
    start: string;
    end: string;
    type: 'absolute' | 'relative';
    relativePeriod?: string;
  };
  groupBy: string[];
  orderBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct';
}

export interface AnalyticsFilter {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'starts_with'
    | 'ends_with';
  value: any;
  logic: 'and' | 'or';
}

export interface DrillDownConfig {
  enabled: boolean;
  target: 'widget' | 'page' | 'external';
  url?: string;
  filters?: AnalyticsFilter[];
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;

  // Metric configuration
  type: 'simple' | 'calculated' | 'custom';
  formula?: string;
  unit: string;
  format: 'number' | 'percentage' | 'currency' | 'duration' | 'bytes';

  // Data source
  table: string;
  field: string;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct';

  // Calculation
  calculation?: {
    type: 'percentage' | 'ratio' | 'growth' | 'custom';
    numerator?: string;
    denominator?: string;
    customFormula?: string;
  };

  // Benchmarking
  benchmark?: {
    value: number;
    type: 'target' | 'industry' | 'historical';
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReport {
  id: string;
  name: string;
  description: string;

  // Report configuration
  type:
    | 'ticket_volume'
    | 'agent_performance'
    | 'sla_compliance'
    | 'customer_satisfaction'
    | 'resolution_time'
    | 'category_analysis'
    | 'trend_analysis';

  // Data parameters
  dateRange: {
    start: string;
    end: string;
  };
  filters: AnalyticsFilter[];
  groupBy: string[];

  // Report data
  data: {
    summary: ReportSummary;
    details: ReportDetail[];
    charts: ReportChart[];
    tables: ReportTable[];
    recommendations: string[];
  };

  // Scheduling
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    recipients: string[];
  };

  // Export settings
  exportFormats: ('pdf' | 'excel' | 'csv' | 'json')[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
}

export interface ReportSummary {
  totalTickets: number;
  avgResolutionTime: number;
  slaCompliance: number;
  customerSatisfaction: number;
  agentProductivity: number;
  trendDirection: 'up' | 'down' | 'stable';
  keyInsights: string[];
}

export interface ReportDetail {
  category: string;
  value: number;
  change: number;
  changePercent: number;
  benchmark?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ReportChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: ChartData;
  config: ChartConfig;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      mode: 'index' | 'dataset' | 'point';
    };
    title: {
      display: boolean;
      text: string;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

export interface ReportTable {
  id: string;
  title: string;
  columns: TableColumn[];
  data: TableRow[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface TableColumn {
  id: string;
  header: string;
  field: string;
  type: 'text' | 'number' | 'date' | 'percentage' | 'currency' | 'duration';
  sortable: boolean;
  width?: number;
  alignment: 'left' | 'center' | 'right';
}

export interface TableRow {
  id: string;
  data: Record<string, any>;
}

export interface KPITarget {
  id: string;
  name: string;
  description: string;

  // Target configuration
  metric: string;
  target: number;
  threshold: {
    warning: number;
    critical: number;
  };

  // Measurement
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;

  // Status
  status: 'on_track' | 'at_risk' | 'off_track';

  // Timing
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;

  // Ownership
  ownerId: string;
  ownerName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;

  // Context
  userId?: string;
  sessionId: string;
  ticketId?: string;

  // Technical details
  userAgent: string;
  ipAddress: string;
  referrer?: string;

  // Custom properties
  properties: Record<string, any>;

  // Timestamps
  timestamp: string;
  createdAt: string;
}

export interface CustomQuery {
  id: string;
  name: string;
  description: string;

  // Query details
  sql: string;
  parameters: QueryParameter[];

  // Results
  columns: string[];
  resultCount: number;
  executionTime: number;

  // Caching
  cacheEnabled: boolean;
  cacheDuration: number;

  // Security
  ownerId: string;
  isPublic: boolean;
  allowedRoles: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
}

export interface QueryParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
  description?: string;
}
