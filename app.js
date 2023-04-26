import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const argv = yargs(hideBin(process.argv)).argv;
const cwd = process.cwd();
const fileName = process.argv[2] || argv.f || argv.file;
let outputName = String(argv.output || fileName).split(".");
if (outputName.length > 1 && -1) outputName.slice(0, -1);
outputName = outputName.join(".");

if (!fileName) {
	console.log("Specify File Path!");
	process.exit(1);
}

const fullPath = path.join(cwd, fileName);

const fileBuffer = fs.readFileSync(fullPath);

sharp(fileBuffer)
	.webp()
	.toFile(`${outputName}.webp`, (err, info) => {
		if (err) {
			console.log("Error converting file");
			process.exit(1);
		}
		console.log("Converting Image to WEBP success!");
	});
