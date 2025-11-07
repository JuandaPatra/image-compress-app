import { formatBytes } from "../../../image-compress-app/src/utils/formatBytes";

describe("formatBytes Utility", () => {
  test("return correct format for 1024 bytes", () => {
    expect(formatBytes(1024)).toBe("1.00 KB");
  });

  test("returns 0 Bytes for 0 input", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  test("returns correct formatting for large number", () => {
    expect(formatBytes(1048576)).toBe("1.00 MB");
  });
});
