CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT NOT NULL AUTO_INCREMENT,
    idAgence BIGINT NULL,
    timestamp VARCHAR(30) NOT NULL,
    userId BIGINT NULL,
    userName VARCHAR(150) NULL,
    method VARCHAR(10) NOT NULL,
    url VARCHAR(1024) NULL,
    action VARCHAR(512) NULL,
    module VARCHAR(100) NULL,
    status INT NULL,
    success BIT NULL,
    durationMs BIGINT NULL,
    PRIMARY KEY (id),
    INDEX idx_audit_id_agence (idAgence),
    INDEX idx_audit_timestamp (timestamp)
);
