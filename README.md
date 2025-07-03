
# Big Game Logistics (BGL) - React E-commerce Application

## Project Overview

This is a comprehensive e-commerce web application built for Big Game Logistics, featuring role-based access for wholesalers, retailers, and administrators. The application provides product browsing, cart management, order processing, and administrative tools.

## Current Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Data Fetching**: @tanstack/react-query
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Radix UI primitives

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers (Auth, Cart)
├── data/              # Static data files (TO BE REPLACED)
├── hooks/             # Custom React hooks
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
└── lib/               # Utility functions
```

## Current Data Sources (TO BE REPLACED WITH WORDPRESS)

### 1. Authentication (`src/data/users.ts`)
- **Current**: Static user data with hardcoded credentials
- **Contains**: Demo users for wholesaler, retailer, and admin roles
- **WordPress Integration**: Replace with JWT authentication via WordPress REST API

### 2. Products (`src/data/products.ts`)
- **Current**: Static product array with categories, pricing, and inventory
- **Contains**: Product details, multiple size options, USD/ZIG pricing
- **WordPress Integration**: Replace with WordPress custom post type "Products"

### 3. Cart Management (`src/contexts/CartContext.tsx`)
- **Current**: localStorage-based cart persistence
- **Contains**: Add/remove items, quantity updates, total calculations
- **WordPress Integration**: Sync with WordPress user meta for persistent cart

### 4. Orders (Currently in Admin Panel)
- **Current**: Mock order data in AdminPanel component
- **Contains**: Order history, status tracking, client information
- **WordPress Integration**: WordPress custom post type "Orders"

## WordPress Integration Requirements

### WordPress Backend Setup

#### Required Plugins
```
1. Advanced Custom Fields (ACF) Pro
2. JWT Authentication for WP REST API
3. WP REST API Controller (Optional - for enhanced API control)
4. WooCommerce (Alternative approach - if you prefer e-commerce plugin)
```

#### Custom Post Types Needed
```php
// Add to functions.php or custom plugin

// Products Custom Post Type
function create_products_post_type() {
    register_post_type('products',
        array(
            'labels' => array(
                'name' => 'Products',
                'singular_name' => 'Product'
            ),
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'products',
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
        )
    );
}
add_action('init', 'create_products_post_type');

// Orders Custom Post Type
function create_orders_post_type() {
    register_post_type('orders',
        array(
            'labels' => array(
                'name' => 'Orders',
                'singular_name' => 'Order'
            ),
            'public' => false,
            'show_in_rest' => true,
            'rest_base' => 'orders',
            'supports' => array('title', 'editor', 'custom-fields'),
            'capability_type' => 'post',
            'capabilities' => array(
                'create_posts' => 'edit_posts',
                'edit_posts' => 'edit_posts',
                'edit_others_posts' => 'edit_others_posts',
                'publish_posts' => 'publish_posts',
                'read_private_posts' => 'read_private_posts',
            )
        )
    );
}
add_action('init', 'create_orders_post_type');
```

#### ACF Field Groups

**Product Fields:**
```
- product_category (Select: flour, oil, rice, beans, soap, etc.)
- product_image (Image)
- product_description (Textarea)
- product_sizes (Repeater)
  - size_name (Text: 2KG, 5KG, 10KG)
  - usd_price (Number)
  - zig_price (Number)
- in_stock (True/False)
```

**Order Fields:**
```
- client_name (Text)
- client_email (Email)
- order_items (Repeater)
  - item_name (Text)
  - item_quantity (Number)
  - item_price (Number)
- order_total (Number)
- order_status (Select: pending, processing, delivered)
- payment_status (Select: paid, unpaid)
- order_date (Date)
```

#### WordPress REST API Configuration

Add to `functions.php`:

```php
// Enable CORS for React app
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// Custom REST API endpoints
function register_custom_rest_routes() {
    
    // Authentication endpoint
    register_rest_route('bgl/v1', '/auth', array(
        'methods' => 'POST',
        'callback' => 'bgl_authenticate_user',
        'permission_callback' => '__return_true'
    ));
    
    // Cart endpoints
    register_rest_route('bgl/v1', '/cart', array(
        'methods' => 'GET',
        'callback' => 'bgl_get_user_cart',
        'permission_callback' => 'is_user_logged_in'
    ));
    
    register_rest_route('bgl/v1', '/cart', array(
        'methods' => 'POST',
        'callback' => 'bgl_update_user_cart',
        'permission_callback' => 'is_user_logged_in'
    ));
    
    // Order creation endpoint
    register_rest_route('bgl/v1', '/orders', array(
        'methods' => 'POST',
        'callback' => 'bgl_create_order',
        'permission_callback' => 'is_user_logged_in'
    ));
}
add_action('rest_api_init', 'register_custom_rest_routes');

// Authentication function
function bgl_authenticate_user($request) {
    $username = $request->get_param('username');
    $password = $request->get_param('password');
    $role = $request->get_param('role');
    
    $user = wp_authenticate($username, $password);
    
    if (is_wp_error($user)) {
        return new WP_Error('auth_failed', 'Invalid credentials', array('status' => 401));
    }
    
    // Check if user has the requested role
    if (!in_array($role, $user->roles)) {
        return new WP_Error('role_mismatch', 'User does not have the requested role', array('status' => 403));
    }
    
    // Generate JWT token (requires JWT plugin)
    $token = wp_generate_jwt_token($user);
    
    return array(
        'token' => $token,
        'user' => array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'role' => $role,
            'businessName' => get_user_meta($user->ID, 'business_name', true),
            'phone' => get_user_meta($user->ID, 'phone', true)
        )
    );
}

// Cart management functions
function bgl_get_user_cart($request) {
    $user_id = get_current_user_id();
    $cart = get_user_meta($user_id, 'bgl_cart', true);
    return $cart ? $cart : array();
}

function bgl_update_user_cart($request) {
    $user_id = get_current_user_id();
    $cart_data = $request->get_json_params();
    update_user_meta($user_id, 'bgl_cart', $cart_data);
    return array('success' => true);
}

// Order creation function
function bgl_create_order($request) {
    $user_id = get_current_user_id();
    $order_data = $request->get_json_params();
    
    $order_id = wp_insert_post(array(
        'post_type' => 'orders',
        'post_title' => 'Order #BGL-' . time(),
        'post_status' => 'publish',
        'post_author' => $user_id
    ));
    
    if ($order_id) {
        // Save order meta
        update_field('client_name', $order_data['client_name'], $order_id);
        update_field('client_email', $order_data['client_email'], $order_id);
        update_field('order_items', $order_data['items'], $order_id);
        update_field('order_total', $order_data['total'], $order_id);
        update_field('order_status', 'pending', $order_id);
        update_field('payment_status', 'unpaid', $order_id);
        update_field('order_date', date('Y-m-d'), $order_id);
        
        // Clear user cart
        delete_user_meta($user_id, 'bgl_cart');
        
        return array('success' => true, 'order_id' => $order_id);
    }
    
    return new WP_Error('order_failed', 'Failed to create order', array('status' => 500));
}
```

#### User Profile Fields

Add these meta fields to WordPress users:
```php
// Add custom user fields
function add_custom_user_fields($user) {
    ?>
    <h3>BGL Business Information</h3>
    <table class="form-table">
        <tr>
            <th><label for="business_name">Business Name</label></th>
            <td><input type="text" name="business_name" id="business_name" value="<?php echo esc_attr(get_user_meta($user->ID, 'business_name', true)); ?>" /></td>
        </tr>
        <tr>
            <th><label for="phone">Phone</label></th>
            <td><input type="text" name="phone" id="phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'phone', true)); ?>" /></td>
        </tr>
        <tr>
            <th><label for="user_role_bgl">BGL Role</label></th>
            <td>
                <select name="user_role_bgl" id="user_role_bgl">
                    <option value="wholesaler" <?php selected(get_user_meta($user->ID, 'user_role_bgl', true), 'wholesaler'); ?>>Wholesaler</option>
                    <option value="retailer" <?php selected(get_user_meta($user->ID, 'user_role_bgl', true), 'retailer'); ?>>Retailer</option>
                    <option value="admin" <?php selected(get_user_meta($user->ID, 'user_role_bgl', true), 'admin'); ?>>Admin</option>
                </select>
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'add_custom_user_fields');
add_action('edit_user_profile', 'add_custom_user_fields');

function save_custom_user_fields($user_id) {
    if (current_user_can('edit_user', $user_id)) {
        update_user_meta($user_id, 'business_name', $_POST['business_name']);
        update_user_meta($user_id, 'phone', $_POST['phone']);
        update_user_meta($user_id, 'user_role_bgl', $_POST['user_role_bgl']);
    }
}
add_action('personal_options_update', 'save_custom_user_fields');
add_action('edit_user_profile_update', 'save_custom_user_fields');
```

## React App Integration Steps

### Step 1: Install Additional Dependencies
```bash
npm install axios
```

### Step 2: Environment Configuration
Create `.env.local`:
```
VITE_WORDPRESS_API_URL=https://school.nhaka.online/connect/wp-json
VITE_BGL_API_URL=https://school.nhaka.online/connect/wp-json/bgl/v1
```

### Step 3: API Service Layer
Create `src/services/api.ts` for WordPress integration

### Step 4: Authentication System
Replace `src/data/users.ts` with WordPress JWT authentication

### Step 5: Product Management
Replace `src/data/products.ts` with WordPress API calls

### Step 6: Cart Integration
Update `src/contexts/CartContext.tsx` to sync with WordPress

### Step 7: Order Management
Update Admin Panel to use WordPress orders

### Step 8: User Management
Connect user profiles to WordPress user data

## Files That Need Modification

### Core Files to Update:
1. `src/contexts/AuthContext.tsx` - WordPress authentication
2. `src/contexts/CartContext.tsx` - WordPress cart sync
3. `src/data/products.ts` - Replace with API calls
4. `src/pages/AdminPanel.tsx` - WordPress order management
5. `src/pages/Products.tsx` - Dynamic product loading
6. `src/pages/Account.tsx` - WordPress user profile
7. `src/components/ProductCard.tsx` - Handle dynamic data

### New Files to Create:
1. `src/services/api.ts` - WordPress API service
2. `src/services/auth.ts` - Authentication service
3. `src/services/products.ts` - Product API service
4. `src/services/orders.ts` - Order management service
5. `src/hooks/useApi.ts` - Custom API hook
6. `src/types/wordpress.ts` - WordPress-specific types

## Testing Strategy

### Phase 1: Backend Setup
- [ ] WordPress installation configured
- [ ] Required plugins installed and activated
- [ ] Custom post types created
- [ ] ACF fields configured
- [ ] REST API endpoints tested with Postman
- [ ] CORS configuration working
- [ ] JWT authentication functional

### Phase 2: Frontend Integration
- [ ] API service layer implemented
- [ ] Authentication flow working
- [ ] Product data loading from WordPress
- [ ] Cart synchronization functional
- [ ] Order creation working
- [ ] Admin panel connected to WordPress data

### Phase 3: User Testing
- [ ] All user roles can login
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Orders can be created and managed
- [ ] Admin functions operational

## WordPress Database Schema

### Custom Tables (Optional)
If you need more complex cart functionality:

```sql
CREATE TABLE wp_bgl_cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES wp_users(ID),
    FOREIGN KEY (product_id) REFERENCES wp_posts(ID)
);
```

## Migration Checklist

### WordPress Setup (Week 1)
- [ ] Install WordPress at school.nhaka.online/connect/
- [ ] Install required plugins (ACF Pro, JWT Auth)
- [ ] Create custom post types (Products, Orders)
- [ ] Setup ACF field groups
- [ ] Configure REST API and CORS
- [ ] Import existing product data
- [ ] Create user accounts with proper roles
- [ ] Test all API endpoints

### React App Updates (Week 2)
- [ ] Install axios dependency
- [ ] Create API service layer
- [ ] Implement WordPress authentication
- [ ] Replace static product data with API calls
- [ ] Update cart to sync with WordPress
- [ ] Implement order creation functionality
- [ ] Update all components to handle loading states

### Advanced Features (Week 3)
- [ ] Complete admin panel WordPress integration
- [ ] Implement real-time cart updates
- [ ] Add proper error handling
- [ ] Setup user profile management
- [ ] Test all user roles and permissions

### Testing & Deployment (Week 4)
- [ ] Comprehensive testing of all features
- [ ] Performance optimization
- [ ] Security testing
- [ ] Production deployment
- [ ] User acceptance testing

## Support and Maintenance

### Regular Tasks:
- Monitor WordPress and plugin updates
- Backup database regularly
- Monitor API performance
- Update product inventory
- Process orders and customer communications

### Troubleshooting:
- Check WordPress error logs
- Monitor REST API responses
- Verify CORS configuration
- Test authentication tokens
- Validate ACF field data

## API Endpoints Reference

### WordPress Default Endpoints:
- `GET /wp-json/wp/v2/products` - Get products
- `POST /wp-json/wp/v2/products` - Create product
- `GET /wp-json/wp/v2/orders` - Get orders
- `POST /wp-json/wp/v2/orders` - Create order

### Custom BGL Endpoints:
- `POST /wp-json/bgl/v1/auth` - User authentication
- `GET /wp-json/bgl/v1/cart` - Get user cart
- `POST /wp-json/bgl/v1/cart` - Update user cart
- `POST /wp-json/bgl/v1/orders` - Create new order

---

**WordPress Backend URL**: https://school.nhaka.online/connect/
**React Frontend**: Will connect to WordPress via REST API
**Authentication**: JWT tokens for secure API access
**Data Flow**: React ↔ WordPress REST API ↔ MySQL Database
