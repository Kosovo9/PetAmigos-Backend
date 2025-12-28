import fs from "fs";
const content = fs.readFileSync("./server/breed-compatibility-table.ts", "utf-8");
console.log("File Starts with:", content.substring(0, 100));
console.log("Includes TEST_VAL:", content.includes("export const TEST_VAL"));
