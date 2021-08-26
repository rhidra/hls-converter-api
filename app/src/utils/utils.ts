export function formatSize(size: number): string {
  const thresh = 1000;

  if (Math.abs(size) < thresh) {
    return size + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; 
  let u = -1;
  const r = 10;

  do {
    size /= thresh;
    ++u;
  } while (Math.round(Math.abs(size) * r) / r >= thresh && u < units.length - 1);


  return size.toFixed(1) + ' ' + units[u];
}

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