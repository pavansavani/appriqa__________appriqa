







CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  hashed_otp TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='otps' AND column_name='identifier') THEN
        ALTER TABLE public.otps ADD COLUMN identifier TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='otps' AND column_name='hashed_otp') THEN
        ALTER TABLE public.otps ADD COLUMN hashed_otp TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='otps' AND column_name='verified') THEN
        ALTER TABLE public.otps ADD COLUMN verified BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='otps' AND column_name='expires_at') THEN
        ALTER TABLE public.otps ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='otps' AND column_name='created_at') THEN
        ALTER TABLE public.otps ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Add index on identifier and expires_at for quick lookups and rate-limiting
CREATE INDEX IF NOT EXISTS otps_identifier_idx ON public.otps(identifier);
CREATE INDEX IF NOT EXISTS otps_expires_at_idx ON public.otps(expires_at);

-- Set up Row Level Security (RLS)
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
DROP POLICY IF EXISTS "Service role can manage all otps" ON public.otps;
CREATE POLICY "Service role can manage all otps"
ON public.otps
FOR ALL
USING (auth.role() = 'service_role');

-- Disallow public access, API routes should use service role key
DROP POLICY IF EXISTS "Disallow public access to otps" ON public.otps;
CREATE POLICY "Disallow public access to otps"
ON public.otps
FOR ALL
USING (false);


-- ==========================================
-- FINAL AUTHENTICATION & CUSTOMER SYSTEM
-- ==========================================

-- Ensure auth.users can be referenced cleanly if needed (Supabase manages auth.users)

-- ==========================================
-- PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    company_name TEXT,
    customer_type TEXT DEFAULT 'ecommerce',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'customer',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='auth_user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='first_name') THEN
        ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_name') THEN
        ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='company_name') THEN
        ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='customer_type') THEN
        ALTER TABLE public.profiles ADD COLUMN customer_type TEXT DEFAULT 'ecommerce';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'customer';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='status') THEN
        ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Safely alter table to add columns in case the table already existed but was missing them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='auth_user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='customer_type') THEN
        ALTER TABLE public.profiles ADD COLUMN customer_type TEXT DEFAULT 'ecommerce';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ==========================================
-- ADDRESSES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    address_type TEXT DEFAULT 'home',
    delivery_location_url TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='user_id') THEN
        ALTER TABLE public.addresses ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='full_name') THEN
        ALTER TABLE public.addresses ADD COLUMN full_name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='phone') THEN
        ALTER TABLE public.addresses ADD COLUMN phone TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='alternate_phone') THEN
        ALTER TABLE public.addresses ADD COLUMN alternate_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='address_line_1') THEN
        ALTER TABLE public.addresses ADD COLUMN address_line_1 TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='address_line_2') THEN
        ALTER TABLE public.addresses ADD COLUMN address_line_2 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='landmark') THEN
        ALTER TABLE public.addresses ADD COLUMN landmark TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='city') THEN
        ALTER TABLE public.addresses ADD COLUMN city TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='state') THEN
        ALTER TABLE public.addresses ADD COLUMN state TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='postal_code') THEN
        ALTER TABLE public.addresses ADD COLUMN postal_code TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='country') THEN
        ALTER TABLE public.addresses ADD COLUMN country TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='address_type') THEN
        ALTER TABLE public.addresses ADD COLUMN address_type TEXT DEFAULT 'home';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='delivery_location_url') THEN
        ALTER TABLE public.addresses ADD COLUMN delivery_location_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='is_default') THEN
        ALTER TABLE public.addresses ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='created_at') THEN
        ALTER TABLE public.addresses ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='addresses' AND column_name='updated_at') THEN
        ALTER TABLE public.addresses ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Trigger to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE public.addresses
        SET is_default = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS single_default_address_trigger ON public.addresses;
CREATE TRIGGER single_default_address_trigger
BEFORE INSERT OR UPDATE OF is_default
ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();

-- ==========================================
-- ORDERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'processing',
    shipping_status TEXT DEFAULT 'unshipped',
    
    -- Address Snapshot
    shipping_full_name TEXT,
    shipping_phone TEXT,
    shipping_address_line_1 TEXT,
    shipping_address_line_2 TEXT,
    shipping_landmark TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_postal_code TEXT,
    shipping_country TEXT,
    shipping_location_url TEXT,
    
    -- Totals
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_number') THEN
        ALTER TABLE public.orders ADD COLUMN order_number TEXT UNIQUE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_status') THEN
        ALTER TABLE public.orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_status') THEN
        ALTER TABLE public.orders ADD COLUMN order_status TEXT DEFAULT 'processing';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_status') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_status TEXT DEFAULT 'unshipped';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_full_name') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_phone') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_address_line_1') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_address_line_1 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_address_line_2') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_address_line_2 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_landmark') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_landmark TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_city') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_state') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_state TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_postal_code') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_postal_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_country') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_country TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_location_url') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_location_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='subtotal') THEN
        ALTER TABLE public.orders ADD COLUMN subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='discount') THEN
        ALTER TABLE public.orders ADD COLUMN discount NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_fee') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='tax') THEN
        ALTER TABLE public.orders ADD COLUMN tax NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total') THEN
        ALTER TABLE public.orders ADD COLUMN total NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='created_at') THEN
        ALTER TABLE public.orders ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='updated_at') THEN
        ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Safely add address snapshot columns to existing orders table if it existed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_full_name') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_full_name TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_phone TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_address_line_1 TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_address_line_2 TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_landmark TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_city TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_state TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_postal_code TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_country TEXT;
        ALTER TABLE public.orders ADD COLUMN shipping_location_url TEXT;
    END IF;
END $$;

-- ==========================================
-- ORDER ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='order_id') THEN
        ALTER TABLE public.order_items ADD COLUMN order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_id') THEN
        ALTER TABLE public.order_items ADD COLUMN product_id TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_name') THEN
        ALTER TABLE public.order_items ADD COLUMN product_name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='quantity') THEN
        ALTER TABLE public.order_items ADD COLUMN quantity INTEGER NOT NULL CHECK (quantity > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='price') THEN
        ALTER TABLE public.order_items ADD COLUMN price NUMERIC(10, 2) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='created_at') THEN
        ALTER TABLE public.order_items ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- ==========================================
-- CARTS & CART ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='carts' AND column_name='user_id') THEN
        ALTER TABLE public.carts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='carts' AND column_name='created_at') THEN
        ALTER TABLE public.carts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='carts' AND column_name='updated_at') THEN
        ALTER TABLE public.carts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='cart_id') THEN
        ALTER TABLE public.cart_items ADD COLUMN cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='product_id') THEN
        ALTER TABLE public.cart_items ADD COLUMN product_id TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='quantity') THEN
        ALTER TABLE public.cart_items ADD COLUMN quantity INTEGER NOT NULL CHECK (quantity > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='created_at') THEN
        ALTER TABLE public.cart_items ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='updated_at') THEN
        ALTER TABLE public.cart_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- ==========================================
-- PAYMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='order_id') THEN
        ALTER TABLE public.payments ADD COLUMN order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='razorpay_order_id') THEN
        ALTER TABLE public.payments ADD COLUMN razorpay_order_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='razorpay_payment_id') THEN
        ALTER TABLE public.payments ADD COLUMN razorpay_payment_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='razorpay_signature') THEN
        ALTER TABLE public.payments ADD COLUMN razorpay_signature TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='amount') THEN
        ALTER TABLE public.payments ADD COLUMN amount NUMERIC(10, 2) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='currency') THEN
        ALTER TABLE public.payments ADD COLUMN currency TEXT DEFAULT 'INR';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='status') THEN
        ALTER TABLE public.payments ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='created_at') THEN
        ALTER TABLE public.payments ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- ==========================================
-- SHIPMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT, -- e.g., 'shiprocket'
    shipment_id TEXT,
    awb TEXT,
    tracking_url TEXT,
    status TEXT DEFAULT 'pending',
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='order_id') THEN
        ALTER TABLE public.shipments ADD COLUMN order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='provider') THEN
        ALTER TABLE public.shipments ADD COLUMN provider TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='shipment_id') THEN
        ALTER TABLE public.shipments ADD COLUMN shipment_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='awb') THEN
        ALTER TABLE public.shipments ADD COLUMN awb TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='tracking_url') THEN
        ALTER TABLE public.shipments ADD COLUMN tracking_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='status') THEN
        ALTER TABLE public.shipments ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='estimated_delivery') THEN
        ALTER TABLE public.shipments ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='created_at') THEN
        ALTER TABLE public.shipments ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipments' AND column_name='updated_at') THEN
        ALTER TABLE public.shipments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- ==========================================
-- SERVICE REQUESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='user_id') THEN
        ALTER TABLE public.service_requests ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='title') THEN
        ALTER TABLE public.service_requests ADD COLUMN title TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='description') THEN
        ALTER TABLE public.service_requests ADD COLUMN description TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='status') THEN
        ALTER TABLE public.service_requests ADD COLUMN status TEXT DEFAULT 'open';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='type') THEN
        ALTER TABLE public.service_requests ADD COLUMN type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='created_at') THEN
        ALTER TABLE public.service_requests ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='updated_at') THEN
        ALTER TABLE public.service_requests ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- ==========================================
-- TRIGGERS: UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns 
        WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Addresses: users can perform all operations on their own addresses
DROP POLICY IF EXISTS "Users can manage own addresses" ON public.addresses;
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: users can read their own orders
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Order Items: users can read their own order items
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
CREATE POLICY "Users can read own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid())
);

-- Carts: users can manage own carts
DROP POLICY IF EXISTS "Users can manage own carts" ON public.carts;
CREATE POLICY "Users can manage own carts" ON public.carts FOR ALL USING (auth.uid() = user_id);

-- Cart Items: users can manage items in their carts
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid())
);

-- Service Requests: users can manage their own requests
DROP POLICY IF EXISTS "Users can manage own service requests" ON public.service_requests;
CREATE POLICY "Users can manage own service requests" ON public.service_requests FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- ABOUT PAGE DYNAMIC CONTENT SCHEMA
-- ==========================================

-- 1. About Settings (Key-Value Store for Sections)
CREATE TABLE IF NOT EXISTS public.appriqa_about_settings (
    section_key TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_about_settings' AND column_name='section_key') THEN
        ALTER TABLE public.appriqa_about_settings ADD COLUMN section_key TEXT PRIMARY KEY;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_about_settings' AND column_name='data') THEN
        ALTER TABLE public.appriqa_about_settings ADD COLUMN data JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_about_settings' AND column_name='created_at') THEN
        ALTER TABLE public.appriqa_about_settings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_about_settings' AND column_name='updated_at') THEN
        ALTER TABLE public.appriqa_about_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Seed default empty data so rows always exist for updates
INSERT INTO public.appriqa_about_settings (section_key, data)
VALUES 
    ('hero', '{}'),
    ('who_we_are', '{}'),
    ('story', '[]'),
    ('mission_vision', '{}'),
    ('what_we_build', '[]'),
    ('work_process', '[]'),
    ('why_choose_us', '[]'),
    ('technologies', '[]'),
    ('industries', '[]'),
    ('values', '[]'),
    ('cta', '{}'),
    ('seo', '{}')
ON CONFLICT (section_key) DO NOTHING;

-- 2. Team Members
CREATE TABLE IF NOT EXISTS public.appriqa_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='name') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='position') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN position TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='bio') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='photo_url') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN photo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='linkedin_url') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN linkedin_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='display_order') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='is_published') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='created_at') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_team_members' AND column_name='updated_at') THEN
        ALTER TABLE public.appriqa_team_members ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- 3. Milestones
CREATE TABLE IF NOT EXISTS public.appriqa_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='year') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN year TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='title') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN title TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='description') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='display_order') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='is_published') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='created_at') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_milestones' AND column_name='updated_at') THEN
        ALTER TABLE public.appriqa_milestones ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- 4. Partners
CREATE TABLE IF NOT EXISTS public.appriqa_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='name') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='category') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN category TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='description') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='logo_url') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN logo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='website_url') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN website_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='display_order') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='is_published') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='created_at') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appriqa_partners' AND column_name='updated_at') THEN
        ALTER TABLE public.appriqa_partners ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


-- Note: We are reusing `appriqa_showcase` for the Inside Appriqa Gallery.

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE public.appriqa_about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all About page content
DROP POLICY IF EXISTS "Public can read about settings" ON public.appriqa_about_settings;
CREATE POLICY "Public can read about settings" ON public.appriqa_about_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can read team members" ON public.appriqa_team_members;
CREATE POLICY "Public can read team members" ON public.appriqa_team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can read milestones" ON public.appriqa_milestones;
CREATE POLICY "Public can read milestones" ON public.appriqa_milestones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can read partners" ON public.appriqa_partners;
CREATE POLICY "Public can read partners" ON public.appriqa_partners FOR SELECT USING (true);

-- Allow authenticated admins to do everything (Assuming role-based access is handled by the API, 
-- but we can add basic auth checks if needed. For now, allow authenticated users or rely on API server).
DROP POLICY IF EXISTS "Authenticated users can manage about settings" ON public.appriqa_about_settings;
CREATE POLICY "Authenticated users can manage about settings" ON public.appriqa_about_settings FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can manage team members" ON public.appriqa_team_members;
CREATE POLICY "Authenticated users can manage team members" ON public.appriqa_team_members FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can manage milestones" ON public.appriqa_milestones;
CREATE POLICY "Authenticated users can manage milestones" ON public.appriqa_milestones FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can manage partners" ON public.appriqa_partners;
CREATE POLICY "Authenticated users can manage partners" ON public.appriqa_partners FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- TRIGGERS: UPDATED_AT
-- ==========================================
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY['appriqa_about_settings', 'appriqa_team_members', 'appriqa_milestones', 'appriqa_partners'])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;



-- ==========================================
-- PRODUCTS & INVENTORY SCHEMA
-- ==========================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='name') THEN
        ALTER TABLE public.categories ADD COLUMN name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='slug') THEN
        ALTER TABLE public.categories ADD COLUMN slug TEXT UNIQUE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='description') THEN
        ALTER TABLE public.categories ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='created_at') THEN
        ALTER TABLE public.categories ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name') THEN
        ALTER TABLE public.products ADD COLUMN name TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='created_at') THEN
        ALTER TABLE public.products ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;


DO $$
BEGIN
    -- Categories columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='name') THEN
        ALTER TABLE public.categories ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='slug') THEN
        ALTER TABLE public.categories ADD COLUMN slug TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='description') THEN
        ALTER TABLE public.categories ADD COLUMN description TEXT;
    END IF;

    -- Products columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sku') THEN
        ALTER TABLE public.products ADD COLUMN sku TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name') THEN
        ALTER TABLE public.products ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='slug') THEN
        ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_label') THEN
        ALTER TABLE public.products ADD COLUMN category_label TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='subcategory') THEN
        ALTER TABLE public.products ADD COLUMN subcategory TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='brand') THEN
        ALTER TABLE public.products ADD COLUMN brand TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price') THEN
        ALTER TABLE public.products ADD COLUMN price NUMERIC(10, 2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='compare_at_price') THEN
        ALTER TABLE public.products ADD COLUMN compare_at_price NUMERIC(10, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock') THEN
        ALTER TABLE public.products ADD COLUMN stock INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='material') THEN
        ALTER TABLE public.products ADD COLUMN material TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='color') THEN
        ALTER TABLE public.products ADD COLUMN color TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='weight') THEN
        ALTER TABLE public.products ADD COLUMN weight TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='short_description') THEN
        ALTER TABLE public.products ADD COLUMN short_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='description') THEN
        ALTER TABLE public.products ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='tags') THEN
        ALTER TABLE public.products ADD COLUMN tags TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='rating') THEN
        ALTER TABLE public.products ADD COLUMN rating NUMERIC(3, 2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='reviews_count') THEN
        ALTER TABLE public.products ADD COLUMN reviews_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_best_seller') THEN
        ALTER TABLE public.products ADD COLUMN is_best_seller BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_new_arrival') THEN
        ALTER TABLE public.products ADD COLUMN is_new_arrival BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='type') THEN
        ALTER TABLE public.products ADD COLUMN type TEXT DEFAULT 'physical';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='thumbnail') THEN
        ALTER TABLE public.products ADD COLUMN thumbnail TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='thumbnail_url') THEN
        ALTER TABLE public.products ADD COLUMN thumbnail_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='images') THEN
        ALTER TABLE public.products ADD COLUMN images TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='status') THEN
        ALTER TABLE public.products ADD COLUMN status TEXT DEFAULT 'published';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='product_type') THEN
        ALTER TABLE public.products ADD COLUMN product_type TEXT DEFAULT 'physical';
    END IF;
END $$;

-- ==========================================
-- PRODUCTS & CATEGORIES RLS
-- ==========================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published products" ON public.products;
CREATE POLICY "Public can read published products" ON public.products FOR SELECT USING (status = 'published');


-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO public.categories (name, slug) VALUES ('3D Printed Products', '3d-printed-products') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug) VALUES ('Acrylic Products', 'acrylic-products') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug) VALUES ('MDF Products', 'mdf-products') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug) VALUES ('DIY Project Kits', 'diy-project-kits') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug) VALUES ('Robotics Toys', 'robotics-toys') ON CONFLICT (slug) DO NOTHING;


INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP001', 'Personalized 3D Printed Name Plate', 'personalized-3d-printed-name-plate', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Name Plates', 'Appriqa', 499.0, 699.0, 120, 'PLA', 'Black', '180g',
    'Custom name plate for home and office', 'Custom name plate for home and office', ARRAY['name','custom','3d']::TEXT[], 4.8, 156, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP002', 'Custom Lithophane LED Lamp', 'custom-lithophane-led-lamp', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Lithophane', 'Appriqa', 1299.0, 1699.0, 45, 'PLA', 'White', '420g',
    'Personalized photo lithophane lamp', 'Personalized photo lithophane lamp', ARRAY['lithophane','gift']::TEXT[], 4.9, 84, true, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP003', 'Anime Character Figure', 'anime-character-figure', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Character Printing', 'Appriqa', 899.0, 1199.0, 70, 'PLA+', 'Multicolor', '250g',
    'High quality anime collectible figure', 'High quality anime collectible figure', ARRAY['anime','figure']::TEXT[], 4.7, 210, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP004', 'Custom Action Figure', 'custom-action-figure', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Character Printing', 'Appriqa', 2499.0, 2999.0, 25, 'Resin', 'Custom', '320g',
    'Custom figure from your photo', 'Custom figure from your photo', ARRAY['custom','figurine']::TEXT[], 4.9, 41, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP005', 'Acrylic LED Name Board', 'acrylic-led-name-board', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'LED Signs', 'Appriqa', 1799.0, 2399.0, 40, 'Acrylic', 'RGB', '550g',
    'Custom acrylic LED sign board', 'Custom acrylic LED sign board', ARRAY['acrylic','led']::TEXT[], 4.8, 92, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP006', 'Personalized Acrylic Keychain', 'personalized-acrylic-keychain', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Keychains', 'Appriqa', 199.0, 299.0, 500, 'Acrylic', 'Custom', '25g',
    'Laser engraved acrylic keychain', 'Laser engraved acrylic keychain', ARRAY['keychain','custom']::TEXT[], 4.6, 389, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP007', 'Acrylic Photo Frame', 'acrylic-photo-frame', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Photo Frames', 'Appriqa', 699.0, 999.0, 90, 'Clear Acrylic', 'Transparent', '280g',
    'Premium transparent acrylic frame', 'Premium transparent acrylic frame', ARRAY['frame','photo']::TEXT[], 4.7, 118, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP008', 'MDF Customized Wall Clock', 'mdf-customized-wall-clock', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Wall Clock', 'Appriqa', 999.0, 1399.0, 65, 'MDF', 'Brown', '450g',
    'Laser engraved MDF wall clock', 'Laser engraved MDF wall clock', ARRAY['mdf','clock']::TEXT[], 4.8, 104, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP009', 'MDF Photo Engraving Frame', 'mdf-photo-engraving-frame', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Photo Frame', 'Appriqa', 849.0, 1149.0, 55, 'MDF', 'Walnut', '400g',
    'Customized engraved wooden photo frame', 'Customized engraved wooden photo frame', ARRAY['mdf','gift']::TEXT[], 4.9, 75, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP010', 'Personalized MDF Name Board', 'personalized-mdf-name-board', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Name Board', 'Appriqa', 749.0, 999.0, 80, 'MDF', 'Natural Wood', '350g',
    'Custom MDF name board for home and office', 'Custom MDF name board for home and office', ARRAY['nameboard','mdf']::TEXT[], 4.8, 132, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP011', 'Personalized Acrylic Photo Lamp', 'personalized-acrylic-photo-lamp', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Photo Lamp', 'Appriqa', 1499.0, 1899.0, 40, 'Acrylic', 'Warm White', '600g',
    'Custom engraved acrylic LED photo lamp', 'Custom engraved acrylic LED photo lamp', ARRAY['acrylic','lamp','gift']::TEXT[], 4.8, 58, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP012', 'Acrylic QR Code Stand', 'acrylic-qr-code-stand', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Business Display', 'Appriqa', 599.0, 799.0, 110, 'Acrylic', 'Clear', '180g',
    'Custom QR payment stand for shops', 'Custom QR payment stand for shops', ARRAY['qr','business']::TEXT[], 4.7, 76, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP013', 'MDF Table Name Plate', 'mdf-table-name-plate', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Office Accessories', 'Appriqa', 449.0, 649.0, 95, 'MDF', 'Wood Finish', '220g',
    'Personalized MDF desk name plate', 'Personalized MDF desk name plate', ARRAY['office','nameplate']::TEXT[], 4.7, 61, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP014', 'MDF Family Name Board', 'mdf-family-name-board', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Home Decor', 'Appriqa', 1199.0, 1499.0, 38, 'MDF', 'Teak', '650g',
    'Custom family name board with laser engraving', 'Custom family name board with laser engraving', ARRAY['home','decor']::TEXT[], 4.9, 82, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP015', '3D Printed Pen Holder', '3d-printed-pen-holder', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Desk Accessories', 'Appriqa', 399.0, 549.0, 150, 'PLA', 'Black', '160g',
    'Modern geometric pen holder', 'Modern geometric pen holder', ARRAY['desk','office']::TEXT[], 4.6, 102, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP016', '3D Printed Mobile Stand', '3d-printed-mobile-stand', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Phone Accessories', 'Appriqa', 299.0, 449.0, 220, 'PLA', 'Black', '90g',
    'Foldable mobile phone stand', 'Foldable mobile phone stand', ARRAY['mobile','stand']::TEXT[], 4.8, 214, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP017', '3D Printed Cable Organizer', '3d-printed-cable-organizer', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Desk Accessories', 'Appriqa', 249.0, 349.0, 180, 'PLA', 'White', '80g',
    'Desk cable management clips', 'Desk cable management clips', ARRAY['cable','office']::TEXT[], 4.5, 145, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP018', 'Custom Lithophane Moon Lamp', 'custom-lithophane-moon-lamp', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Lithophane', 'Appriqa', 1799.0, 2299.0, 28, 'PLA', 'White', '520g',
    'Moon lamp with personalized lithophane photo', 'Moon lamp with personalized lithophane photo', ARRAY['moon','lithophane']::TEXT[], 4.9, 96, true, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP019', 'Mini Superhero Figure', 'mini-superhero-figure', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Character Printing', 'Appriqa', 699.0, 899.0, 85, 'PLA+', 'Multicolor', '140g',
    'Detailed superhero collectible model', 'Detailed superhero collectible model', ARRAY['superhero','figure']::TEXT[], 4.8, 169, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP020', 'Custom Pet 3D Figurine', 'custom-pet-3d-figurine', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Character Printing', 'Appriqa', 2199.0, 2699.0, 22, 'Resin', 'Custom', '350g',
    'Convert your pet photo into a realistic 3D figurine', 'Convert your pet photo into a realistic 3D figurine', ARRAY['pet','custom','gift']::TEXT[], 4.9, 47, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP021', 'Arduino Starter Kit', 'arduino-starter-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Arduino Kits', 'Appriqa', 1499.0, 1899.0, 85, 'Electronics Kit', 'Multi', '650g',
    'Complete beginner Arduino learning kit', 'Complete beginner Arduino learning kit', ARRAY['arduino','diy','starter']::TEXT[], 4.9, 245, true, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP022', 'Advanced Arduino Robotics Kit', 'advanced-arduino-robotics-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Arduino Kits', 'Appriqa', 2999.0, 3599.0, 40, 'Electronics Kit', 'Multi', '1.2kg',
    'Build multiple Arduino robotics projects', 'Build multiple Arduino robotics projects', ARRAY['arduino','robotics']::TEXT[], 4.8, 137, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP023', 'ESP32 IoT Starter Kit', 'esp32-iot-starter-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'ESP32 Kits', 'Appriqa', 1799.0, 2199.0, 70, 'Electronics Kit', 'Multi', '580g',
    'Learn IoT with ESP32 development board', 'Learn IoT with ESP32 development board', ARRAY['esp32','iot']::TEXT[], 4.8, 119, false, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP024', 'Smart Home IoT Kit', 'smart-home-iot-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'IoT Kits', 'Appriqa', 3499.0, 3999.0, 32, 'Electronics Kit', 'Multi', '1.4kg',
    'Create smart home automation projects', 'Create smart home automation projects', ARRAY['smart home','iot']::TEXT[], 4.9, 74, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP025', 'Line Follower Robot Kit', 'line-follower-robot-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Robotics Kits', 'Appriqa', 1299.0, 1599.0, 95, 'Electronics Kit', 'Multi', '500g',
    'DIY line follower robot project', 'DIY line follower robot project', ARRAY['robot','line follower']::TEXT[], 4.7, 214, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP026', 'Obstacle Avoiding Robot Kit', 'obstacle-avoiding-robot-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Robotics Kits', 'Appriqa', 1899.0, 2299.0, 65, 'Electronics Kit', 'Multi', '700g',
    'Build an autonomous obstacle avoiding robot', 'Build an autonomous obstacle avoiding robot', ARRAY['robot','ultrasonic']::TEXT[], 4.8, 143, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP027', 'Raspberry Pi Learning Kit', 'raspberry-pi-learning-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Raspberry Pi Kits', 'Appriqa', 4499.0, 5299.0, 28, 'Electronics Kit', 'Multi', '1.3kg',
    'Hands-on Raspberry Pi learning kit', 'Hands-on Raspberry Pi learning kit', ARRAY['raspberry pi','linux']::TEXT[], 4.9, 82, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP028', 'Electronics Sensor Kit', 'electronics-sensor-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Sensor Kits', 'Appriqa', 999.0, 1299.0, 180, 'Electronics Kit', 'Multi', '350g',
    'Collection of 37 popular electronic sensors', 'Collection of 37 popular electronic sensors', ARRAY['sensors','electronics']::TEXT[], 4.7, 265, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP029', 'Bluetooth Robot Car Kit', 'bluetooth-robot-car-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Robotics Kits', 'Appriqa', 2499.0, 2999.0, 44, 'Electronics Kit', 'Multi', '980g',
    'Control your robot using a mobile app', 'Control your robot using a mobile app', ARRAY['robot','bluetooth']::TEXT[], 4.8, 108, true, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP030', 'STEM Learning Electronics Kit', 'stem-learning-electronics-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'STEM Kits', 'Appriqa', 1599.0, 1999.0, 76, 'Electronics Kit', 'Multi', '620g',
    'STEM project kit for students and beginners', 'STEM project kit for students and beginners', ARRAY['stem','education']::TEXT[], 4.8, 154, false, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP031', 'Premium Gear Fidget Toy', 'premium-gear-fidget-toy', (SELECT id FROM public.categories WHERE slug = 'robotics-toys'), 'Robotics Toys', 'Fidget Toys', 'Appriqa', 399.0, 599.0, 180, 'PLA', 'Black', '120g',
    'Smooth rotating mechanical gear fidget toy', 'Smooth rotating mechanical gear fidget toy', ARRAY['fidget','gear','toy']::TEXT[], 4.7, 132, false, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP032', 'Robot Arm DIY Kit', 'robot-arm-diy-kit', (SELECT id FROM public.categories WHERE slug = 'diy-project-kits'), 'DIY Project Kits', 'Robotics Kits', 'Appriqa', 3499.0, 4299.0, 35, 'Electronics Kit', 'Multi', '1.6kg',
    'Build and control your own robotic arm', 'Build and control your own robotic arm', ARRAY['robot arm','diy']::TEXT[], 4.9, 56, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP033', '3D Printed Chess Set', '3d-printed-chess-set', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Games & Toys', 'Appriqa', 999.0, 1299.0, 60, 'PLA', 'White & Black', '650g',
    'Modern 3D printed chess set with storage', 'Modern 3D printed chess set with storage', ARRAY['chess','board game']::TEXT[], 4.8, 91, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP034', 'Custom Corporate Trophy', 'custom-corporate-trophy', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Awards & Trophies', 'Appriqa', 1199.0, 1599.0, 70, 'Acrylic', 'Clear', '500g',
    'Personalized acrylic trophy with logo', 'Personalized acrylic trophy with logo', ARRAY['trophy','award']::TEXT[], 4.9, 77, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP035', 'MDF Wall Art Panel', 'mdf-wall-art-panel', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Wall Decor', 'Appriqa', 1499.0, 1899.0, 48, 'MDF', 'Wood Finish', '850g',
    'Decorative laser-cut MDF wall art', 'Decorative laser-cut MDF wall art', ARRAY['panel','decor']::TEXT[], 4.8, 68, true, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP036', '3D Printed Plant Pot', '3d-printed-plant-pot', (SELECT id FROM public.categories WHERE slug = '3d-printed-products'), '3D Printed Products', 'Home Decor', 'Appriqa', 599.0, 799.0, 140, 'PLA', 'Green', '260g',
    'Modern geometric planter for indoor plants', 'Modern geometric planter for indoor plants', ARRAY['plant','pot']::TEXT[], 4.6, 149, false, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP037', 'Custom Acrylic Business Logo', 'custom-acrylic-business-logo', (SELECT id FROM public.categories WHERE slug = 'acrylic-products'), 'Acrylic Products', 'Business Signage', 'Appriqa', 2499.0, 2999.0, 32, 'Acrylic', 'Custom', '1.2kg',
    'Custom acrylic company logo with mounting', 'Custom acrylic company logo with mounting', ARRAY['logo','business']::TEXT[], 4.9, 42, true, true, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP038', 'Personalized MDF Photo Clock', 'personalized-mdf-photo-clock', (SELECT id FROM public.categories WHERE slug = 'mdf-products'), 'MDF Products', 'Home Decor', 'Appriqa', 1299.0, 1699.0, 55, 'MDF', 'Brown', '700g',
    'Wall clock with your favorite photo', 'Wall clock with your favorite photo', ARRAY['photo','clock','gift']::TEXT[], 4.8, 86, false, true, false, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (
    sku, name, slug, category_id, category_label, subcategory, brand, price, compare_at_price, stock, material, color, weight,
    short_description, description, tags, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, type, thumbnail, status
) VALUES (
    'APP040', 'Robot Dog STEM Kit', 'robot-dog-stem-kit', (SELECT id FROM public.categories WHERE slug = 'robotics-toys'), 'Robotics Toys', 'STEM Robots', 'Appriqa', 3999.0, 4799.0, 24, 'Electronics Kit', 'Multi', '1.8kg',
    'Programmable walking robot dog for STEM learning', 'Programmable walking robot dog for STEM learning', ARRAY['robot dog','stem']::TEXT[], 4.9, 39, true, false, true, 'physical', '/images/home-hero.png', 'published'
) ON CONFLICT (sku) DO NOTHING;
