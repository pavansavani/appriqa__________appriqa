
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

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
