import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export async function turnToWebp({ filePath, dest, full, type, name, index }) {
	const { fileName, file } = getOutputAndFile({
		filePath,
		dest,
		type,
		name,
		index,
	});

	const imageAspect = {
		// portrait: { width: 1080 },
		// landscape: { width: 1920 },
		portrait: { height: 2048 },
		landscape: { width: 2048 },
	};
	let item = sharp(file);

	const metadata = await item.metadata();
	const aspect = metadata.width > metadata.height ? 'landscape' : 'portrait';

	if (full) {
		// item = item.jpeg({ quality: 80 });
		if (metadata.width >= 2000 || metadata.height >= 2000) {
			item = item.resize({ ...imageAspect[aspect] });
		}
	}

	item = item.withMetadata({
		title: 'Your Title',
		description: 'Your Description',
		copyright: 'Your Copyright',
		comment: 'Your Comment', // Some software may use 'comment' as a field
	});

	if (type === 'jpg' || type === 'jpeg') {
		item = item.jpeg();
	} else if (type === 'webp') {
		item = item.webp();
	} else {
		item = item.avif();
	}

	item.toFile(fileName, (err, info) => {
		if (err) {
			console.log('Error converting file');
		}
		console.log('Compressing file success!');
	});
}

export function getOutputAndFile({ filePath, dest, type, name, index }) {
	const inputName = path.parse(filePath).name;
	name = `${name ? name + ' ' + index : inputName}.${type}`;

	if (dest) {
		name = path.join(dest, name);
	}

	const file = fs.readFileSync(filePath);

	return { fileName: name, file };
}
