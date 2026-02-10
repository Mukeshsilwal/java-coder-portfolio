-- Rename institution_name to institution
ALTER TABLE education RENAME COLUMN institution_name TO institution;

-- Add new columns
ALTER TABLE education ADD COLUMN location VARCHAR(255);
ALTER TABLE education ADD COLUMN start_date DATE;
ALTER TABLE education ADD COLUMN end_date DATE;
ALTER TABLE education ADD COLUMN status VARCHAR(50);
ALTER TABLE education ADD COLUMN certificate_url TEXT;
ALTER TABLE education ADD COLUMN order_index INT;
ALTER TABLE education ADD COLUMN visible BOOLEAN DEFAULT TRUE;
ALTER TABLE education ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE education ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Migrate existing data (year to date, assuming Jan 1st)
UPDATE education SET start_date = TO_DATE(start_year::text || '-01-01', 'YYYY-MM-DD') WHERE start_year IS NOT NULL;
UPDATE education SET end_date = TO_DATE(end_year::text || '-01-01', 'YYYY-MM-DD') WHERE end_year IS NOT NULL;

-- Drop old columns
ALTER TABLE education DROP COLUMN start_year;
ALTER TABLE education DROP COLUMN end_year;
ALTER TABLE education DROP COLUMN field_of_study;
