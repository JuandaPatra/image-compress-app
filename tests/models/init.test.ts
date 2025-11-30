// ⛔ Jangan mock sqlite3 dulu — tidak perlu untuk file ini
jest.mock("fs");

jest.mock("../../src/database/db", () => ({
  exec: jest.fn()
}));

import fs from "fs";
import path from "path";
import db from "../../src/database/db";

describe("Database init", () => {
  const mockSQL = "CREATE TABLE logs (...);";

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(mockSQL);
  });

  it("should read SQL file and execute db.exec", () => {
    // Import init setelah mock siap
    require("../../src/database/init");

    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join(__dirname, "../../src/database/migrations/create_logs_table.sql"),
      "utf-8"
    );

    expect(db.exec).toHaveBeenCalledWith(mockSQL, expect.any(Function));
  });

//   it("should log success when no error", () => {
//     console.log = jest.fn();
//     require("../../src/database/init");

//     const callback = (db.exec as jest.Mock).mock.calls[0][1]; // ✅ now exists
//     callback(null); // Simulate success

//     expect(console.log).toHaveBeenCalledWith("✅ compress_logs table ready");
//   });

//   it("should log error when db.exec fails", () => {
//     console.error = jest.fn();
//     require("../../src/database/init");

//     const callback = (db.exec as jest.Mock).mock.calls[0][1];
//     callback(new Error("DB ERROR"));

//     expect(console.error).toHaveBeenCalledWith(
//       "Error creating table:",
//       expect.any(Error)
//     );
//   });
});
