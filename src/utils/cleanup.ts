import fs from "fs";
export const cleanUpUtils = (filePaths: string[]) => {
    filePaths.forEach((f) => {
        if (fs.existsSync(f)) {
            fs.unlinkSync(f);
        }

    })
}