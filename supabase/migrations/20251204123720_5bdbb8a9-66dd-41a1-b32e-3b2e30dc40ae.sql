-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending_payment', 'paid', 'approved', 'rejected', 'expired');

-- Create enum for signage type
CREATE TYPE public.signage_type AS ENUM ('billboard', 'banner', 'neon_sign', 'led_display', 'wall_mount', 'vehicle_wrap', 'other');

-- Create signage applications table
CREATE TABLE public.signage_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  signage_type signage_type NOT NULL,
  location TEXT,
  description TEXT,
  status application_status NOT NULL DEFAULT 'pending_payment',
  amount_due DECIMAL(10,2) DEFAULT 50000.00,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  payment_date TIMESTAMP WITH TIME ZONE,
  issued_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.signage_applications ENABLE ROW LEVEL SECURITY;

-- Public can view applications by application_id (for QR verification)
CREATE POLICY "Anyone can verify applications by ID" 
ON public.signage_applications 
FOR SELECT 
USING (true);

-- Public can insert new applications
CREATE POLICY "Anyone can submit applications" 
ON public.signage_applications 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_signage_applications_updated_at
BEFORE UPDATE ON public.signage_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.signage_applications;