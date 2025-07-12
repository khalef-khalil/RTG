-- Create challenges table
CREATE TABLE challenges (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- "count", "time", "binary", "checklist"
    "targetValue" INTEGER,
    deadline TIMESTAMPTZ,
    "timeLimit" INTEGER,
    completed BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMPTZ,
    progress INTEGER NOT NULL DEFAULT 0,
    "biggestObstacle" TEXT,
    improvement TEXT,
    "pushRating" INTEGER,
    "checklistItems" TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    category TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create principles table
CREATE TABLE principles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    text TEXT NOT NULL,
    type TEXT NOT NULL, -- "do" or "dont"
    category TEXT NOT NULL,
    source TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create focus table
CREATE TABLE focus (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    text TEXT NOT NULL,
    type TEXT NOT NULL, -- "matters" or "doesnt_matter"
    category TEXT NOT NULL,
    source TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create systems table
CREATE TABLE systems (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    trigger TEXT NOT NULL,
    action TEXT NOT NULL,
    outcome TEXT NOT NULL,
    category TEXT NOT NULL,
    source TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_principles_updated_at BEFORE UPDATE ON principles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_focus_updated_at BEFORE UPDATE ON focus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
-- Note: You may want to make these more restrictive based on your auth requirements
CREATE POLICY "Enable all operations for authenticated users" ON challenges
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON principles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON focus
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON systems
    FOR ALL USING (auth.role() = 'authenticated');

-- For development/testing, you might want to allow anonymous access
-- Uncomment these if you want to allow unauthenticated access
-- CREATE POLICY "Enable all operations for anonymous users" ON challenges
--     FOR ALL USING (true);

-- CREATE POLICY "Enable all operations for anonymous users" ON principles
--     FOR ALL USING (true);

-- CREATE POLICY "Enable all operations for anonymous users" ON focus
--     FOR ALL USING (true);

-- CREATE POLICY "Enable all operations for anonymous users" ON systems
--     FOR ALL USING (true);
