import * as fs from "fs";
import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<string | null> => {
    const pkgVer = context.nextRelease!.version;
    let releaseNotes = "";

    if (fs.existsSync("CHANGELOG.md")) {
        const changelogLines: string[] = fs.readFileSync("CHANGELOG.md", "utf-8").split(/\r?\n/);
        const pkgVerRegex = new RegExp(`## \\W*${pkgVer}\\W*`);

        let lineNum = changelogLines.findIndex((line) => line.match(pkgVerRegex));
        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
        } else {
            context.logger.log(`Missing changelog header for version ${pkgVer}`);
        }
    } else {
        context.logger.log("Missing changelog file");
    }

    return releaseNotes.trim() || null;
}
