-- =============================================================================
-- Machine Efficiency Monitor System (MEMS) — Database Schema
-- =============================================================================
-- Standard SQL schema for tracking machine states and shift-level utilization.
-- Compatible with MySQL / MariaDB.  Adjust data types as needed for other RDBMS.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. machine_states_log
--    Records every real-time state change reported by edge devices (ESP32).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS machine_states_log (
    log_id       INT            NOT NULL AUTO_INCREMENT,
    machine_id   VARCHAR(64)    NOT NULL,
    state        ENUM('RUNNING', 'DOWN', 'IDLE', 'OFFLINE') NOT NULL,
    timestamp    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (log_id),

    -- Speed up queries that filter by machine + time range
    INDEX idx_machine_timestamp (machine_id, timestamp)
);


-- ---------------------------------------------------------------------------
-- 2. shift_summary
--    Stores pre-calculated utilization metrics per machine, per date, per shift.
--    Shift numbers: 1 (Day), 2 (Swing), 3 (Night)  — adjust to your factory.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shift_summary (
    summary_id          INT            NOT NULL AUTO_INCREMENT,
    machine_id          VARCHAR(64)    NOT NULL,
    date                DATE           NOT NULL,
    shift_number        INT            NOT NULL CHECK (shift_number IN (1, 2, 3)),
    running_minutes     INT            NOT NULL DEFAULT 0,
    down_minutes        INT            NOT NULL DEFAULT 0,
    idle_minutes        INT            NOT NULL DEFAULT 0,
    utilization_percent DECIMAL(5, 2)  NOT NULL DEFAULT 0.00,

    PRIMARY KEY (summary_id),

    -- Prevent duplicate entries for the same machine / date / shift
    UNIQUE INDEX uq_machine_date_shift (machine_id, date, shift_number),

    -- Quick look-ups by date range
    INDEX idx_date (date)
);
