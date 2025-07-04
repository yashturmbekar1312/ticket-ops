import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  Menu,
  MenuItem as MenuItemComponent,
  Checkbox,
  Fab,
  Avatar,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Download,
  Upload,
  LocationOn,
  Business,
  Computer,
  PhoneAndroid,
  Storage,
  Router,
  Warning,
  Schedule,
  TrendingUp,
  Inventory,
  Visibility,
  MoreVert,
  CloudDownload,
  Assignment,
} from '@mui/icons-material';
import { assetService } from '../services/asset';
import { Asset, AssetCategory, AssetMetrics } from '../types/asset';

interface AssetManagementPageProps {}

const AssetManagementPage: React.FC<AssetManagementPageProps> = () => {
  const [tabValue, setTabValue] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [metrics, setMetrics] = useState<AssetMetrics | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [bulkActionMenuAnchor, setBulkActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [discoveryDialogOpen, setDiscoveryDialogOpen] = useState(false);

  useEffect(() => {
    loadAssetData();
  }, []);

  const loadAssetData = () => {
    const allAssets = assetService.getAllAssets();
    setAssets(allAssets);
    setCategories(assetService.getAllCategories());
    setMetrics(assetService.getAssetMetrics());
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setAssets(assetService.getAllAssets());
    } else {
      setAssets(assetService.searchAssets(query));
    }
  };

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAllAssets = () => {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map((a) => a.id));
    }
  };

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setAssetDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDialogOpen(true);
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      assetService.deleteAsset(assetId);
      loadAssetData();
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedAssets.length === 0) {
      alert('Please select assets first');
      return;
    }

    switch (action) {
      case 'retire':
        assetService.createBulkOperation('retire', selectedAssets, {});
        break;
      case 'move':
        // Open location selector dialog
        break;
      case 'assign':
        // Open user selector dialog
        break;
      case 'export':
        // Export selected assets
        break;
    }

    setBulkActionMenuAnchor(null);
    setSelectedAssets([]);
    loadAssetData();
  };

  const getAssetIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hardware':
        return <Computer />;
      case 'software':
        return <Storage />;
      case 'mobile devices':
        return <PhoneAndroid />;
      case 'network equipment':
        return <Router />;
      default:
        return <Business />;
    }
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
        return 'error';
      default:
        return 'default';
    }
  };

  const AssetOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Inventory color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Assets</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {metrics?.totalAssets || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active inventory
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Warranty Expiring</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {metrics?.warrantyExpiring || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next 90 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Maintenance Due</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {metrics?.maintenanceDue || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Utilization</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {metrics?.utilizationRate || 0}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics?.utilizationRate || 0}
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Assets by Category */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assets by Category
              </Typography>
              {metrics?.assetsByCategory &&
                Object.entries(metrics.assetsByCategory).map(([category, count]) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getAssetIcon(category)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {category}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / (metrics?.totalAssets || 1)) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Assets by Location */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assets by Location
              </Typography>
              {metrics?.assetsByLocation &&
                Object.entries(metrics.assetsByLocation).map(([location, count]) => (
                  <Box key={location} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">{location}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / (metrics?.totalAssets || 1)) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Asset Activity
              </Typography>
              <Alert severity="info">Asset activity tracking features coming soon!</Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const AssetInventoryTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Asset Inventory</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setImportDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={() => setDiscoveryDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Discovery
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddAsset}>
            Add Asset
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={selectedAssets.length === 0}
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  disabled={selectedAssets.length === 0}
                  onClick={(e) => setBulkActionMenuAnchor(e.currentTarget)}
                >
                  Bulk Actions
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAssets.length === assets.length && assets.length > 0}
                      indeterminate={
                        selectedAssets.length > 0 && selectedAssets.length < assets.length
                      }
                      onChange={handleSelectAllAssets}
                    />
                  </TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Warranty</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => handleAssetSelect(asset.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getAssetIcon(asset.category.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {asset.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asset.assetTag} • {asset.assetNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={asset.category.name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={asset.status}
                        size="small"
                        color={getStatusColor(asset.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">{asset.location.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {asset.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                            {asset.assignedTo.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{asset.assignedTo.name}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.warrantyExpiration ? (
                        <Box>
                          <Typography variant="body2">
                            {asset.warrantyExpiration.toLocaleDateString()}
                          </Typography>
                          {(() => {
                            const daysUntilExpiry = Math.ceil(
                              (asset.warrantyExpiration!.getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            );
                            return (
                              <Typography
                                variant="caption"
                                color={daysUntilExpiry < 90 ? 'warning.main' : 'text.secondary'}
                              >
                                {daysUntilExpiry < 0 ? 'Expired' : `${daysUntilExpiry} days left`}
                              </Typography>
                            );
                          })()}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No warranty
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
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
                        <Tooltip title="More">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddAsset}
      >
        <Add />
      </Fab>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionMenuAnchor}
        open={Boolean(bulkActionMenuAnchor)}
        onClose={() => setBulkActionMenuAnchor(null)}
      >
        <MenuItemComponent onClick={() => handleBulkAction('assign')}>
          <Assignment sx={{ mr: 1 }} />
          Assign to User
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleBulkAction('move')}>
          <LocationOn sx={{ mr: 1 }} />
          Move to Location
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleBulkAction('retire')}>
          <Warning sx={{ mr: 1 }} />
          Retire Assets
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => handleBulkAction('export')}>
          <Download sx={{ mr: 1 }} />
          Export Selected
        </MenuItemComponent>
      </Menu>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Inventory" />
          <Tab label="Categories" />
          <Tab label="Locations" />
          <Tab label="Discovery" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {tabValue === 0 && <AssetOverviewTab />}
      {tabValue === 1 && <AssetInventoryTab />}
      {tabValue === 2 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Asset Categories</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Asset category management features coming soon!
          </Alert>
        </Box>
      )}
      {tabValue === 3 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Asset Locations</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Asset location management features coming soon!
          </Alert>
        </Box>
      )}
      {tabValue === 4 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Asset Discovery</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Automated asset discovery features coming soon!
          </Alert>
        </Box>
      )}
      {tabValue === 5 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Asset Reports</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Asset reporting features coming soon!
          </Alert>
        </Box>
      )}

      {/* Asset Dialog */}
      <Dialog
        open={assetDialogOpen}
        onClose={() => setAssetDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Asset form implementation in progress...
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Asset Name"
                variant="outlined"
                margin="dense"
                defaultValue={selectedAsset?.name || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Asset Tag"
                variant="outlined"
                margin="dense"
                defaultValue={selectedAsset?.assetTag || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select value={selectedAsset?.category.id || ''} label="Category">
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select value={selectedAsset?.status || ''} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssetDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">{selectedAsset ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Assets</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Asset import features coming soon!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Import</Button>
        </DialogActions>
      </Dialog>

      {/* Discovery Dialog */}
      <Dialog
        open={discoveryDialogOpen}
        onClose={() => setDiscoveryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Asset Discovery</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Asset discovery features coming soon!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiscoveryDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Start Discovery</Button>
        </DialogActions>
      </Dialog>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Category</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Status</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Location</MenuItem>
      </Menu>
    </Box>
  );
};

export default AssetManagementPage;
