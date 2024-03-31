import { Database } from 'bun:sqlite'

const path = Bun.fileURLToPath(process.env.DB_URL)

const db = new Database(path)

db.query(`
    CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_url TEXT UNIQUE,
        long_url TEXT UNIQUE
    );
`).all()

export default db