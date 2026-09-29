/*
# Create reservations table for Ziora By The Falls

1. New Tables
- `reservations` stores guest-submitted table requests from the public reservation form.
- `id` is the unique reservation identifier.
- `name`, `phone`, and `email` identify the guest so the restaurant can confirm the request.
- `date`, `time`, and `guests` capture the requested dining slot.
- `note` stores optional celebration, dietary, or accessibility context.
- `status` allows the restaurant to track a request without changing the guest-submitted details.
- `created_at` records when the request was received.

2. Security
- Row Level Security is enabled.
- Public guests may submit reservation requests without an account.
- Public guests may not read, update, or delete reservation records.
- Authenticated operators may read and update requests for restaurant operations.

3. Important Notes
- This is a single-venue, no-sign-in reservation flow.
- The public site only performs inserts; operational management can be added later without exposing guest data.
*/

CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  guests text NOT NULL,
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit reservations" ON public.reservations;
CREATE POLICY "Public can submit reservations"
ON public.reservations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Operators can view reservations" ON public.reservations;
CREATE POLICY "Operators can view reservations"
ON public.reservations FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Operators can update reservations" ON public.reservations;
CREATE POLICY "Operators can update reservations"
ON public.reservations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Operators can delete reservations" ON public.reservations;
CREATE POLICY "Operators can delete reservations"
ON public.reservations FOR DELETE
TO authenticated
USING (true);
