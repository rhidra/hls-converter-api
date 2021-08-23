// Returns the extension of a file or undefined: "video.mp4" -> "mp4"
export function getExtension(filename: string): string {
  const ext = /(?:\.([^.]+))?$/.exec(filename)[1];
  return ext ? ext.toLowerCase() : ext;
}