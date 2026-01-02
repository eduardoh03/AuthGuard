/* tsqllint-disable: transaction-isolation-level
   tsqllint-disable: set-quoted-identifier
   tsqllint-disable: set-ansi-nulls
   tsqllint-disable: schema-compression
*/

-- V3: Add audit fields to users table and create audit_log table

-- Audit fields for users table
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP;
ALTER TABLE users ADD COLUMN created_by UUID;
ALTER TABLE users ADD COLUMN updated_by UUID;

-- Audit log table to track all user actions
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,                    -- Who performed the action (null for anonymous)
    action VARCHAR(50) NOT NULL,     -- Action type (LOGIN, VIEW_USER, CREATE_USER, etc)
    entity_type VARCHAR(100),        -- Entity type affected (User, etc)
    entity_id UUID,                  -- ID of the affected entity
    details JSONB,                   -- Additional details (JSON format)
    ip_address VARCHAR(45),          -- Client IP (IPv4 or IPv6)
    user_agent TEXT,                 -- Client user agent
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
