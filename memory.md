# APPRIQA Project Memory & Architecture

**IMPORTANT:** Always read this file before making structural changes to the codebase to ensure consistency and prevent regressions.

## 1. Core Architecture & Constraints
- **Framework:** Next.js (App Router)
- **Database & Auth:** Supabase PostgreSQL & Supabase Auth.
- **OTP System:** MSG91 (for phone) and Supabase custom SMTP (for email). 
- **Payments:** Razorpay Server-Side Integration.
- **Shipping:** Shiprocket API (pending full integration).
- **Styling:** Tailwind CSS, Framer Motion for animations.
- **Language & Region Constraints:** 
  - **Currency:** Strictly Indian Rupee (INR / ₹) across the entire application (Products, Cart, Checkout, Wishlist, Admin).
  - **Design Language:** Premium, Deep Tech, Industrial, Dark Mode by default.

## 2. Authentication Flow
- **Policy:** Passwords are never collected or stored.
- **Login (`/login`):** Takes Email or Phone + OTP. 
- **Sign Up (`/signup`):** Takes First Name, Last Name, Email/Phone -> Verify OTP -> Creates Supabase account -> Generates Magic Link to automatically create session.
- **Forgot Password (`/forgot-password`):** Handled via OTP.

## 3. Database Schema Overview
- `users`: Core user table managed by Supabase Auth.
- `addresses`: User shipping/billing addresses. Uses triggers to enforce a single `is_default` address per user.
- `products`: Contains UUIDs for products, category, pricing, stock, etc.
- `orders`: Stores an immutable snapshot of the address, items, and total amount. Includes Razorpay `rzp_order_id`. Status tracks payment (pending -> paid) and shipping.

## 4. Key Pages & Workflows

### Public Pages
- **Navbar (`src/components/layout/Navbar.tsx`):**
  - Uses `isClient` to hydrate `wishlist` and `cartCount` safely. 
- **Contact & Queries (`/contact`):** 
  - 1-row, 2-column layout (Forms in Tabs on Left, Contact info on Right). 
  - FAQs hover-to-expand at the bottom.
- **Product Page (`/products/[slug]`):**
  - Uses `toggleWishlist` and `addToCart` from `CartContext`.
  - Pricing is rendered in INR using `Intl.NumberFormat("en-IN")`.
- **Wishlist (`/wishlist`):**
  - Reads `wishlist` (array of UUIDs) from `CartContext` (localStorage).
  - Shows INR for prices.
- **Cart (`/cart`):**
  - Calculates subtotal, tax, and shipping. Free shipping above ₹150. Shipping is ₹15 flat rate otherwise. Digital goods have free shipping.
- **Checkout (`/checkout`):**
  - Requires user to be logged in. 
  - Fetches existing addresses. Allows selecting an address.
  - Server-side calls `/api/checkout/create` to snapshot the cart and address, then creates a Razorpay order.
  - Finalized via `/api/checkout/verify`.

### Protected Pages (`/account/*`)
- **Dashboard (`/account`):** View profile.
- **Addresses (`/account/addresses`):** CRUD operations for addresses.
- **Orders (`/account/orders`):** Order history.

### Admin Pages (`/admin/*`)
- Uses Supabase Service Role for bypassing RLS to manage products, categories, users, and orders.
- Currency is strictly INR.
