import fs from "fs";
import path from "path";
import { cleanUpUtils } from "../../src/utils/cleanup";

describe("cleanUpUtils", () => {
  const testFilePath = path.join(__dirname, "test-temp-file.txt");

  beforeAll(() => {
    // Buat file temporary
    fs.writeFileSync(testFilePath, "test");
  });

  it("should delete the file if it exists", () => {
    expect(fs.existsSync(testFilePath)).toBe(true);

    cleanUpUtils([testFilePath]);

    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  it("should not throw error if file does not exist", () => {
    expect(() => cleanUpUtils([testFilePath])).not.toThrow();
  });
});