CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  hashed_otp TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index on identifier and expires_at for quick lookups and rate-limiting
CREATE INDEX IF NOT EXISTS otps_identifier_idx ON public.otps(identifier);
CREATE INDEX IF NOT EXISTS otps_expires_at_idx ON public.otps(expires_at);

-- Set up Row Level Security (RLS)
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can manage all otps"
ON public.otps
FOR ALL
USING (auth.role() = 'service_role');

-- Disallow public access, API routes should use service role key
CREATE POLICY "Disallow public access to otps"
ON public.otps
FOR ALL
USING (false);
