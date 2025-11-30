class DatabaseMock {
  constructor(path: string, cb?: (err: Error | null) => void) {
    if (cb) cb(null); // Simulasi sukses koneksi
  }

  exec(sql: string, cb?: (err: Error | null) => void) {
    if (cb) cb(null); // Simulasi sukses eksekusi
  }

  close(): void {
    // No-op (tidak melakukan apa-apa)
  }
}

export default {
  Database: DatabaseMock,
  verbose: () => ({
    Database: DatabaseMock
  })
};
