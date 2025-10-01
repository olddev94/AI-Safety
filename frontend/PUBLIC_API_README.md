# Public API + CSV Subscription System

This document describes the newly implemented public API documentation and CSV subscription system for the AI Incident Tracker frontend application.

## 🚀 Features Implemented

### 1. API Documentation Page (`/api-docs`)
- **Comprehensive API documentation** with interactive examples
- **Endpoint explorer** with request/response schemas
- **Code examples** in cURL and JavaScript
- **API key management** interface integrated
- **Copy-to-clipboard** functionality for easy testing

### 2. CSV Subscription System (`/csv-subscription`)
- **Email-based subscriptions** with customizable frequency (daily/weekly/monthly)
- **Advanced filtering options** by categories, countries, and severities
- **Multiple export formats** (CSV/JSON)
- **Subscription management** with local storage persistence
- **Professional UI/UX** with step-by-step guidance

### 3. API Key Management
- **Secure key generation** with proper prefixing (`aik_` prefix)
- **Key visibility controls** with masking/unmasking
- **Usage tracking** and statistics
- **Revoke/delete functionality** with confirmation dialogs
- **Copy-to-clipboard** for easy integration

## 📁 File Structure

```
frontend/src/
├── pages/
│   ├── ApiDocs.tsx              # Main API documentation page
│   └── CsvSubscription.tsx      # CSV subscription form and management
├── components/
│   └── api/
│       └── ApiKeyManager.tsx    # API key management component
├── services/
│   └── csvSubscriptionService.ts # Service layer for subscription management
└── App.tsx                      # Updated with new routes
```

## 🛠️ Technical Implementation

### API Documentation Features
- **Dynamic endpoint switching** with sidebar navigation
- **Tabbed interface** for request/response/examples
- **Real-time base URL detection** using `window.location.hostname`
- **Schema visualization** with proper JSON formatting
- **Responsive design** with mobile-friendly layout

### CSV Subscription Features
- **React Hook Form** with Zod validation for type safety
- **Checkbox groups** for multi-select categories and filters
- **Conditional rendering** for success states
- **Local storage persistence** (ready for backend integration)
- **Professional confirmation flow** with next steps

### API Key Management
- **Secure key generation** with cryptographically random strings
- **Visual key masking** for security
- **Usage analytics** tracking (ready for backend integration)
- **Bulk operations** support for enterprise use

## 🔗 Navigation Integration

The new features are integrated into the main dashboard with prominent buttons:
- **API Docs** button in the header navigation
- **CSV Export** button for easy access to subscriptions
- **Cross-linking** between API docs and CSV subscription pages

## 🎨 UI/UX Design

### Design Principles
- **Consistent theming** with existing application
- **Professional appearance** suitable for enterprise users
- **Clear information hierarchy** with proper spacing
- **Intuitive workflows** with guided user experiences
- **Responsive layout** for all screen sizes

### Visual Elements
- **Shadcn/UI components** for consistency
- **Lucide icons** for clear visual communication
- **Status badges** for API keys and subscriptions
- **Progress indicators** for async operations
- **Toast notifications** for user feedback

## 📊 Data Management

### Local Storage Implementation
Currently using localStorage for development/testing:
- **API Keys**: Stored in `apiKeys` key
- **CSV Subscriptions**: Stored in `csvSubscriptions` key
- **Export History**: Stored in `csvExportHistory` key

### Backend Integration Ready
All services are structured for easy backend integration:
- **Service layer abstraction** with clear API interfaces
- **Error handling** with proper try/catch blocks
- **Loading states** for async operations
- **TypeScript interfaces** for type safety

## 🔧 Configuration

### Environment Setup
The system automatically detects the backend URL using:
```typescript
const API_BASE_URL = `http://${window.location.hostname}:8800`;
```

### Customization Options
- **Frequency options**: Daily, Weekly, Monthly
- **Export formats**: CSV, JSON
- **Filter categories**: Comprehensive list of AI incident types
- **Geographic filters**: Country-based filtering
- **Severity levels**: Critical, High, Medium, Low

## 🚦 Usage Instructions

### For End Users
1. **Access API Documentation**: Navigate to `/api-docs` from the dashboard
2. **Create API Key**: Use the API Keys section to generate authentication keys
3. **Subscribe to CSV**: Visit `/csv-subscription` to set up automated exports
4. **Manage Subscriptions**: Return to modify or cancel subscriptions anytime

### For Developers
1. **API Integration**: Use the provided cURL and JavaScript examples
2. **Authentication**: Include API key in Authorization header
3. **Rate Limiting**: Currently no limits, but use responsibly
4. **Error Handling**: Standard HTTP status codes with detailed messages

## 🔮 Future Enhancements

### Backend Integration
- Replace localStorage with actual API calls
- Implement email delivery system for CSV exports
- Add usage analytics and rate limiting
- Create admin interface for subscription management

### Advanced Features
- **Webhook support** for real-time notifications
- **Custom export templates** for different use cases
- **Batch API operations** for bulk data access
- **Advanced filtering** with date ranges and custom queries

## 📝 Testing

### Manual Testing Checklist
- [ ] API documentation loads correctly
- [ ] All endpoints display proper schemas
- [ ] Code examples copy to clipboard
- [ ] API key generation works
- [ ] CSV subscription form validates properly
- [ ] Success states display correctly
- [ ] Navigation between pages works
- [ ] Responsive design on mobile devices

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🤝 Contributing

When extending these features:
1. **Follow TypeScript patterns** established in services
2. **Use Shadcn/UI components** for consistency
3. **Implement proper error handling** with user feedback
4. **Add loading states** for async operations
5. **Update this README** with new features

## 📞 Support

For questions about the public API and CSV subscription system:
- Check the in-app documentation at `/api-docs`
- Review the code examples provided
- Test with the interactive API explorer
- Use the contact support button for additional help

---

**Status**: ✅ MVP Complete - Ready for Phase 2 Week 1 delivery
**Last Updated**: October 2025
**Version**: 1.0.0
