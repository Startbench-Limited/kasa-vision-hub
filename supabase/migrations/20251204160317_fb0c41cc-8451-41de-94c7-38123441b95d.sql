-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can verify applications by ID" ON public.signage_applications;

-- Create admin-only SELECT policy for full access
CREATE POLICY "Admins can view all applications"
ON public.signage_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a secure function for public verification by application_id
-- This returns only the necessary fields for verification, not sensitive data
CREATE OR REPLACE FUNCTION public.verify_application(p_application_id text)
RETURNS TABLE (
  application_id text,
  business_name text,
  signage_type signage_type,
  location text,
  status application_status,
  amount_due numeric,
  amount_paid numeric,
  payment_date timestamptz,
  issued_date timestamptz,
  expiry_date timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    application_id,
    business_name,
    signage_type,
    location,
    status,
    amount_due,
    amount_paid,
    payment_date,
    issued_date,
    expiry_date
  FROM public.signage_applications
  WHERE application_id = p_application_id
  LIMIT 1;
$$;