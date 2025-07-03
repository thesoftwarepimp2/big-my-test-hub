
<?php
/**
 * Big Game Logistics WordPress Integration Setup
 * 
 * Add this code to your WordPress theme's functions.php file
 * or create a custom plugin with this code.
 * 
 * This file contains all the necessary WordPress customizations
 * for the BGL React app integration.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enable CORS for React app
 */
function bgl_add_cors_http_header() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'bgl_add_cors_http_header');

/**
 * Create Products Custom Post Type
 */
function bgl_create_products_post_type() {
    register_post_type('products', array(
        'labels' => array(
            'name' => 'Products',
            'singular_name' => 'Product',
            'add_new' => 'Add New Product',
            'add_new_item' => 'Add New Product',
            'edit_item' => 'Edit Product',
            'new_item' => 'New Product',
            'view_item' => 'View Product',
            'search_items' => 'Search Products',
            'not_found' => 'No Products found',
            'not_found_in_trash' => 'No Products found in Trash'
        ),
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'products',
        'query_var' => true,
        'rewrite' => array('slug' => 'products'),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'menu_position' => 20,
        'menu_icon' => 'dashicons-products',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
    ));
}
add_action('init', 'bgl_create_products_post_type');

/**
 * Create Orders Custom Post Type
 */
function bgl_create_orders_post_type() {
    register_post_type('orders', array(
        'labels' => array(
            'name' => 'Orders',
            'singular_name' => 'Order',
            'add_new' => 'Add New Order',
            'add_new_item' => 'Add New Order',
            'edit_item' => 'Edit Order',
            'new_item' => 'New Order',
            'view_item' => 'View Order',
            'search_items' => 'Search Orders',
            'not_found' => 'No Orders found',
            'not_found_in_trash' => 'No Orders found in Trash'
        ),
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'orders',
        'query_var' => true,
        'capability_type' => 'post',
        'has_archive' => false,
        'hierarchical' => false,
        'menu_position' => 21,
        'menu_icon' => 'dashicons-clipboard',
        'supports' => array('title', 'editor', 'custom-fields'),
        'capabilities' => array(
            'create_posts' => 'edit_posts',
            'edit_posts' => 'edit_posts',
            'edit_others_posts' => 'edit_others_posts',
            'publish_posts' => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        )
    ));
}
add_action('init', 'bgl_create_orders_post_type');

/**
 * Register Custom REST API Routes
 */
function bgl_register_custom_rest_routes() {
    // Authentication endpoint
    register_rest_route('bgl/v1', '/auth', array(
        'methods' => 'POST',
        'callback' => 'bgl_authenticate_user',
        'permission_callback' => '__return_true',
        'args' => array(
            'username' => array(
                'required' => true,
                'type' => 'string'
            ),
            'password' => array(
                'required' => true,
                'type' => 'string'
            ),
            'role' => array(
                'required' => true,
                'type' => 'string'
            )
        )
    ));
    
    // Cart endpoints
    register_rest_route('bgl/v1', '/cart', array(
        array(
            'methods' => 'GET',
            'callback' => 'bgl_get_user_cart',
            'permission_callback' => 'is_user_logged_in'
        ),
        array(
            'methods' => 'POST',
            'callback' => 'bgl_update_user_cart',
            'permission_callback' => 'is_user_logged_in'
        )
    ));
    
    // Order creation endpoint
    register_rest_route('bgl/v1', '/orders', array(
        'methods' => 'POST',
        'callback' => 'bgl_create_order',
        'permission_callback' => 'is_user_logged_in'
    ));
}
add_action('rest_api_init', 'bgl_register_custom_rest_routes');

/**
 * Custom authentication function
 */
function bgl_authenticate_user($request) {
    $username = sanitize_text_field($request->get_param('username'));
    $password = $request->get_param('password');
    $role = sanitize_text_field($request->get_param('role'));
    
    // Authenticate user
    $user = wp_authenticate($username, $password);
    
    if (is_wp_error($user)) {
        return new WP_Error('auth_failed', 'Invalid credentials', array('status' => 401));
    }
    
    // Check if user has the requested BGL role
    $user_bgl_role = get_user_meta($user->ID, 'user_role_bgl', true);
    if ($user_bgl_role !== $role) {
        return new WP_Error('role_mismatch', 'User does not have the requested role', array('status' => 403));
    }
    
    // Generate a simple token (in production, use proper JWT)
    $token = wp_generate_password(32, false);
    update_user_meta($user->ID, 'bgl_auth_token', $token);
    update_user_meta($user->ID, 'bgl_token_expires', time() + (24 * 60 * 60)); // 24 hours
    
    return array(
        'token' => $token,
        'user' => array(
            'id' => (string)$user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'role' => $role,
            'businessName' => get_user_meta($user->ID, 'business_name', true) ?: $user->display_name,
            'phone' => get_user_meta($user->ID, 'phone', true) ?: ''
        )
    );
}

/**
 * Cart management functions
 */
function bgl_get_user_cart($request) {
    $user_id = get_current_user_id();
    $cart = get_user_meta($user_id, 'bgl_cart', true);
    return $cart ? $cart : array();
}

function bgl_update_user_cart($request) {
    $user_id = get_current_user_id();
    $cart_data = $request->get_json_params();
    
    if (is_array($cart_data)) {
        update_user_meta($user_id, 'bgl_cart', $cart_data);
        return array('success' => true);
    }
    
    return new WP_Error('invalid_cart_data', 'Invalid cart data', array('status' => 400));
}

/**
 * Order creation function
 */
function bgl_create_order($request) {
    $user_id = get_current_user_id();
    $order_data = $request->get_json_params();
    
    if (!$order_data || !isset($order_data['items']) || !isset($order_data['total'])) {
        return new WP_Error('invalid_order_data', 'Invalid order data', array('status' => 400));
    }
    
    $user = get_userdata($user_id);
    $order_number = 'BGL-' . time() . '-' . $user_id;
    
    $order_id = wp_insert_post(array(
        'post_type' => 'orders',
        'post_title' => $order_number,
        'post_content' => 'Order created via React app',
        'post_status' => 'publish',
        'post_author' => $user_id
    ));
    
    if ($order_id && function_exists('update_field')) {
        // Save order meta using ACF
        update_field('client_name', $order_data['client_name'] ?: $user->display_name, $order_id);
        update_field('client_email', $order_data['client_email'] ?: $user->user_email, $order_id);
        update_field('order_items', $order_data['items'], $order_id);
        update_field('order_total', floatval($order_data['total']), $order_id);
        update_field('order_status', 'pending', $order_id);
        update_field('payment_status', 'unpaid', $order_id);
        update_field('order_date', date('Y-m-d'), $order_id);
        
        // Clear user cart
        delete_user_meta($user_id, 'bgl_cart');
        
        return array('success' => true, 'order_id' => $order_id, 'order_number' => $order_number);
    }
    
    return new WP_Error('order_failed', 'Failed to create order', array('status' => 500));
}

/**
 * Add custom user fields
 */
function bgl_add_custom_user_fields($user) {
    ?>
    <h3>BGL Business Information</h3>
    <table class="form-table">
        <tr>
            <th><label for="business_name">Business Name</label></th>
            <td><input type="text" name="business_name" id="business_name" value="<?php echo esc_attr(get_user_meta($user->ID, 'business_name', true)); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="phone">Phone</label></th>
            <td><input type="text" name="phone" id="phone" value="<?php echo esc_attr(get_user_meta($user->ID, 'phone', true)); ?>" class="regular-text" /></td>
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
add_action('show_user_profile', 'bgl_add_custom_user_fields');
add_action('edit_user_profile', 'bgl_add_custom_user_fields');

function bgl_save_custom_user_fields($user_id) {
    if (current_user_can('edit_user', $user_id)) {
        if (isset($_POST['business_name'])) {
            update_user_meta($user_id, 'business_name', sanitize_text_field($_POST['business_name']));
        }
        if (isset($_POST['phone'])) {
            update_user_meta($user_id, 'phone', sanitize_text_field($_POST['phone']));
        }
        if (isset($_POST['user_role_bgl'])) {
            update_user_meta($user_id, 'user_role_bgl', sanitize_text_field($_POST['user_role_bgl']));
        }
    }
}
add_action('personal_options_update', 'bgl_save_custom_user_fields');
add_action('edit_user_profile_update', 'bgl_save_custom_user_fields');

/**
 * Custom authentication check for API requests
 */
function bgl_authenticate_request($user) {
    if ($user) {
        return $user;
    }
    
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (strpos($auth_header, 'Bearer ') === 0) {
        $token = substr($auth_header, 7);
        
        // Find user by token
        $users = get_users(array(
            'meta_key' => 'bgl_auth_token',
            'meta_value' => $token,
            'number' => 1
        ));
        
        if (!empty($users)) {
            $user = $users[0];
            $token_expires = get_user_meta($user->ID, 'bgl_token_expires', true);
            
            if ($token_expires && time() < $token_expires) {
                wp_set_current_user($user->ID);
                return $user;
            }
        }
    }
    
    return $user;
}
add_filter('determine_current_user', 'bgl_authenticate_request');

/**
 * Ensure ACF fields are included in REST API responses
 */
function bgl_add_acf_to_rest_api() {
    // Add ACF fields to products
    register_rest_field('products', 'acf', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        }
    ));
    
    // Add ACF fields to orders
    register_rest_field('orders', 'acf', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        }
    ));
}
add_action('rest_api_init', 'bgl_add_acf_to_rest_api');

/**
 * Create sample data (run once after setup)
 */
function bgl_create_sample_data() {
    // Only run if no products exist
    $existing_products = get_posts(array('post_type' => 'products', 'numberposts' => 1));
    if (!empty($existing_products)) {
        return;
    }
    
    // Sample product data
    $sample_products = array(
        array(
            'title' => 'MEGA ROLLER FLOUR 10KG',
            'category' => 'flour',
            'description' => 'Premium quality all-purpose flour perfect for baking bread, cakes, and pastries',
            'sizes' => array(
                array('size_name' => '2KG', 'usd_price' => 4.50, 'zig_price' => 2250),
                array('size_name' => '5KG', 'usd_price' => 10.25, 'zig_price' => 5125),
                array('size_name' => '10KG', 'usd_price' => 18.50, 'zig_price' => 9250)
            ),
            'in_stock' => true
        ),
        // Add more sample products here...
    );
    
    foreach ($sample_products as $product_data) {
        $post_id = wp_insert_post(array(
            'post_type' => 'products',
            'post_title' => $product_data['title'],
            'post_content' => $product_data['description'],
            'post_status' => 'publish'
        ));
        
        if ($post_id && function_exists('update_field')) {
            update_field('product_category', $product_data['category'], $post_id);
            update_field('product_description', $product_data['description'], $post_id);
            update_field('product_sizes', $product_data['sizes'], $post_id);
            update_field('in_stock', $product_data['in_stock'], $post_id);
        }
    }
}

// Uncomment the line below to create sample data (run once)
// add_action('init', 'bgl_create_sample_data');

?>
