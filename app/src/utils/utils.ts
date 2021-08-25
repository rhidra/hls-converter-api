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