async function test() {
    try {
        const dbMod = await import("./server/db.ts");
        console.log("Keys in db module:", Object.keys(dbMod));
    } catch (error) {
        console.error("Import failed:", error);
    }
}
test();
