-- Protocol Sentinel v4.5 - Advanced Admin Features
USE big_system;

-- 1. Create System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT,
    setting_type ENUM('boolean', 'string', 'number', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Seed Default Settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type) VALUES
('maintenance_mode', 'false', 'boolean'),
('public_registration', 'true', 'boolean'),
('api_caching', 'true', 'boolean'),
('email_notifications', 'true', 'boolean'),
('auto_verification', 'false', 'boolean'),
('platform_commission', '50.00', 'number');

-- 3. Ensure payment_verifications has necessary columns
-- Check if columns exist before adding (using a safer approach for environments without procedures)
-- The routes already expect these, so let's just ensure the table is robust.

-- Add index for transaction reference for faster lookups
ALTER TABLE payment_verifications ADD INDEX IF NOT EXISTS idx_transaction (transaction_reference);

-- Add index for status and created_at
ALTER TABLE payment_verifications ADD INDEX IF NOT EXISTS idx_status_created (status, created_at);

-- 4. Create Admin Logs Table (for Super Admin traceability)
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT,
    action VARCHAR(255) NOT NULL,
    target_id INT,
    target_type VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);
