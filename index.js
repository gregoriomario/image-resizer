import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const argv = yargs(hideBin(process.argv)).argv;
const cwd = process.cwd();
const fileName = argv.f || argv.file;

if (!fileName) {
	console.log("Specify File Path!");
	process.exit(1);
}

const fullPath = path.join(cwd, fileName);

const fileBuffer = fs.readFileSync(fullPath);

sharp(fileBuffer)
	.webp()
	.toFile(
		`${String(fileName).split(".").slice(0, -1).join(".")}.webp`,
		(err, info) => {
			if (err) {
				console.log("Error converting file");
				process.exit(1);
			}
			console.log("Converting Image to WEBP success!");
		}
	);
