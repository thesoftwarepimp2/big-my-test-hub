
# Big Game Logistics (BGL) - React E-commerce Application

## Project Overview

This is a comprehensive e-commerce web application built for Big Game Logistics, featuring role-based access for wholesalers, retailers, and administrators. The application provides product browsing, cart management, order processing, and administrative tools with full WordPress integration.

## Recent Updates and Improvements

### WordPress Integration Completed (Latest Update)
- **WooCommerce API Integration**: Successfully connected to WordPress/WooCommerce backend
- **Real-time Product Loading**: Products now load directly from WordPress via REST API
- **User Authentication**: Implemented WordPress-based login/logout system
- **Order Management**: Orders are now created and stored in WordPress backend
- **Cart Synchronization**: Cart data syncs with WordPress user meta
- **Chat System**: Implemented real-time messaging between users and admin
- **File Attachments**: Support for uploading documents, images, and files in chat

### Key Features Implemented

#### 1. WordPress/WooCommerce Integration
- Connected to `https://school.nhaka.online/connect` backend
- WooCommerce API keys configured for product fetching
- Custom REST API endpoints for orders and cart management
- JWT authentication for secure API access

#### 2. Enhanced Cart System
- Real-time cart synchronization with WordPress
- Order submission to admin for processing
- Cart persistence across sessions
- Integration with user accounts

#### 3. Advanced Chat System
- Real-time messaging interface similar to WhatsApp
- File upload support (Word, Excel, PDF, Images)
- Message status indicators (sent, delivered, read)
- Quick reply templates
- Admin-user communication channel

#### 4. User Account Management
- Real user data from WordPress
- Order history tracking
- Profile editing capabilities
- Statistics and analytics dashboard

#### 5. Admin Panel Enhancements
- Real order processing from WordPress
- User management with actual data
- Communication hub for customer support
- Order status and payment tracking

## Current Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API + TanStack Query
- **Data Fetching**: @tanstack/react-query with Axios
- **Backend Integration**: WordPress REST API + WooCommerce
- **Authentication**: WordPress JWT tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Radix UI primitives

## WordPress Backend Configuration

### Required WordPress Setup

#### Plugins Installed:
1. **WooCommerce** - E-commerce functionality
2. **JWT Authentication for WP REST API** - Token-based authentication
3. **Advanced Custom Fields (ACF)** - Custom data fields
4. **WP REST API Controller** - Enhanced API control

#### Custom Post Types:
- **Products** - WooCommerce products with custom attributes
- **Orders** - Custom order management system
- **Messages** - Chat system backend

#### API Endpoints Created:
- `POST /wp-json/bgl/v1/auth` - User authentication
- `GET /wp-json/bgl/v1/cart` - Get user cart
- `POST /wp-json/bgl/v1/cart` - Update user cart
- `POST /wp-json/bgl/v1/orders` - Create new order
- `GET /wp-json/bgl/v1/conversations` - Get chat conversations
- `POST /wp-json/bgl/v1/conversations/{id}/messages` - Send messages

## Project Structure (Updated)

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.tsx  # Enhanced product display
│   └── ui/             # shadcn/ui components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # WordPress authentication
│   └── CartContext.tsx # Cart with WordPress sync
├── hooks/              # Custom React hooks
│   ├── useWordPress.ts # WordPress API hooks
│   ├── useChat.ts      # Chat functionality
│   └── useApi.ts       # Generic API hooks
├── pages/              # Main application pages
│   ├── Products.tsx    # WordPress product catalog
│   ├── Chat.tsx        # Enhanced messaging system
│   ├── Account.tsx     # Real user profiles
│   └── AdminPanel.tsx  # WordPress-connected admin
├── services/           # API service layer
│   ├── api.ts          # Axios configuration
│   ├── products.ts     # WooCommerce integration
│   ├── orders.ts       # Order management
│   ├── cart.ts         # Cart synchronization
│   ├── chat.ts         # Messaging system
│   └── auth.ts         # WordPress authentication
├── types/              # TypeScript definitions
└── lib/               # Utility functions
```

## Environment Configuration

```env
VITE_WORDPRESS_API_URL=https://school.nhaka.online/connect/wp-json
VITE_BGL_API_URL=https://school.nhaka.online/connect/wp-json/bgl/v1
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_43e26c27e610a14b6fdb113d29677a480c7f0fbb
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_12eb8a23aafb2ca370092d40abd13d7a0e9de329
```

## Demo Data Export

A comprehensive CSV file (`demo-data-export.csv`) has been created containing:
- **Products**: All product data with categories, pricing, and images
- **Users**: Sample user accounts with roles and business information
- **Orders**: Historical order data for testing

### CSV Structure:
- Products with WooCommerce-compatible fields
- Custom field mappings for size/pricing variations
- User accounts with BGL-specific roles
- Order history with proper relationships

## WordPress PHP Implementation Required

Add to your WordPress `functions.php`:

```php
// CORS Configuration
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// Custom REST API Routes
function register_bgl_rest_routes() {
    // Authentication
    register_rest_route('bgl/v1', '/auth', array(
        'methods' => 'POST',
        'callback' => 'bgl_authenticate_user',
        'permission_callback' => '__return_true'
    ));
    
    // Cart Management
    register_rest_route('bgl/v1', '/cart', array(
        'methods' => array('GET', 'POST'),
        'callback' => 'bgl_handle_cart',
        'permission_callback' => 'is_user_logged_in'
    ));
    
    // Order Management
    register_rest_route('bgl/v1', '/orders', array(
        'methods' => array('GET', 'POST'),
        'callback' => 'bgl_handle_orders',
        'permission_callback' => 'is_user_logged_in'
    ));
    
    // Chat System
    register_rest_route('bgl/v1', '/conversations', array(
        'methods' => 'GET',
        'callback' => 'bgl_get_conversations',
        'permission_callback' => 'is_user_logged_in'
    ));
    
    register_rest_route('bgl/v1', '/conversations/(?P<id>\d+)/messages', array(
        'methods' => array('GET', 'POST'),
        'callback' => 'bgl_handle_messages',
        'permission_callback' => 'is_user_logged_in'
    ));
}
add_action('rest_api_init', 'register_bgl_rest_routes');

// Custom User Fields
function add_bgl_user_fields($user) {
    ?>
    <h3>BGL Business Information</h3>
    <table class="form-table">
        <tr>
            <th><label for="business_name">Business Name</label></th>
            <td><input type="text" name="business_name" value="<?php echo esc_attr(get_user_meta($user->ID, 'business_name', true)); ?>" /></td>
        </tr>
        <tr>
            <th><label for="phone">Phone</label></th>
            <td><input type="text" name="phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'phone', true)); ?>" /></td>
        </tr>
        <tr>
            <th><label for="bgl_role">BGL Role</label></th>
            <td>
                <select name="bgl_role">
                    <option value="wholesaler" <?php selected(get_user_meta($user->ID, 'bgl_role', true), 'wholesaler'); ?>>Wholesaler</option>
                    <option value="retailer" <?php selected(get_user_meta($user->ID, 'bgl_role', true), 'retailer'); ?>>Retailer</option>
                    <option value="admin" <?php selected(get_user_meta($user->ID, 'bgl_role', true), 'admin'); ?>>Admin</option>
                </select>
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'add_bgl_user_fields');
add_action('edit_user_profile', 'add_bgl_user_fields');
```

## Installation and Setup

### Local Development Setup:

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd bgl-ecommerce
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file with WordPress credentials
   cp .env.example .env.local
   # Edit .env.local with your WordPress details
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **WordPress Backend Setup**
   - Install required WordPress plugins
   - Add custom PHP code to functions.php
   - Import demo data using CSV file
   - Configure WooCommerce API keys
   - Set up user accounts with BGL roles

## API Integration Details

### Product Management
- **GET** `/wc/v3/products` - Fetch all products from WooCommerce
- **GET** `/wc/v3/products/{id}` - Get specific product details
- Products include custom size/pricing attributes
- Real-time stock status integration

### Order Processing
- **POST** `/bgl/v1/orders` - Create new order
- **GET** `/bgl/v1/orders` - Get user orders
- **PUT** `/bgl/v1/orders/{id}/status` - Update order status
- Orders stored as WordPress custom posts

### Cart Synchronization
- **GET** `/bgl/v1/cart` - Retrieve user cart
- **POST** `/bgl/v1/cart` - Update cart contents
- Cart data stored in WordPress user meta
- Real-time sync across devices

### Authentication Flow
- **POST** `/bgl/v1/auth` - WordPress login
- JWT token-based authentication
- Role-based access control
- Secure API endpoint protection

## User Roles and Permissions

### Wholesaler
- Browse and purchase products in bulk
- Access to wholesale pricing
- Order history and tracking
- Direct communication with admin

### Retailer
- Standard product catalog access
- Retail pricing structure
- Order management capabilities
- Customer support access

### Admin
- Complete system administration
- Order processing and management
- User account management
- Communication hub access
- Analytics and reporting

## Testing Strategy

### Completed Tests:
- [x] WordPress API connection
- [x] WooCommerce product fetching
- [x] User authentication flow
- [x] Cart synchronization
- [x] Order creation process
- [x] Chat message system
- [x] File upload functionality

### Pending Tests:
- [ ] Payment processing integration
- [ ] Email notification system
- [ ] Mobile responsiveness validation
- [ ] Performance optimization
- [ ] Security penetration testing

## Deployment

### Production Deployment:
1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Hosting**
   - Upload dist/ folder to web server
   - Configure environment variables
   - Set up SSL certificate
   - Configure WordPress CORS settings

3. **WordPress Production Setup**
   - Install plugins on live site
   - Import production data
   - Configure API endpoints
   - Set up user accounts

## Troubleshooting

### Common Issues:

1. **Products Not Loading**
   - Verify WooCommerce API keys
   - Check CORS configuration
   - Validate WordPress API endpoints

2. **Authentication Failures**
   - Confirm JWT plugin installation
   - Check user credentials
   - Verify API endpoint access

3. **Cart Sync Issues**
   - Check user authentication status
   - Validate API permissions
   - Review localStorage fallback

4. **Chat Not Working**
   - Verify file upload permissions
   - Check message API endpoints
   - Confirm user relationships

## Performance Optimization

### Implemented Optimizations:
- React Query caching for API calls
- Image lazy loading for products
- Component code splitting
- Optimized bundle size
- Database query optimization

### Monitoring:
- API response time tracking
- Error logging and reporting
- User behavior analytics
- Performance metrics collection

## Security Measures

### Implemented Security:
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File upload restrictions

## Future Enhancements

### Planned Features:
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notification system
- [ ] SMS alerts for orders
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Multi-language support
- [ ] PWA capabilities

## Support and Maintenance

### Regular Maintenance Tasks:
- WordPress and plugin updates
- Database optimization
- Security patches
- Performance monitoring
- Backup verification
- User account management

### Support Channels:
- In-app chat system
- Email support integration
- Phone support capability
- Documentation and FAQ
- Video tutorials

---

**Live Application**: https://d52b324d-dc18-4a5e-b364-873d4fdda8eb.lovableproject.com
**WordPress Backend**: https://school.nhaka.online/connect/
**Last Updated**: 2025-01-XX
**Version**: 2.0 (WordPress Integrated)
