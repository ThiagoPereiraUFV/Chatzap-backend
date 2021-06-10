import fs from "fs";

export function deleteFile(filepath: string) {
	try {
		if(fs.existsSync(filepath)) {
			fs.unlinkSync(filepath);
		}
	} catch(error) {
		throw new Error(error);
	}
}