import * as fs from "fs";
import * as path from "path";
import { Context } from "semantic-release";
import { getPackageInfo, USE_LERNA } from "./monorepo";

function getReleaseNotes(context: Context, changelogFile: string): string | null {
    let releaseNotes = "";

    if (fs.existsSync(changelogFile)) {
        const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
        let lineNum = changelogLines.findIndex((line) => line.startsWith("## Recent Changes") ||
            (context.nextRelease != null && line.startsWith(`## \`${context.nextRelease.version}\``)));

        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
            context.logger.log(`Found changelog header in ${changelogFile}`);
        } else {
            context.logger.log(`Missing changelog header in ${changelogFile}`);
        }
    } else {
        context.logger.log(`Missing changelog file ${changelogFile}`);
    }

    return releaseNotes.trim() || null;
}

export default async (pluginConfig: any, context: Context): Promise<string | null> => {
    if (USE_LERNA) {
        let releaseNotes = "";

        for (const { name, location } of (await getPackageInfo(context)).filter((pkg) => pkg.changed)) {
            const changelogFile = path.join(path.relative(process.cwd(), location), "CHANGELOG.md");
            const packageReleaseNotes = getReleaseNotes(context, changelogFile);
            if (packageReleaseNotes != null) {
                releaseNotes += `**${name}**\n${packageReleaseNotes}\n\n`;
            }
        }

        return releaseNotes || null;
    } else {
        return getReleaseNotes(context, "CHANGELOG.md");
    }
}
