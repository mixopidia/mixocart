# Mixocart E-Commerce - Database Schema Documentation

**Database:** MySQL 8.0+  
**Charset:** utf8mb4_unicode_ci  
**Last Updated:** November 14, 2025  
**Schema Version:** 1.0 (Partial Implementation)

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Existing Tables](#existing-tables)
3. [Missing Tables (Critical)](#missing-tables-critical)
4. [Recommended Tables](#recommended-tables)
5. [Entity Relationships](#entity-relationships)
6. [Indexes & Performance](#indexes--performance)
7. [Sample Data](#sample-data)
8. [Migration Status](#migration-status)

---

## 1. OVERVIEW

### Current Database Status

| Category | Implemented | Missing | Total |
|----------|-------------|---------|-------|
| **Core Tables** | 2 | 4 | 6 |
| **E-commerce Tables** | 0 | 10 | 10 |
| **System Tables** | 3 | 0 | 3 |
| **Overall** | 5 | 14 | 19 |

**Completion:** 26% (5/19 critical tables)

### Database Structure Overview

```
Existing Tables:
├── users                          ✅ Complete
├── roles                          ✅ Complete
├── personal_access_tokens         ✅ Complete (Sanctum)
├── password_reset_tokens          ✅ Complete (Laravel)
└── failed_jobs                    ✅ Complete (Laravel)

Missing Tables (Critical):
├── products                       ❌ Not created
├── categories                     ❌ Not created
├── orders                         ❌ Not created
├── order_items                    ❌ Not created
├── cart                           ❌ Not created
└── cart_items                     ❌ Not created
```

---

## 2. EXISTING TABLES

### 2.1 `users` Table

**Purpose:** Store user accounts for customers and administrators

**Schema:**
```sql
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `email_verified_at` TIMESTAMP NULL,
    `password` VARCHAR(255) NOT NULL,
    `role_id` BIGINT UNSIGNED NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL,
    INDEX `users_email_index` (`email`),
    INDEX `users_role_id_index` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**

| Field | Type | Null | Description |
|-------|------|------|-------------|
| `id` | BIGINT UNSIGNED | No | Primary key |
| `name` | VARCHAR(255) | No | User's full name |
| `email` | VARCHAR(255) | No | Unique email address |
| `email_verified_at` | TIMESTAMP | Yes | Email verification timestamp |
| `password` | VARCHAR(255) | No | Hashed password (bcrypt) |
| `role_id` | BIGINT UNSIGNED | Yes | FK to roles table |
| `remember_token` | VARCHAR(100) | Yes | Laravel remember token |
| `created_at` | TIMESTAMP | Yes | Record creation time |
| `updated_at` | TIMESTAMP | Yes | Last update time |

**Relationships:**
- `belongsTo` Role (role_id → roles.id)
- `hasMany` Orders (future)
- `hasMany` Reviews (future)
- `hasOne` Cart (future)
- `hasMany` Addresses (future)

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `role_id`

**Sample Data:**
```sql
INSERT INTO users (name, email, password, role_id) VALUES
('Admin User', 'admin@mixocart.com', '$2y$10$...', 1),
('John Customer', 'john@example.com', '$2y$10$...', 2);
```

---

### 2.2 `roles` Table

**Purpose:** Store user roles and permissions for role-based access control

**Schema:**
```sql
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT NULL,
    `permissions` JSON NULL,
    `status` BOOLEAN DEFAULT TRUE,
    `created_by` BIGINT UNSIGNED NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    
    INDEX `roles_slug_index` (`slug`),
    INDEX `roles_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**

| Field | Type | Null | Description |
|-------|------|------|-------------|
| `id` | BIGINT UNSIGNED | No | Primary key |
| `name` | VARCHAR(255) | No | Role name (unique) |
| `slug` | VARCHAR(255) | No | URL-friendly slug |
| `description` | TEXT | Yes | Role description |
| `permissions` | JSON | Yes | Array of permission keys |
| `status` | BOOLEAN | No | Active/inactive (default: true) |
| `created_by` | BIGINT UNSIGNED | Yes | User who created |
| `updated_by` | BIGINT UNSIGNED | Yes | User who last updated |
| `created_at` | TIMESTAMP | Yes | Creation timestamp |
| `updated_at` | TIMESTAMP | Yes | Last update timestamp |
| `deleted_at` | TIMESTAMP | Yes | Soft delete timestamp |

**Relationships:**
- `hasMany` Users (users.role_id → roles.id)
- `belongsTo` User (created_by → users.id)
- `belongsTo` User (updated_by → users.id)

**Permissions Example:**
```json
[
  "users.view",
  "users.create",
  "users.edit",
  "users.delete",
  "products.manage",
  "orders.view",
  "orders.manage"
]
```

**Sample Data:**
```sql
INSERT INTO roles (name, slug, description, status) VALUES
('Administrator', 'administrator', 'Full system access', TRUE),
('Customer', 'customer', 'Regular customer access', TRUE),
('Store Manager', 'store-manager', 'Manage products and orders', TRUE);
```

---

### 2.3 `personal_access_tokens` Table

**Purpose:** Laravel Sanctum API token storage

**Schema:**
```sql
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) UNIQUE NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP NULL,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    INDEX `personal_access_tokens_tokenable_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Purpose:** Stores API authentication tokens created by Laravel Sanctum

---

### 2.4 `password_reset_tokens` Table

**Purpose:** Store password reset tokens

**Schema:**
```sql
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) PRIMARY KEY,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL,
    
    INDEX `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.5 `failed_jobs` Table

**Purpose:** Laravel queue failed jobs tracking

**Schema:**
```sql
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(255) UNIQUE NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. MISSING TABLES (CRITICAL)

### 3.1 `products` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `products` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `sku` VARCHAR(100) UNIQUE NULL,
    `description` TEXT NULL,
    `short_description` VARCHAR(500) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `sale_price` DECIMAL(10, 2) NULL,
    `cost_price` DECIMAL(10, 2) NULL,
    `stock_quantity` INT DEFAULT 0,
    `low_stock_threshold` INT DEFAULT 5,
    `weight` DECIMAL(8, 2) NULL,
    `dimensions` VARCHAR(100) NULL,
    `images` JSON NULL,
    `featured_image` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    `featured` BOOLEAN DEFAULT FALSE,
    `is_new` BOOLEAN DEFAULT FALSE,
    `is_bestseller` BOOLEAN DEFAULT FALSE,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` TEXT NULL,
    `meta_keywords` TEXT NULL,
    `views_count` INT DEFAULT 0,
    `sales_count` INT DEFAULT 0,
    `rating_average` DECIMAL(3, 2) DEFAULT 0.00,
    `rating_count` INT DEFAULT 0,
    `created_by` BIGINT UNSIGNED NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    INDEX `products_category_id_index` (`category_id`),
    INDEX `products_slug_index` (`slug`),
    INDEX `products_sku_index` (`sku`),
    INDEX `products_status_index` (`status`),
    INDEX `products_featured_index` (`featured`),
    FULLTEXT INDEX `products_search_index` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Fields:**
- `price`: Regular selling price
- `sale_price`: Discounted price (nullable)
- `stock_quantity`: Available inventory
- `images`: JSON array of image URLs
- `status`: Product availability status
- `featured`: Show in featured section

**Relationships:**
- `belongsTo` Category
- `hasMany` OrderItems
- `hasMany` CartItems
- `hasMany` Reviews
- `belongsToMany` Attributes (future)

---

### 3.2 `categories` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `icon` VARCHAR(100) NULL,
    `status` BOOLEAN DEFAULT TRUE,
    `sort_order` INT DEFAULT 0,
    `featured` BOOLEAN DEFAULT FALSE,
    `products_count` INT DEFAULT 0,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` TEXT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
    INDEX `categories_parent_id_index` (`parent_id`),
    INDEX `categories_slug_index` (`slug`),
    INDEX `categories_status_index` (`status`),
    INDEX `categories_sort_order_index` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Features:**
- Hierarchical (self-referencing parent_id)
- Support for subcategories
- Sortable (sort_order)
- Can be featured on homepage

**Relationships:**
- `belongsTo` Category (parent)
- `hasMany` Categories (children)
- `hasMany` Products

---

### 3.3 `orders` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL,
    `order_number` VARCHAR(50) UNIQUE NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `shipping_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    `payment_status` ENUM('unpaid', 'paid', 'partially_paid', 'refunded') DEFAULT 'unpaid',
    `payment_method` VARCHAR(50) NULL,
    `payment_transaction_id` VARCHAR(255) NULL,
    `shipping_method` VARCHAR(100) NULL,
    `tracking_number` VARCHAR(255) NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(50) NULL,
    `shipping_address` JSON NOT NULL,
    `billing_address` JSON NULL,
    `notes` TEXT NULL,
    `admin_notes` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `placed_at` TIMESTAMP NULL,
    `paid_at` TIMESTAMP NULL,
    `shipped_at` TIMESTAMP NULL,
    `delivered_at` TIMESTAMP NULL,
    `cancelled_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `orders_user_id_index` (`user_id`),
    INDEX `orders_order_number_index` (`order_number`),
    INDEX `orders_status_index` (`status`),
    INDEX `orders_payment_status_index` (`payment_status`),
    INDEX `orders_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Address JSON Format:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address_line_1": "123 Main St",
  "address_line_2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

**Relationships:**
- `belongsTo` User
- `hasMany` OrderItems
- `hasMany` OrderStatusHistories (future)

---

### 3.4 `order_items` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `order_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_sku` VARCHAR(100) NULL,
    `product_image` VARCHAR(255) NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(10, 2) NOT NULL,
    `attributes` JSON NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT,
    INDEX `order_items_order_id_index` (`order_id`),
    INDEX `order_items_product_id_index` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Features:**
- Stores product snapshot at time of order
- Maintains product name/price even if original product changes
- JSON attributes for product variants

**Relationships:**
- `belongsTo` Order
- `belongsTo` Product

---

### 3.5 `cart` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `cart` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED UNIQUE NULL,
    `session_id` VARCHAR(255) UNIQUE NULL,
    `coupon_code` VARCHAR(50) NULL,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `subtotal` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(10, 2) DEFAULT 0.00,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `cart_user_id_index` (`user_id`),
    INDEX `cart_session_id_index` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Features:**
- Supports both authenticated (user_id) and guest (session_id) carts
- Stores coupon/discount information
- Auto-calculates totals

**Relationships:**
- `belongsTo` User (optional)
- `hasMany` CartItems

---

### 3.6 `cart_items` Table

**Priority:** 🔴 CRITICAL  
**Status:** ❌ Not Created

**Proposed Schema:**
```sql
CREATE TABLE `cart_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cart_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `attributes` JSON NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `cart_items_cart_id_index` (`cart_id`),
    INDEX `cart_items_product_id_index` (`product_id`),
    UNIQUE KEY `cart_product_unique` (`cart_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Features:**
- One cart item per product per cart (enforced by unique constraint)
- Stores current price snapshot
- JSON attributes for product variants/options

**Relationships:**
- `belongsTo` Cart
- `belongsTo` Product

---

## 4. RECOMMENDED TABLES

### 4.1 `reviews` Table

**Priority:** 🟡 Medium  
**Status:** ❌ Not Created

```sql
CREATE TABLE `reviews` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `rating` TINYINT NOT NULL,
    `title` VARCHAR(255) NULL,
    `comment` TEXT NULL,
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `verified_purchase` BOOLEAN DEFAULT FALSE,
    `helpful_count` INT DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL,
    INDEX `reviews_product_id_index` (`product_id`),
    INDEX `reviews_user_id_index` (`user_id`),
    INDEX `reviews_status_index` (`status`)
);
```

---

### 4.2 `addresses` Table

**Priority:** 🟡 Medium

```sql
CREATE TABLE `addresses` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `label` VARCHAR(50) NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `address_line_1` VARCHAR(255) NOT NULL,
    `address_line_2` VARCHAR(255) NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `addresses_user_id_index` (`user_id`)
);
```

---

### 4.3 `coupons` Table

**Priority:** 🟡 Medium

```sql
CREATE TABLE `coupons` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) UNIQUE NOT NULL,
    `type` ENUM('percentage', 'fixed_amount') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `min_purchase_amount` DECIMAL(10, 2) NULL,
    `max_discount_amount` DECIMAL(10, 2) NULL,
    `usage_limit` INT NULL,
    `usage_count` INT DEFAULT 0,
    `starts_at` TIMESTAMP NULL,
    `expires_at` TIMESTAMP NULL,
    `status` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    INDEX `coupons_code_index` (`code`),
    INDEX `coupons_status_index` (`status`)
);
```

---

### 4.4 `wishlists` Table

**Priority:** 🟡 Medium

```sql
CREATE TABLE `wishlists` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `wishlist_unique` (`user_id`, `product_id`)
);
```

---

## 5. ENTITY RELATIONSHIPS

### ER Diagram (Text)

```
users
├── (1) ──────┬──── (many) orders
│             ├──── (many) reviews
│             ├──── (many) addresses
│             ├──── (many) wishlists
│             └──── (1) cart
├── (many) ── (1) roles
│
products
├── (many) ── (1) categories
├── (1) ───── (many) order_items
├── (1) ───── (many) cart_items
├── (1) ───── (many) reviews
└── (many) ── (many) attributes [future]

orders
├── (1) ───── (many) order_items
└── (many) ── (1) users

cart
├── (1) ───── (many) cart_items
└── (1) ───── (1) users [optional]

categories
├── (many) ── (1) parent_category [self-reference]
└── (1) ───── (many) products
```

---

## 6. INDEXES & PERFORMANCE

### Primary Indexes (Already Applied)

| Table | Index | Type | Columns |
|-------|-------|------|---------|
| users | PRIMARY | PRIMARY | id |
| users | UNIQUE | UNIQUE | email |
| users | INDEX | INDEX | role_id |
| roles | PRIMARY | PRIMARY | id |
| roles | UNIQUE | UNIQUE | name, slug |

### Recommended Indexes (For Future Tables)

| Table | Index Name | Type | Columns | Purpose |
|-------|-----------|------|---------|---------|
| products | products_search | FULLTEXT | name, description | Full-text search |
| products | products_category | INDEX | category_id | Category filtering |
| products | products_featured | INDEX | featured, status | Homepage queries |
| orders | orders_user_date | INDEX | user_id, created_at | User order history |
| orders | orders_status | INDEX | status | Admin filtering |

---

## 7. SAMPLE DATA

### Create Roles
```sql
INSERT INTO roles (name, slug, description, status) VALUES
('Administrator', 'administrator', 'Full system access', TRUE),
('Customer', 'customer', 'Regular customer', TRUE);
```

### Create Users
```sql
INSERT INTO users (name, email, password, role_id) VALUES
('Admin User', 'admin@mixocart.com', '$2y$10$...', 1),
('John Doe', 'john@example.com', '$2y$10$...', 2);
```

---

## 8. MIGRATION STATUS

### Completed Migrations

- [x] 2014_10_12_000000_create_users_table
- [x] 2014_10_12_100000_create_password_reset_tokens_table
- [x] 2019_08_19_000000_create_failed_jobs_table
- [x] 2019_12_14_000001_create_personal_access_tokens_table
- [x] 2024_01_01_000001_create_roles_table
- [x] 2025_11_11_073243_add_role_id_to_users_table
- [x] 2025_11_11_074930_add_missing_columns_to_roles_table

### Pending Migrations (Critical)

- [ ] create_categories_table
- [ ] create_products_table
- [ ] create_cart_table
- [ ] create_cart_items_table
- [ ] create_orders_table
- [ ] create_order_items_table

### Pending Migrations (Recommended)

- [ ] create_reviews_table
- [ ] create_addresses_table
- [ ] create_coupons_table
- [ ] create_wishlists_table
- [ ] create_product_images_table
- [ ] create_attributes_table
- [ ] create_attribute_values_table

---

## 📝 CONCLUSION

### Database Completion: 26% (5/19 critical tables)

**Next Steps:**
1. Create product/category migrations
2. Create order/cart migrations
3. Seed sample data for testing
4. Add full-text search indexes
5. Optimize for performance

**Priority Order:**
1. 🔴 categories
2. 🔴 products
3. 🔴 cart, cart_items
4. 🔴 orders, order_items
5. 🟡 reviews, addresses, coupons

---

**Documentation Version:** 1.0  
**Last Updated:** November 14, 2025

