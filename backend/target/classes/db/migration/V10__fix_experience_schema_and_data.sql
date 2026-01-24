-- 1. Ensure columns exist (Postgres 9.6+)
ALTER TABLE experience ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS job_type VARCHAR(50);
ALTER TABLE experience ADD COLUMN IF NOT EXISTS display_order INT;

-- 2. Migrate data for job_type from employment_type
UPDATE experience 
SET job_type = employment_type 
WHERE job_type IS NULL AND employment_type IS NOT NULL;

-- 3. Create technologies table if not exists
CREATE TABLE IF NOT EXISTS experience_technologies (
    experience_id UUID NOT NULL,
    technology VARCHAR(255),
    CONSTRAINT fk_experience_technologies_experience FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

-- 4. Migrate technologies (Split comma separated string) from technologies_used
INSERT INTO experience_technologies (experience_id, technology)
SELECT id, TRIM(unnest(string_to_array(technologies_used, ',')))
FROM experience
WHERE technologies_used IS NOT NULL AND technologies_used != ''
AND NOT EXISTS (SELECT 1 FROM experience_technologies WHERE experience_id = experience.id);
