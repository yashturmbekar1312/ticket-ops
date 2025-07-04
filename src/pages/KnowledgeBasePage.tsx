import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search, Add, Edit, Visibility, ThumbUp, BookmarkBorder, Share } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/auth';
import { KnowledgeBaseArticle, KnowledgeBaseFormData } from '../types';

// Mock data for knowledge base articles
const mockArticles: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'How to Reset Your Password',
    content: 'Step-by-step guide to reset your password...',
    summary: 'Quick guide for password reset',
    tags: ['password', 'account', 'security'],
    category: 'Account',
    author: 'IT Admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    viewCount: 245,
    isPublished: true,
    helpfulCount: 42,
    relatedArticles: ['2', '3'],
  },
  {
    id: '2',
    title: 'VPN Connection Issues',
    content: 'Troubleshooting common VPN connection problems...',
    summary: 'Fix common VPN connectivity issues',
    tags: ['vpn', 'network', 'connectivity'],
    category: 'Network',
    author: 'Network Admin',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    viewCount: 189,
    isPublished: true,
    helpfulCount: 35,
  },
  {
    id: '3',
    title: 'Software Installation Guide',
    content: 'How to install company-approved software...',
    summary: 'Install approved software on your workstation',
    tags: ['software', 'installation', 'policy'],
    category: 'Software',
    author: 'IT Support',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    viewCount: 156,
    isPublished: true,
    helpfulCount: 28,
  },
];

const categories = ['All', 'Account', 'Network', 'Software', 'Hardware', 'Policy'];

const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeBaseArticle[]>(mockArticles);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const canCreateArticle = user?.role === 'IT Admin' || user?.role === 'Admin';

  const createArticleSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    summary: Yup.string().required('Summary is required'),
    category: Yup.string().required('Category is required'),
    tags: Yup.array().of(Yup.string()).min(1, 'At least one tag is required'),
  });

  const formik = useFormik<KnowledgeBaseFormData>({
    initialValues: {
      title: '',
      content: '',
      summary: '',
      tags: [],
      category: '',
      isPublished: false,
    },
    validationSchema: createArticleSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newArticle: KnowledgeBaseArticle = {
          id: Date.now().toString(),
          ...values,
          author: user?.name || 'Unknown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewCount: 0,
          helpfulCount: 0,
        };

        setArticles([newArticle, ...articles]);
        setIsCreateDialogOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error('Error creating article:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchQuery]);

  const handleViewArticle = (article: KnowledgeBaseArticle) => {
    setSelectedArticle(article);
    setIsViewDialogOpen(true);
    // Simulate view count increment
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, viewCount: a.viewCount + 1 } : a))
    );
  };

  const handleMarkHelpful = (articleId: string) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === articleId ? { ...article, helpfulCount: article.helpfulCount + 1 } : article
      )
    );
  };

  const popularArticles = articles
    .filter((a) => a.viewCount > 100)
    .sort((a, b) => b.viewCount - a.viewCount);
  const recentArticles = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Knowledge Base
        </Typography>
        {canCreateArticle && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Create Article
          </Button>
        )}
      </Box>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search articles..."
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Articles" />
        <Tab label="Popular" />
        <Tab label="Recent" />
      </Tabs>

      {/* Articles Grid */}
      <Grid container spacing={3}>
        {(tabValue === 0
          ? filteredArticles
          : tabValue === 1
            ? popularArticles
            : recentArticles
        ).map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { boxShadow: 4 },
                cursor: 'pointer',
              }}
              onClick={() => handleViewArticle(article)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.summary}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {article.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility fontSize="small" />
                  <Typography variant="caption">{article.viewCount}</Typography>
                  <ThumbUp fontSize="small" />
                  <Typography variant="caption">{article.helpfulCount}</Typography>
                </Box>
                <Chip label={article.category} size="small" color="primary" variant="outlined" />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No articles found matching your criteria.
        </Alert>
      )}

      {/* Create Article Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Article</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              name="summary"
              label="Summary"
              value={formik.values.summary}
              onChange={formik.handleChange}
              error={formik.touched.summary && Boolean(formik.errors.summary)}
              helperText={formik.touched.summary && formik.errors.summary}
              margin="normal"
            />
            <TextField
              fullWidth
              name="content"
              label="Content"
              multiline
              rows={8}
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                {categories
                  .filter((cat) => cat !== 'All')
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="tags"
              label="Tags (comma-separated)"
              value={formik.values.tags.join(', ')}
              onChange={(e) =>
                formik.setFieldValue(
                  'tags',
                  e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag)
                )
              }
              margin="normal"
              helperText="Enter tags separated by commas"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
            >
              {isLoading ? 'Creating...' : 'Create Article'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Article Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedArticle && (
          <>
            <DialogTitle>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <Typography variant="h5" component="h2">
                  {selectedArticle.title}
                </Typography>
                <Box>
                  <IconButton>
                    <BookmarkBorder />
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                  {canCreateArticle && (
                    <IconButton>
                      <Edit />
                    </IconButton>
                  )}
                </Box>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                By {selectedArticle.author} •{' '}
                {new Date(selectedArticle.createdAt).toLocaleDateString()}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedArticle.summary}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                {selectedArticle.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<ThumbUp />} onClick={() => handleMarkHelpful(selectedArticle.id)}>
                Helpful ({selectedArticle.helpfulCount})
              </Button>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default KnowledgeBasePage;
