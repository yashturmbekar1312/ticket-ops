import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Computer,
  PhoneIphone,
  Print,
  Monitor,
  Laptop,
  Settings,
  Assignment,
  History,
  FilterList,
  Download,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/auth';
import { Asset, AssetFormData } from '../types';

// Mock data for assets
const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Dell Laptop - Marketing',
    type: 'laptop',
    serialNumber: 'DL12345',
    assetTag: 'ASSET-001',
    assignedTo: 'user1',
    assignedToName: 'John Doe',
    department: 'Marketing',
    status: 'active',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    cost: 1200,
    location: 'Building A, Floor 2',
    notes: 'Standard laptop configuration',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'HP Monitor 24"',
    type: 'monitor',
    serialNumber: 'HP98765',
    assetTag: 'ASSET-002',
    assignedTo: 'user2',
    assignedToName: 'Jane Smith',
    department: 'IT',
    status: 'active',
    purchaseDate: '2023-02-20',
    warrantyExpiry: '2026-02-20',
    cost: 300,
    location: 'Building B, Floor 1',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Network Printer',
    type: 'printer',
    serialNumber: 'NP11111',
    assetTag: 'ASSET-003',
    department: 'General',
    status: 'maintenance',
    purchaseDate: '2022-06-10',
    warrantyExpiry: '2025-06-10',
    cost: 800,
    location: 'Building A, Floor 1',
    notes: 'Scheduled maintenance on 2024-02-01',
    createdAt: '2022-06-10T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
];

const assetTypeIcons = {
  laptop: <Laptop />,
  desktop: <Computer />,
  monitor: <Monitor />,
  printer: <Print />,
  phone: <PhoneIphone />,
  tablet: <PhoneIphone />,
  software: <Settings />,
  license: <Assignment />,
  other: <Settings />,
};

const statusColors = {
  active: 'success',
  maintenance: 'warning',
  retired: 'secondary',
  lost: 'error',
  disposed: 'default',
} as const;

const AssetManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(mockAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const canManageAssets = user?.role === 'IT Admin' || user?.role === 'Admin';

  const assetSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    department: Yup.string().required('Department is required'),
    status: Yup.string().required('Status is required'),
  });

  const formik = useFormik<AssetFormData>({
    initialValues: {
      name: '',
      type: 'laptop',
      serialNumber: '',
      assetTag: '',
      assignedTo: '',
      department: '',
      status: 'active',
      purchaseDate: '',
      warrantyExpiry: '',
      cost: 0,
      location: '',
      notes: '',
    },
    validationSchema: assetSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newAsset: Asset = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setAssets([...assets, newAsset]);
        setIsCreateDialogOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error('Error creating asset:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    let filtered = assets;

    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(asset => asset.department === departmentFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchQuery, statusFilter, typeFilter, departmentFilter]);

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    formik.setValues({
      name: asset.name,
      type: asset.type,
      serialNumber: asset.serialNumber || '',
      assetTag: asset.assetTag || '',
      assignedTo: asset.assignedTo || '',
      department: asset.department,
      status: asset.status,
      purchaseDate: asset.purchaseDate || '',
      warrantyExpiry: asset.warrantyExpiry || '',
      cost: asset.cost || 0,
      location: asset.location || '',
      notes: asset.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
  };

  const assetStats = {
    total: assets.length,
    active: assets.filter(a => a.status === 'active').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    retired: assets.filter(a => a.status === 'retired').length,
    totalValue: assets.reduce((sum, asset) => sum + (asset.cost || 0), 0),
  };

  const departments = Array.from(new Set(assets.map(a => a.department)));
  const assetTypes = Array.from(new Set(assets.map(a => a.type)));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Asset Management
        </Typography>
        {canManageAssets && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Asset
          </Button>
        )}
      </Box>

      {/* Asset Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {assetStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {assetStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {assetStats.maintenance}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.primary">
                ${assetStats.totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                  <MenuItem value="disposed">Disposed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {assetTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              {canManageAssets && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {assetTypeIcons[asset.type]}
                      <Box>
                        <Typography variant="subtitle2">{asset.name}</Typography>
                        {asset.assetTag && (
                          <Typography variant="caption" color="text.secondary">
                            {asset.assetTag}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{asset.serialNumber || '-'}</TableCell>
                  <TableCell>{asset.assignedToName || 'Unassigned'}</TableCell>
                  <TableCell>{asset.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={asset.status.charAt(0).toUpperCase() + asset.status.slice(1)} 
                      size="small" 
                      color={statusColors[asset.status] as any}
                    />
                  </TableCell>
                  <TableCell>{asset.location || '-'}</TableCell>
                  {canManageAssets && (
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteAsset(asset.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="History">
                        <IconButton size="small">
                          <History />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAssets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Create Asset Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Asset</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Asset Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                  >
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="desktop">Desktop</MenuItem>
                    <MenuItem value="monitor">Monitor</MenuItem>
                    <MenuItem value="printer">Printer</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                    <MenuItem value="software">Software</MenuItem>
                    <MenuItem value="license">License</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="serialNumber"
                  label="Serial Number"
                  value={formik.values.serialNumber}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="assetTag"
                  label="Asset Tag"
                  value={formik.values.assetTag}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="retired">Retired</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                    <MenuItem value="disposed">Disposed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="purchaseDate"
                  label="Purchase Date"
                  type="date"
                  value={formik.values.purchaseDate}
                  onChange={formik.handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="cost"
                  label="Cost"
                  type="number"
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
            >
              {isLoading ? 'Adding...' : 'Add Asset'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AssetManagementPage;
