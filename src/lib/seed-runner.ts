import "dotenv/config";
import { seed } from "./seed";

seed().then(() => { console.log("Done"); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
