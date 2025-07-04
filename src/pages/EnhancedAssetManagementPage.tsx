import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Smartphone as PhoneIcon,
  Storage as ServerIcon,
  Router as NetworkIcon,
  Print as PrinterIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  QrCode as QRCodeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Assessment as ReportIcon,
  Build as MaintenanceIcon,
  DeviceHub as DeviceIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';

interface Asset {
  id: string;
  name: string;
  type: 'laptop' | 'desktop' | 'server' | 'network' | 'printer' | 'mobile' | 'tablet' | 'other';
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired' | 'lost' | 'stolen';
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  location: string;
  assignedTo?: string;
  assignedDate?: string;
  department: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  warranty: {
    startDate: string;
    endDate: string;
    type: string;
    provider: string;
  };
  specifications: { [key: string]: string };
  maintenanceSchedule: MaintenanceRecord[];
  licenseInfo?: LicenseInfo[];
  lastAuditDate: string;
  nextAuditDate: string;
  depreciationRate: number;
  currentValue: number;
  insuranceInfo?: InsuranceInfo;
  complianceStatus: 'compliant' | 'non-compliant' | 'pending';
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  networkInfo?: NetworkInfo;
  installationDate: string;
  lastUpdateDate: string;
  tags: string[];
  notes: string;
  attachments: string[];
  qrCode: string;
  parentAsset?: string;
  childAssets?: string[];
  relatedTickets: string[];
  changeHistory: ChangeRecord[];
}

interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'corrective' | 'upgrade' | 'inspection';
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  description: string;
  cost: number;
  parts: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  nextDueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  vendor?: string;
  workOrder?: string;
  notes?: string;
}

interface LicenseInfo {
  id: string;
  software: string;
  licenseKey: string;
  licenseType: 'perpetual' | 'subscription' | 'volume' | 'oem';
  expiryDate?: string;
  seats: number;
  usedSeats: number;
  vendor: string;
  cost: number;
  supportLevel: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'expiring_soon';
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  coverageType: string;
  coverageAmount: number;
  deductible: number;
  expiryDate: string;
  premiumAmount: number;
}

interface NetworkInfo {
  ipAddress: string;
  macAddress: string;
  hostname: string;
  domain: string;
  subnet: string;
  vlan: string;
  dhcp: boolean;
  lastSeen: string;
  networkSecurity: string[];
}

interface ChangeRecord {
  id: string;
  date: string;
  user: string;
  type: 'create' | 'update' | 'assign' | 'unassign' | 'relocate' | 'status_change';
  description: string;
  oldValue?: string;
  newValue?: string;
  approvedBy?: string;
  reason?: string;
}

const EnhancedAssetManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<
    'create' | 'edit' | 'view' | 'maintenance' | 'audit' | 'bulk'
  >('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [auditMode, setAuditMode] = useState(false);

  // Mock data
  const [assets] = useState<Asset[]>([
    {
      id: 'AST-001',
      name: 'MacBook Pro 13" M1',
      type: 'laptop',
      category: 'Computing',
      brand: 'Apple',
      model: 'MacBook Pro 13-inch M1',
      serialNumber: 'C02X7J3JQ6L9',
      assetTag: 'MBA-001',
      status: 'active',
      condition: 'good',
      location: 'New York Office - Floor 3',
      assignedTo: 'John Doe',
      assignedDate: '2024-01-15',
      department: 'Engineering',
      purchaseDate: '2024-01-10',
      purchasePrice: 1299.0,
      vendor: 'Apple Inc.',
      warranty: {
        startDate: '2024-01-10',
        endDate: '2025-01-10',
        type: 'Limited Warranty',
        provider: 'Apple Inc.',
      },
      specifications: {
        Processor: 'Apple M1 Chip',
        Memory: '8GB Unified Memory',
        Storage: '256GB SSD',
        Display: '13.3-inch Retina Display',
        'Operating System': 'macOS Monterey',
      },
      maintenanceSchedule: [
        {
          id: 'MT-001',
          type: 'preventive',
          scheduledDate: '2024-04-15',
          technician: 'IT Support',
          description: 'System cleanup and software updates',
          cost: 0,
          parts: [],
          status: 'scheduled',
          nextDueDate: '2024-07-15',
          priority: 'low',
        },
      ],
      licenseInfo: [
        {
          id: 'LIC-001',
          software: 'Microsoft Office 365',
          licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
          licenseType: 'subscription',
          expiryDate: '2024-12-31',
          seats: 1,
          usedSeats: 1,
          vendor: 'Microsoft',
          cost: 99.0,
          supportLevel: 'Standard',
          complianceStatus: 'compliant',
        },
      ],
      lastAuditDate: '2024-02-15',
      nextAuditDate: '2024-05-15',
      depreciationRate: 20,
      currentValue: 1039.2,
      complianceStatus: 'compliant',
      securityLevel: 'medium',
      networkInfo: {
        ipAddress: '192.168.1.100',
        macAddress: '00:11:22:33:44:55',
        hostname: 'MBA-001',
        domain: 'company.local',
        subnet: '192.168.1.0/24',
        vlan: 'VLAN-100',
        dhcp: true,
        lastSeen: '2024-03-18T14:30:00Z',
        networkSecurity: ['WPA3', 'VPN'],
      },
      installationDate: '2024-01-15',
      lastUpdateDate: '2024-03-18',
      tags: ['laptop', 'engineering', 'apple'],
      notes: 'High-performance laptop for software development',
      attachments: ['invoice_001.pdf', 'warranty_card.pdf'],
      qrCode: 'QR-AST-001',
      relatedTickets: ['TK-001', 'TK-045'],
      changeHistory: [
        {
          id: 'CH-001',
          date: '2024-01-15',
          user: 'IT Admin',
          type: 'assign',
          description: 'Assigned to John Doe',
          newValue: 'John Doe',
          approvedBy: 'IT Manager',
          reason: 'New employee onboarding',
        },
      ],
    },
    {
      id: 'AST-002',
      name: 'Dell OptiPlex 7090',
      type: 'desktop',
      category: 'Computing',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      serialNumber: 'BXBZ3T3',
      assetTag: 'DT-002',
      status: 'active',
      condition: 'good',
      location: 'Chicago Office - Floor 2',
      assignedTo: 'Jane Smith',
      assignedDate: '2024-02-01',
      department: 'Finance',
      purchaseDate: '2024-01-20',
      purchasePrice: 899.0,
      vendor: 'Dell Technologies',
      warranty: {
        startDate: '2024-01-20',
        endDate: '2027-01-20',
        type: 'Business Warranty',
        provider: 'Dell Technologies',
      },
      specifications: {
        Processor: 'Intel Core i5-11500',
        Memory: '16GB DDR4',
        Storage: '512GB NVMe SSD',
        Graphics: 'Intel UHD Graphics 750',
        'Operating System': 'Windows 11 Pro',
      },
      maintenanceSchedule: [
        {
          id: 'MT-002',
          type: 'preventive',
          scheduledDate: '2024-03-25',
          technician: 'IT Support',
          description: 'Hardware diagnostics and cleaning',
          cost: 0,
          parts: [],
          status: 'scheduled',
          nextDueDate: '2024-06-25',
          priority: 'low',
        },
      ],
      lastAuditDate: '2024-02-01',
      nextAuditDate: '2024-05-01',
      depreciationRate: 25,
      currentValue: 674.25,
      complianceStatus: 'compliant',
      securityLevel: 'high',
      networkInfo: {
        ipAddress: '192.168.1.150',
        macAddress: '00:AA:BB:CC:DD:EE',
        hostname: 'DT-002',
        domain: 'company.local',
        subnet: '192.168.1.0/24',
        vlan: 'VLAN-200',
        dhcp: true,
        lastSeen: '2024-03-18T15:45:00Z',
        networkSecurity: ['WPA3', 'VPN', 'BitLocker'],
      },
      installationDate: '2024-02-01',
      lastUpdateDate: '2024-03-15',
      tags: ['desktop', 'finance', 'dell'],
      notes: 'Standard desktop for office work',
      attachments: ['purchase_order_002.pdf'],
      qrCode: 'QR-AST-002',
      relatedTickets: ['TK-012'],
      changeHistory: [
        {
          id: 'CH-002',
          date: '2024-02-01',
          user: 'IT Admin',
          type: 'assign',
          description: 'Assigned to Jane Smith',
          newValue: 'Jane Smith',
          approvedBy: 'IT Manager',
          reason: 'Department relocation',
        },
      ],
    },
    {
      id: 'AST-003',
      name: 'HP LaserJet Pro 4025n',
      type: 'printer',
      category: 'Peripherals',
      brand: 'HP',
      model: 'LaserJet Pro 4025n',
      serialNumber: 'CNBGJ1234K',
      assetTag: 'PR-003',
      status: 'active',
      condition: 'good',
      location: 'New York Office - Floor 2',
      department: 'Shared',
      purchaseDate: '2024-01-25',
      purchasePrice: 699.0,
      vendor: 'HP Inc.',
      warranty: {
        startDate: '2024-01-25',
        endDate: '2025-01-25',
        type: 'Standard Warranty',
        provider: 'HP Inc.',
      },
      specifications: {
        'Print Speed': '33 ppm',
        'Print Resolution': '1200 x 1200 dpi',
        'Paper Capacity': '520 sheets',
        Connectivity: 'Ethernet, USB',
        Duplex: 'Automatic',
      },
      maintenanceSchedule: [
        {
          id: 'MT-003',
          type: 'preventive',
          scheduledDate: '2024-04-01',
          technician: 'Printer Maintenance',
          description: 'Toner replacement and cleaning',
          cost: 125.0,
          parts: ['Toner Cartridge', 'Maintenance Kit'],
          status: 'scheduled',
          nextDueDate: '2024-07-01',
          priority: 'medium',
        },
      ],
      lastAuditDate: '2024-01-25',
      nextAuditDate: '2024-04-25',
      depreciationRate: 15,
      currentValue: 594.15,
      complianceStatus: 'compliant',
      securityLevel: 'low',
      networkInfo: {
        ipAddress: '192.168.1.200',
        macAddress: '00:12:34:56:78:9A',
        hostname: 'PR-003',
        domain: 'company.local',
        subnet: '192.168.1.0/24',
        vlan: 'VLAN-300',
        dhcp: true,
        lastSeen: '2024-03-18T16:00:00Z',
        networkSecurity: ['WPA3'],
      },
      installationDate: '2024-01-25',
      lastUpdateDate: '2024-03-10',
      tags: ['printer', 'shared', 'hp'],
      notes: 'Shared printer for second floor',
      attachments: ['printer_manual.pdf'],
      qrCode: 'QR-AST-003',
      relatedTickets: ['TK-008', 'TK-023'],
      changeHistory: [
        {
          id: 'CH-003',
          date: '2024-01-25',
          user: 'IT Admin',
          type: 'create',
          description: 'Asset created and deployed',
          reason: 'New printer installation',
        },
      ],
    },
  ]);

  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 'MT-001',
      type: 'preventive',
      scheduledDate: '2024-04-15',
      technician: 'IT Support',
      description: 'System cleanup and software updates',
      cost: 0,
      parts: [],
      status: 'scheduled',
      nextDueDate: '2024-07-15',
      priority: 'low',
    },
    {
      id: 'MT-004',
      type: 'corrective',
      scheduledDate: '2024-03-20',
      completedDate: '2024-03-20',
      technician: 'Hardware Specialist',
      description: 'Replaced faulty RAM module',
      cost: 85.0,
      parts: ['16GB DDR4 RAM'],
      status: 'completed',
      priority: 'high',
      workOrder: 'WO-001',
      notes: 'RAM module was causing random crashes',
    },
  ]);

  const locations = [
    'all',
    'New York Office - Floor 3',
    'Chicago Office - Floor 2',
    'New York Office - Floor 2',
  ];
  const assetTypes = [
    'all',
    'laptop',
    'desktop',
    'server',
    'network',
    'printer',
    'mobile',
    'tablet',
  ];
  const assetStatuses = ['all', 'active', 'inactive', 'maintenance', 'retired', 'lost', 'stolen'];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || asset.location === locationFilter;
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogType('view');
    setOpenDialog(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'maintenance':
        return 'warning';
      case 'retired':
        return 'default';
      case 'lost':
        return 'error';
      case 'stolen':
        return 'error';
      default:
        return 'default';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'success';
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      case 'damaged':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <ComputerIcon />;
      case 'desktop':
        return <ComputerIcon />;
      case 'server':
        return <ServerIcon />;
      case 'network':
        return <NetworkIcon />;
      case 'printer':
        return <PrinterIcon />;
      case 'mobile':
        return <PhoneIcon />;
      case 'tablet':
        return <PhoneIcon />;
      default:
        return <DeviceIcon />;
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderAssetsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            {assetStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
            {assetTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            label="Location"
          >
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('create');
            setOpenDialog(true);
          }}
        >
          Add Asset
        </Button>
        <Button variant="outlined" startIcon={<UploadIcon />}>
          Import
        </Button>
        <Button variant="outlined" startIcon={<ExportIcon />}>
          Export
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={auditMode}
              onChange={(e) => setAuditMode(e.target.checked)}
              color="primary"
            />
          }
          label="Audit Mode"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getAssetIcon(asset.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.assetTag} • {asset.serialNumber}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={asset.type} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={asset.status}
                    color={getStatusColor(asset.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={asset.condition}
                    color={getConditionColor(asset.condition) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {asset.assignedTo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {asset.assignedTo.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{asset.assignedTo}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{asset.location}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      ${asset.currentValue.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Original: ${asset.purchasePrice.toFixed(2)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(asset.warranty.endDate) > new Date() ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Expired" color="error" size="small" />
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Until: {asset.warranty.endDate}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleAssetSelect(asset)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMaintenanceTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Maintenance Schedule</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('maintenance');
            setOpenDialog(true);
          }}
        >
          Schedule Maintenance
        </Button>
        <Button variant="outlined" startIcon={<FilterIcon />}>
          Filter
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {assets.find((a) => a.maintenanceSchedule.some((m) => m.id === record.id))
                          ?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.type}
                        color={record.type === 'preventive' ? 'info' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{record.scheduledDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{record.technician}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={
                          record.status === 'completed'
                            ? 'success'
                            : record.status === 'in_progress'
                              ? 'warning'
                              : record.status === 'cancelled'
                                ? 'error'
                                : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.priority}
                        color={
                          record.priority === 'critical'
                            ? 'error'
                            : record.priority === 'high'
                              ? 'warning'
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">${record.cost.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Maintenance Summary
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Scheduled"
                    secondary={maintenanceRecords.filter((r) => r.status === 'scheduled').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="In Progress"
                    secondary={maintenanceRecords.filter((r) => r.status === 'in_progress').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Completed This Month"
                    secondary={maintenanceRecords.filter((r) => r.status === 'completed').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Cost This Month"
                    secondary={`$${maintenanceRecords.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderLicensesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Software Licenses</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add License
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />}>
          Sync Licenses
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Software</TableCell>
              <TableCell>License Type</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Compliance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets
              .flatMap((asset) => asset.licenseInfo || [])
              .map((license) => (
                <TableRow key={license.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {license.software}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={license.licenseType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.seats}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {license.usedSeats}/{license.seats}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(license.usedSeats / license.seats) * 100}
                        sx={{ width: 60 }}
                        color={license.usedSeats > license.seats ? 'error' : 'primary'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.expiryDate || 'Perpetual'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{license.vendor}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">${license.cost.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={license.complianceStatus}
                      color={
                        license.complianceStatus === 'compliant'
                          ? 'success'
                          : license.complianceStatus === 'expiring_soon'
                            ? 'warning'
                            : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Asset Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {assets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {assets.filter((a) => a.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {assets.filter((a) => a.status === 'maintenance').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                ${assets.reduce((sum, a) => sum + a.currentValue, 0).toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Asset Distribution by Type
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Chart showing asset distribution by type
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Asset Value Depreciation
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Chart showing asset value depreciation over time
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Warranty Expiration Timeline
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Warranty Provider</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Days Remaining</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((asset) => {
                      const daysRemaining = Math.ceil(
                        (new Date(asset.warranty.endDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      return (
                        <TableRow key={asset.id}>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.warranty.provider}</TableCell>
                          <TableCell>{asset.warranty.endDate}</TableCell>
                          <TableCell>{daysRemaining > 0 ? daysRemaining : 'Expired'}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                daysRemaining > 90
                                  ? 'Active'
                                  : daysRemaining > 30
                                    ? 'Expiring Soon'
                                    : daysRemaining > 0
                                      ? 'Critical'
                                      : 'Expired'
                              }
                              color={
                                daysRemaining > 90
                                  ? 'success'
                                  : daysRemaining > 30
                                    ? 'warning'
                                    : daysRemaining > 0
                                      ? 'error'
                                      : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <InventoryIcon sx={{ mr: 2 }} />
        Enhanced Asset Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Assets" icon={<InventoryIcon />} />
          <Tab label="Maintenance" icon={<MaintenanceIcon />} />
          <Tab label="Licenses" icon={<SecurityIcon />} />
          <Tab label="Analytics" icon={<ReportIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderAssetsTab()}
          {activeTab === 1 && renderMaintenanceTab()}
          {activeTab === 2 && renderLicensesTab()}
          {activeTab === 3 && renderAnalyticsTab()}
        </Box>
      </Paper>

      {/* Asset Details Dialog */}
      <Dialog
        open={openDialog && dialogType === 'view'}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Asset Details: {selectedAsset?.name}</DialogTitle>
        <DialogContent>
          {selectedAsset && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">General Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Asset Tag
                          </Typography>
                          <Typography variant="body1">{selectedAsset.assetTag}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Serial Number
                          </Typography>
                          <Typography variant="body1">{selectedAsset.serialNumber}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Brand & Model
                          </Typography>
                          <Typography variant="body1">
                            {selectedAsset.brand} {selectedAsset.model}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Category
                          </Typography>
                          <Typography variant="body1">{selectedAsset.category}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Technical Specifications</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {Object.entries(selectedAsset.specifications).map(([key, value]) => (
                          <ListItem key={key}>
                            <ListItemText primary={key} secondary={value} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Network Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {selectedAsset.networkInfo && (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              IP Address
                            </Typography>
                            <Typography variant="body1">
                              {selectedAsset.networkInfo.ipAddress}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              MAC Address
                            </Typography>
                            <Typography variant="body1">
                              {selectedAsset.networkInfo.macAddress}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Hostname
                            </Typography>
                            <Typography variant="body1">
                              {selectedAsset.networkInfo.hostname}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Last Seen
                            </Typography>
                            <Typography variant="body1">
                              {new Date(selectedAsset.networkInfo.lastSeen).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Change History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {selectedAsset.changeHistory.map((change) => (
                          <ListItem key={change.id}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <HistoryIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={change.description}
                              secondary={`${change.date} by ${change.user}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Asset Status
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Status"
                            secondary={
                              <Chip
                                label={selectedAsset.status}
                                color={getStatusColor(selectedAsset.status) as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Condition"
                            secondary={
                              <Chip
                                label={selectedAsset.condition}
                                color={getConditionColor(selectedAsset.condition) as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Assigned To"
                            secondary={selectedAsset.assignedTo || 'Unassigned'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Location" secondary={selectedAsset.location} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Security Level"
                            secondary={
                              <Chip
                                label={selectedAsset.securityLevel}
                                color={getSecurityLevelColor(selectedAsset.securityLevel) as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Current Value"
                            secondary={`$${selectedAsset.currentValue.toFixed(2)}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Warranty"
                            secondary={
                              new Date(selectedAsset.warranty.endDate) > new Date()
                                ? `Valid until ${selectedAsset.warranty.endDate}`
                                : 'Expired'
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => handleEditAsset(selectedAsset!)}>
            Edit Asset
          </Button>
        </DialogActions>
      </Dialog>

      {/* More Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuList>
          <MenuItemComponent>
            <ListItemIcon>
              <QRCodeIcon />
            </ListItemIcon>
            <ListItemText>Generate QR Code</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText>Assign Asset</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <MaintenanceIcon />
            </ListItemIcon>
            <ListItemText>Schedule Maintenance</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText>View History</ListItemText>
          </MenuItemComponent>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default EnhancedAssetManagementPage;
