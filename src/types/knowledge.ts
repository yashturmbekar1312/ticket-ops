// Knowledge Base and Self-Service Portal types

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;

  // Categorization
  category: string;
  subcategory?: string;
  tags: string[];

  // Visibility and access
  visibility: 'public' | 'internal' | 'private';
  accessLevel: 'all' | 'authenticated' | 'specific_roles';
  allowedRoles?: string[];
  allowedDepartments?: string[];

  // Content metadata
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // minutes

  // Publishing
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: string;
  scheduledPublishAt?: string;

  // Versioning
  version: number;
  parentId?: string;
  revisionHistory: ArticleRevision[];

  // Authoring
  authorId: string;
  authorName: string;
  lastModifiedBy: string;
  lastModifiedByName: string;

  // Engagement metrics
  viewCount: number;
  helpful: number;
  notHelpful: number;
  avgRating: number;
  ratingCount: number;

  // SEO and search
  slug: string;
  metaDescription: string;
  searchKeywords: string[];

  // Related content
  relatedArticles: string[];
  relatedTickets: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRevision {
  id: string;
  articleId: string;
  version: number;
  title: string;
  content: string;
  summary: string;
  changeLog: string;

  // Author info
  authorId: string;
  authorName: string;

  // Status
  status: 'draft' | 'published' | 'archived';

  // Timestamps
  createdAt: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  slug: string;

  // Hierarchy
  parentId?: string;
  path: string;
  level: number;
  sortOrder: number;

  // Appearance
  icon?: string;
  color?: string;
  image?: string;

  // Visibility
  isVisible: boolean;
  isPublic: boolean;
  allowedRoles?: string[];

  // Metadata
  articleCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRating {
  id: string;
  articleId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  isHelpful: boolean;
  createdAt: string;
}

export interface ArticleView {
  id: string;
  articleId: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  timeSpent: number; // seconds
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;

  // Popularity
  viewCount: number;
  helpful: number;
  notHelpful: number;

  // Visibility
  isPublic: boolean;
  isActive: boolean;

  // Authoring
  authorId: string;
  authorName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  shortDescription: string;

  // Categorization
  category: string;
  subcategory?: string;
  tags: string[];

  // Request details
  requestForm: ServiceRequestForm;
  approvalRequired: boolean;
  approvalWorkflow?: string;

  // SLA and pricing
  slaPolicy?: string;
  estimatedDeliveryTime: number; // hours
  cost?: number;
  currency?: string;

  // Availability
  isActive: boolean;
  isPublic: boolean;
  availableToRoles: string[];
  availableToDepartments: string[];

  // Appearance
  icon?: string;
  image?: string;

  // Ordering
  sortOrder: number;

  // Metrics
  requestCount: number;
  avgRating: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestForm {
  id: string;
  fields: FormField[];
  validationRules: ValidationRule[];
  conditionalLogic: ConditionalLogic[];
}

export interface FormField {
  id: string;
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'multiselect'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'number'
    | 'email'
    | 'file';
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[]; // For select/radio fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  sortOrder: number;
  isVisible: boolean;
  isReadonly: boolean;
}

export interface ValidationRule {
  id: string;
  fieldId: string;
  rule: string;
  message: string;
  isActive: boolean;
}

export interface ConditionalLogic {
  id: string;
  condition: string;
  action: 'show' | 'hide' | 'require' | 'disable';
  targetFieldId: string;
  isActive: boolean;
}

export interface ServiceRequest {
  id: string;
  serviceItemId: string;
  serviceItemName: string;

  // Request details
  requestedBy: string;
  requestedByName: string;
  department: string;
  formData: Record<string, any>;

  // Status and workflow
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  currentStep: string;
  workflowId?: string;

  // Approval
  approvals: ServiceApproval[];

  // Fulfillment
  assignedTo?: string;
  assignedToName?: string;
  fulfillmentNotes?: string;

  // Timing
  requestedDate: string;
  requiredDate?: string;
  approvedDate?: string;
  completedDate?: string;

  // Related tickets
  relatedTickets: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ServiceApproval {
  id: string;
  requestId: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  level: number;

  // Decision
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  decidedAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SelfServicePortal {
  id: string;
  name: string;
  description: string;

  // Branding
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  customCSS?: string;

  // Features
  features: {
    knowledgeBase: boolean;
    serviceRequests: boolean;
    ticketSubmission: boolean;
    ticketTracking: boolean;
    userProfile: boolean;
    notifications: boolean;
    chatbot: boolean;
    communityForum: boolean;
  };

  // Configuration
  defaultLanguage: string;
  supportedLanguages: string[];
  timezone: string;

  // Access control
  isPublic: boolean;
  authenticationRequired: boolean;
  allowedDomains: string[];

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  type: 'article' | 'faq' | 'service_item' | 'ticket';
  title: string;
  content: string;
  url: string;
  relevanceScore: number;
  highlightedText: string;
  category: string;
  tags: string[];
  lastUpdated: string;
}

export interface SearchQuery {
  query: string;
  filters: {
    type?: string[];
    category?: string[];
    tags?: string[];
    language?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  pagination: {
    page: number;
    limit: number;
  };
  sort: {
    field: 'relevance' | 'date' | 'popularity';
    order: 'asc' | 'desc';
  };
}
