import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testConnection() {
    try {
        console.log('Attempting to connect to:', process.env.DATABASE_URL);
        const connection = await mysql.createConnection(process.env.DATABASE_URL + '?ssl={"rejectUnauthorized":false}');
        console.log('Connected successfully!');
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Query result:', rows);
        await connection.end();
    } catch (error) {
        console.error('Detailed connection error:', error);
    }
}

testConnection();
