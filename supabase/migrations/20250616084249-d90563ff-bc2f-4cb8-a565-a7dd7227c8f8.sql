
-- Create a table for subscriptions
CREATE TABLE public.subscriptions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  seats INTEGER NOT NULL DEFAULT 1,
  billing_date DATE NOT NULL,
  login_email TEXT,
  password TEXT,
  category TEXT NOT NULL DEFAULT 'Software',
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled')),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'RON')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for better performance
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_billing_date ON subscriptions(billing_date);

-- Add some sample data to match what's currently in the app
INSERT INTO subscriptions (name, price, seats, billing_date, login_email, password, category, total_paid, status, currency) VALUES
('Adobe Creative Suite', 52.99, 2, '2024-06-15', 'work@example.com', '••••••••', 'Design', 1200, 'active', 'USD'),
('Figma Pro', 12.00, 3, '2024-06-20', 'work@example.com', '••••••••', 'Design', 600, 'active', 'USD');
