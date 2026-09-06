import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        api_key VARCHAR(255) NOT NULL,
        message_count INT DEFAULT 0,
        user_email VARCHAR(255) REFERENCES users(email),
        daily_limit INT DEFAULT 100,
        daily_message_count INT DEFAULT 0,
        last_reset DATE DEFAULT CURRENT_DATE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id) ON DELETE CASCADE,
        sender_email VARCHAR(255),
        sender_name VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_project_created
      ON messages (project_id, created_at DESC);
    `);

    console.log("Database tables initialized");
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
}

export default pool;