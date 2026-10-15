import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("Set BLOB_READ_WRITE_TOKEN, then run this again.");
  process.exit(1);
}

const file = path.join(process.cwd(), "data", "cms.json");
if (!fs.existsSync(file)) {
  console.error("No data/cms.json to upload.");
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
JSON.parse(raw);
const blob = await put("cms/ma-cms.json", raw, {
  access: "private",
  allowOverwrite: true,
  addRandomSuffix: false,
  contentType: "application/json",
  token
});
console.log(`Uploaded the website content to ${blob.pathname}`);
