import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';

// Returns the extension of a file or undefined: "video.mp4" -> "mp4"
export function getExtension(filename: string): string {
  const ext = (/(?:\.([^.]+))?$/.exec(filename) ?? ['', ''])[1];
  return ext ? ext.toLowerCase() : ext;
}

// Returns the file name without the extension or undefined: "video.mp4" -> "video"
export function removeExtension(filename: string): string {
  const ext = getExtension(filename) ?? '';
  return filename.substring(0, filename.length - ext.length - 1);
}

// Returns a flat array of absolute paths of all files recursively contained in the dir
export function getFilePathsRecursiveSync(dir: string) {
	let results = [] as string[];
	const list = fs.readdirSync(dir);

  let pending = list.length;
	if (!pending) {
    return results;
  }

	for (const file of list) {
		const fullPath = path.resolve(dir, file)
		const stat = fs.statSync(fullPath)

    if (stat && stat.isDirectory()) {
			const res = getFilePathsRecursiveSync(fullPath)
			results = results.concat(res)
		} else {
			results.push(fullPath)
		}
		if (!--pending) {
      return results;
    }
	}

	return results;
}

export async function getZippedFolderSync(dir: string) {
	const allPaths = getFilePathsRecursiveSync(dir);

	const zip = new JSZip();
  for (const filePath of allPaths) {
    const addPath = path.relative(dir, filePath);
    const data = fs.readFileSync(filePath);
    zip.file(addPath, data);
  }

  return await zip.generateAsync({type: "nodebuffer"});
}