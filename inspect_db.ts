import "dotenv/config";
import mysql from "mysql2/promise";

async function inspect() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL + '&ssl={"rejectUnauthorized":false}');
    const [rows]: any = await connection.execute("DESCRIBE pets");
    console.log("Table 'pets' structure:", JSON.stringify(rows, null, 2));
    await connection.end();
}

inspect().catch(console.error);
