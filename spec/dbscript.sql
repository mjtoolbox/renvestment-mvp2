CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    created_at timestamptz DEFAULT now()
    );

-- If the table already existed without the UNIQUE constraint, add it safely.
-- WARNING: this will fail if duplicate emails already exist. Clean duplicates first.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'contacts_email_unique'
    ) THEN
        ALTER TABLE contacts ADD CONSTRAINT contacts_email_unique UNIQUE (email);
    END IF;
END
$$;
