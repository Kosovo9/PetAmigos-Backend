import { BREED_DATA } from "./server/breed-compatibility-table.ts";
import fs from "fs";

const data = {
    dogBreeds: Object.keys(BREED_DATA).filter(b => BREED_DATA[b].species === 'dog'),
    catBreeds: Object.keys(BREED_DATA).filter(b => BREED_DATA[b].species === 'cat')
};

fs.writeFileSync("./scripts/breeds_summary.json", JSON.stringify(data, null, 2));
console.log("Breeds summary generated.");
