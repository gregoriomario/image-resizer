#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import fs from 'fs';
import { turnToWebp } from './lib.js';

const argv = yargs(hideBin(process.argv)).argv;
const cwd = process.cwd();
const fullInputPath = process.argv[2] || argv.f || argv.file;

const full = argv.full;
const jpg = argv.jpg || argv.jpeg;
const type = argv.type ?? 'avif';
const name = argv.name;
const aspect = argv.aspect || 'portrait';

if (!fullInputPath) {
	console.log('Specify File Path!');
	process.exit(1);
}

if (fs.existsSync(fullInputPath)) {
	if (fs.statSync(fullInputPath).isFile()) {
		let outputName = String(argv.output || fullInputPath).split('.');
		if (outputName.length > 1) outputName = outputName.slice(0, -1);
		outputName = outputName.join('.');
		const fullPath = path.join(cwd, fullInputPath);

		try {
			turnToWebp({ filePath: fullPath, full, aspect });
		} catch (err) {
			console.log(err);
		}
	} else if (fs.statSync(fullInputPath).isDirectory()) {
		const files = fs.readdirSync(fullInputPath, { encoding: 'utf8' });
		const destDir = path.join(fullInputPath, 'COMPRESSED');
		if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

		files.forEach((fileName, i) => {
			const filePath = path.join(fullInputPath, fileName);

			if (
				fs.statSync(filePath).isFile() &&
				/\.(jpg|jpeg|png)$/i.test(fileName)
			) {
				try {
					turnToWebp({
						filePath,
						dest: destDir,
						full,
						type,
						// Name based on desired name and index
						// name: name + " " + (i + 1),
						name,
						index: i + 1,
					});
				} catch (err) {
					console.log(err);
				}
			}
		});
	} else {
		console.log('Unsupported file type or folder structure.');
	}
} else {
	console.log('File or folder not found.');
}
