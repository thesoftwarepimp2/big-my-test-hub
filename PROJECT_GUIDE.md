
# Big Game Logistics - B2B E-commerce Platform

## Project Overview
A comprehensive B2B e-commerce platform built with React, TypeScript, and Tailwind CSS, designed for wholesale and retail businesses to manage orders, products, and communications.

## Features Implemented

### 1. User Authentication & Roles
- **Admin**: Full system management access
- **Wholesaler**: Can browse products and place orders
- **Retailer**: Can browse products and place orders
- Role-based access control and navigation

### 2. Product Management
- Complete CRUD operations for products
- Support for multiple sizes and pricing (USD/ZIG)
- Stock management (in stock/out of stock)
- Product categories and descriptions
- Image support for products
- Admin can add, edit, and delete products
- Products display in catalog for wholesalers/retailers

### 3. Shopping Cart & Orders
- Add products to cart with quantity selection
- Size selection for products with multiple sizes
- Cart persistence across sessions
- Order submission with client details
- Order tracking and status management
- Admin receives all submitted orders
- Order status updates (pending/processing/delivered)

### 4. Communication System
- Real-time chat between admin and users
- File attachment support (up to 10MB)
- Message persistence using localStorage
- Chat history for each conversation
- Admin can initiate chats with registered users

### 5. Admin Panel
- Dashboard with key metrics
- Order management with processing capabilities
- User management showing registered customers
- Product inventory management
- Communication center for customer support

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **React Router Dom** for navigation
- **TanStack Query** for data fetching

### State Management
- React Context API for authentication
- React Context API for cart management
- localStorage for data persistence

### Data Storage
- localStorage for demo data persistence
- Structured data models for users, products, orders, and chats
- Fallback system for backend integration

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AdminProductManager.tsx
│   ├── ChatDialog.tsx
│   └── ProductCard.tsx
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/               # Custom React hooks
│   ├── useProducts.ts
│   ├── useChat.ts
│   └── use-toast.ts
├── pages/               # Page components
│   ├── AdminPanel.tsx
│   ├── Products.tsx
│   ├── Chat.tsx
│   └── Account.tsx
├── services/            # API services
│   ├── auth.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── cart.ts
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── data/                # Demo data
    └── users.ts
```

## Key Components

### Authentication System
- Login with username, password, and role selection
- Demo credentials: `biggame123` (password for all users)
- User roles: admin_demo, wholesaler_demo, retailer_demo
- Profile management with persistent updates

### Product Catalog
- Responsive grid layout
- Search and filter functionality
- Product cards with images, descriptions, and pricing
- Add to cart functionality with size selection

### Shopping Cart
- Sliding cart panel with item management
- Quantity adjustments and item removal
- Total calculation and order submission
- Persistent cart state across sessions

### Admin Dashboard
- Real-time order monitoring
- Product inventory management
- User engagement tracking
- Communication management

## Demo Users
1. **Admin**: admin_demo / biggame123
2. **Wholesaler**: wholesaler_demo / biggame123
3. **Retailer**: retailer_demo / biggame123

## Setup Instructions

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation
1. Clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Start development server: `npm run dev` or `bun dev`
4. Open browser to `http://localhost:5173`

### Environment Variables
Create `.env.local` file:
```
VITE_WORDPRESS_API_URL=https://school.nhaka.online/connect/wp-json
VITE_BGL_API_URL=https://school.nhaka.online/connect/wp-json/bgl/v1
```

## Data Flow

### Authentication Flow
1. User logs in with credentials
2. AuthContext validates and stores user data
3. Role-based navigation and access control applied
4. User data persists in localStorage

### Product Management Flow
1. Admin creates/updates products via AdminProductManager
2. Products stored in localStorage with fallback to backend
3. Products displayed in catalog for all users
4. Real-time updates across components

### Order Processing Flow
1. User adds products to cart
2. Cart state managed by CartContext
3. Order submission creates order record
4. Admin receives order in AdminPanel
5. Order status tracking and updates

### Communication Flow
1. Admin initiates chat with user
2. ChatDialog component handles messaging
3. Messages stored per conversation
4. File attachment support included

## Future Enhancements

### Technical Improvements
- Backend API integration (currently uses localStorage)
- Real-time WebSocket connections for chat
- Payment processing integration
- Advanced search and filtering
- Email notifications for orders

### Feature Additions
- Product reviews and ratings
- Bulk order pricing
- Invoice generation
- Shipping tracking
- Analytics dashboard
- Mobile app development

## Testing Workflow

### Admin Testing
1. Login as admin_demo
2. Navigate to Admin Panel
3. Add/edit products in Products tab
4. Monitor orders in Orders tab
5. Start chats in Communications tab

### User Testing
1. Login as wholesaler_demo or retailer_demo
2. Browse products catalog
3. Add items to cart
4. Submit order
5. Check order appears in admin panel

### Chat Testing
1. Admin starts chat with user
2. Send messages back and forth
3. Test file attachments
4. Verify message persistence

## Troubleshooting

### Common Issues
- **Products not loading**: Check localStorage data or refresh browser
- **Orders not submitting**: Verify user is logged in and cart has items
- **Chat not working**: Ensure dialog is properly opened and users exist

### Debug Mode
- Open browser developer tools
- Check console for error messages
- Inspect localStorage for data persistence
- Monitor network requests for API calls

## Contributing
1. Follow existing code structure and patterns
2. Use TypeScript for type safety
3. Implement responsive design principles
4. Add proper error handling and loading states
5. Update documentation for new features

## Support
For technical support or feature requests, use the built-in chat system or contact the development team.
