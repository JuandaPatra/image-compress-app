import db from "../database/db";

export const insertLog = (
  originalSize: number,
  compressedSize: number,
  durationMs: number,
  ipAddress: string
) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `INSERT INTO compress_logs (original_size, compressed_size, duration_ms, ip_address)
       VALUES (?, ?, ?, ?)`,
      [originalSize, compressedSize, durationMs, ipAddress],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
