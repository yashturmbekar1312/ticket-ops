# TicketOps - Professional Ticketing System

A modern, role-based ticketing system built with React, TypeScript, and Material-UI. Features comprehensive RBAC (Role-Based Access Control) for different user types including Employee, HR, Manager, and IT Admin.

## 🚀 Features

### Multi-Level User Roles

- **Employee**: Create and manage personal tickets, add comments, track status
- **HR**: Handle HR-related tickets, onboarding issues, escalate to IT/Manager
- **Manager**: View team tickets, assign priorities, manage team workflow
- **IT Admin**: Full system access, user management, all ticket operations

### Core Functionality

- ✅ Role-based authentication and routing
- ✅ Ticket lifecycle management (Open → In Progress → Resolved → Closed)
- ✅ Advanced filtering and search
- ✅ Real-time status updates
- ✅ Comment system with role-based visibility
- ✅ Responsive design for all devices
- ✅ Professional UI with Material-UI components

### Security & Permissions

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes based on user roles
- Granular permissions for ticket operations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Forms**: Formik + Yup validation
- **Styling**: Emotion (CSS-in-JS)
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ticket-ops
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Users

The system includes pre-configured demo users for testing different roles:

### IT Admin

- **Email**: admin@company.com
- **Password**: password
- **Capabilities**: Full system access, user management, all tickets

### Manager

- **Email**: manager@company.com
- **Password**: password
- **Capabilities**: Team tickets, assignments, priority management

### HR

- **Email**: hr@company.com
- **Password**: password
- **Capabilities**: HR tickets, onboarding, escalations

### Employee

- **Email**: employee@company.com
- **Password**: password
- **Capabilities**: Create tickets, view own tickets, add comments

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Sidebar, TopBar, etc.)
│   ├── ticket/            # Ticket-related components
│   └── theme/             # Theme configuration
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── redux/                 # Redux store and slices
├── services/              # API service layer
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and permissions
└── tests/                 # Test files
```

## 🎯 Usage Scenarios

### Employee Workflow

1. Login with employee credentials
2. View personal dashboard with ticket overview
3. Create new tickets with appropriate categorization
4. Track ticket progress and add comments
5. Receive notifications on status changes

### HR Workflow

1. Access HR-specific dashboard
2. Handle onboarding and access-related tickets
3. Create tickets for new employee setup
4. Escalate technical issues to IT team
5. Monitor HR ticket resolution rates

### Manager Workflow

1. View team-wide ticket overview
2. Assign tickets to team members
3. Set priorities and manage workflow
4. Track team performance metrics
5. Generate reports on ticket resolution

### IT Admin Workflow

1. Access comprehensive system dashboard
2. Manage all tickets across departments
3. Assign tickets to appropriate teams
4. Monitor system-wide performance
5. Manage user roles and permissions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🎨 Design Principles

### User Experience

- Clean, professional interface
- Intuitive navigation based on user roles
- Responsive design for desktop and mobile
- Consistent visual hierarchy

### Performance

- Code splitting for optimal loading
- Lazy loading of components
- Efficient state management
- Minimal bundle size

### Accessibility

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## 🔒 Security Features

- JWT token-based authentication
- Role-based route protection
- Input validation and sanitization
- XSS prevention measures
- CSRF protection

## 📊 Monitoring & Analytics

- User action tracking
- Ticket resolution metrics
- Performance monitoring
- Error boundary implementation

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Create a `.env.production` file:

```env
VITE_API_URL=https://your-api-url.com/api
VITE_APP_NAME=TicketOps
VITE_APP_VERSION=1.0.0
```

### Deployment Platforms

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Deploy from Git with build command `npm run build`
- **AWS S3**: Upload dist folder to S3 bucket with CloudFront
- **Docker**: Use the provided Dockerfile for containerized deployment

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Test Coverage

- Component rendering tests
- User interaction tests
- Redux state management tests
- Permission-based access tests

### Testing Strategy

- Test user workflows for each role
- Validate RBAC permissions
- Test responsive design
- API integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add tests for new features
- Update documentation

## 📋 Roadmap

### Phase 1 (Current)

- [x] Basic RBAC implementation
- [x] Ticket CRUD operations
- [x] Role-based dashboards
- [x] Basic filtering and search

### Phase 2 (Upcoming)

- [ ] Real-time notifications
- [ ] File attachments
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile app

### Phase 3 (Future)

- [ ] Integration with external tools
- [ ] Advanced analytics
- [ ] AI-powered ticket routing
- [ ] Multi-tenant support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@ticketops.com or join our Slack channel.

---

**Built with ❤️ by the TicketOps Team**
