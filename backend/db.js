import {Pool} from "pg"
import dotenv from "dotenv"
dotenv.config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
})

pool.on("connect", () => {
  console.log("Connected to the database");
})

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
})

pool.query(`CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) primary key UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);`)

pool.query(`CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    message_count INT DEFAULT 0,
    user_email VARCHAR(255) REFERENCES users(email)
);`)
export default pool