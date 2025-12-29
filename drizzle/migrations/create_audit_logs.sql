-- Migration: Create audit_logs table for security auditing
-- Version: 001
-- Created: 2024-12-29

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event information
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  description TEXT NOT NULL,
  
  -- User information
  user_id UUID,
  target_user_id UUID,
  
  -- Entity information
  target_entity_id UUID,
  target_entity_type VARCHAR(50),
  
  -- Request metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_id VARCHAR(100),
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  
   -- Indexes for performance
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(target_entity_type, target_entity_id) WHERE target_entity_id IS NOT NULL;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_audit_logs_description_search ON audit_logs USING GIN(to_tsvector('spanish', description));

-- Partition by month for scalability (opcional, comentado por defecto)
-- CREATE TABLE audit_logs_2024_12 PARTITION OF audit_logs
-- FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Comments
COMMENT ON TABLE audit_logs IS 'Security audit trail for all critical operations';
COMMENT ON COLUMN audit_logs.event_type IS 'Type of event (e.g., user.login, payment.created)';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level: info, warning, error, critical';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional JSON data specific to the event';

-- Create function to automatically clean old audit logs (>90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND severity IN ('info', 'warning');
  
  -- Don't delete errors and critical events
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (if pg_cron is available)
-- SELECT cron.schedule('cleanup-audit-logs', '0 3 * * *', 'SELECT cleanup_old_audit_logs();');
