-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Listing enums
CREATE TYPE public.listing_type AS ENUM ('sale', 'rent');

-- Properties
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'GHS',
  location text NOT NULL,
  listing_type public.listing_type NOT NULL DEFAULT 'sale',
  bedrooms integer,
  payment_plan text,
  description text,
  video_url text,
  thumbnail_url text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view properties"
ON public.properties FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert properties"
ON public.properties FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update properties"
ON public.properties FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete properties"
ON public.properties FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Inquiries
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view inquiries"
ON public.inquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER properties_set_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed sample listings
INSERT INTO public.properties (title, price, currency, location, listing_type, bedrooms, payment_plan, description, featured)
VALUES
('2 Bedroom Apartment', 95000, 'USD', 'West Hills Axis, Accra', 'sale', 2, '2 Years Payment Plan', 'Modern 2 bedroom apartment along the West Hills Axis. Tiled floors, fitted kitchen, ample parking and 24/7 security. Flexible 2 year payment plan available.', true),
('5 Bedroom Duplex', 3500, 'GHS', 'Kasoa Opeikuma Junction', 'rent', 5, 'Monthly rent, 1 year advance', 'Spacious 5 bedroom duplex at Kasoa Opeikuma Junction. All rooms en-suite, large compound, boys quarters and borehole water supply.', true),
('Executive House', 350000, 'USD', 'Tuba Kasoa Road', 'sale', 4, 'Outright purchase or 12 month plan', 'Executive family house sitting on a walled plot along the Tuba Kasoa road. Finished to a high standard with a private garden.', true),
('Family Property', 750000, 'GHS', 'Fetteh Kakraba Nkwantanan', 'sale', 3, 'Negotiable payment plan', 'Beautiful family property at Fetteh Kakraba Nkwantanan. Interlocked driveway, spacious living area and easy access to the main road.', true);