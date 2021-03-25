import fs from "fs";

export function deleteFile(filepath: string) {
	try {
		fs.unlinkSync(filepath);
	} catch(error) {
		throw new Error(error);
	}
}