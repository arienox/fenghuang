-- EPIC A1: Masterplan migrations

-- Tasks lanes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lane VARCHAR(16) DEFAULT 'next';

-- Task dependencies
CREATE TABLE IF NOT EXISTS task_deps (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL,
  depends_on INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OKRs
CREATE TABLE IF NOT EXISTS okrs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64),
  title VARCHAR(200),
  target_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS key_results (
  id SERIAL PRIMARY KEY,
  okr_id INT,
  name VARCHAR(200),
  target_value NUMERIC(12,2),
  current_value NUMERIC(12,2) DEFAULT 0,
  unit VARCHAR(24) DEFAULT 'count'
);

-- Finance webhooks & categorization
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category VARCHAR(48);

CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(32),
  event_id VARCHAR(128) UNIQUE,
  payload JSONB,
  received_at TIMESTAMP DEFAULT NOW()
);

-- Protein habit default for demo user
INSERT INTO habits (user_id, name, unit, target)
SELECT 'demo', 'protein', 'grams', 180
WHERE NOT EXISTS (
  SELECT 1 FROM habits WHERE user_id='demo' AND name='protein'
); 