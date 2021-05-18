import * as fs from "fs";
import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<string | null> => {
    let releaseNotes = "";

    if (fs.existsSync("CHANGELOG.md")) {
        const changelogLines: string[] = fs.readFileSync("CHANGELOG.md", "utf-8").split(/\r?\n/);
        let lineNum = changelogLines.findIndex((line) => line.startsWith("## Recent Changes"));

        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
            context.logger.log("Found changelog header in CHANGELOG.md");
        } else {
            context.logger.log("Missing changelog header in CHANGELOG.md");
        }
    } else {
        context.logger.log("Missing changelog file");
    }

    return releaseNotes.trim() || null;
}
