import path from "path";

export function userUploads(fileName: string) {
	return path.resolve(__dirname, "..", "..", "public", "users", fileName);
}
export function roomUploads(fileName: string) {
	return path.resolve(__dirname, "..", "..", "public", "rooms", fileName);
}