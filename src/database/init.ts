import fs from "fs";
import path from "path";
import  db  from "./db";

const sql = fs.readFileSync(
  path.join(__dirname, "migrations", "create_logs_table.sql"),
  "utf-8"
);

db.exec(sql, (err) => {
  if (err) console.error("Error creating table:", err);
  else console.log("✅ compress_logs table ready");
});
