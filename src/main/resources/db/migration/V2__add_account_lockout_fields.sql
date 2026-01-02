/* tsqllint-disable: transaction-isolation-level
   tsqllint-disable: set-quoted-identifier
   tsqllint-disable: set-ansi-nulls
   tsqllint-disable: schema-compression
*/

-- V2: Add account lockout fields to users table
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN lockout_end_time TIMESTAMP;
