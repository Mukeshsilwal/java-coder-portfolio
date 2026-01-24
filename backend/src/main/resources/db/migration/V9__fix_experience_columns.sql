
-- Relax description length constraints to allow long text
ALTER TABLE experience ALTER COLUMN description TYPE TEXT;
ALTER TABLE experience ALTER COLUMN technologies_used TYPE TEXT;
ALTER TABLE experience ALTER COLUMN role TYPE VARCHAR(500);
ALTER TABLE experience ALTER COLUMN company_name TYPE VARCHAR(500);
