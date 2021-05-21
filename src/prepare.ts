import * as fs from "fs";
import * as path from "path";
import { Context } from "semantic-release";
import { getPackageInfo, USE_LERNA } from "./monorepo";

function updateChangelog(context: Context, changelogFile: string) {
    if (fs.existsSync(changelogFile) && context.nextRelease != null) {
        const oldContents = fs.readFileSync(changelogFile, "utf-8");
        const searchValue = "## Recent Changes";
        const replaceValue = `## \`${context.nextRelease.version}\``;
        const newContents = oldContents.replace(searchValue, replaceValue);

        if (newContents !== oldContents) {
            if (!context.options?.dryRun) {
                fs.writeFileSync(changelogFile, newContents);
                context.logger.log(`Updated version header in ${changelogFile}`)
            } else {
                context.logger.log(`[skip] Replace "${searchValue}" with "${replaceValue}" in ${changelogFile}`);
            }
        }
    }
}

export default async (pluginConfig: any, context: Context): Promise<void> => {
    if (context.nextRelease != null) {
        process.env.GIT_TAG_MESSAGE = `Release ${context.nextRelease.version} to ${(context as any).branch.name}`;
    }

    if (USE_LERNA) {
        for (const { location } of (await getPackageInfo(context)).filter((pkg) => pkg.changed)) {
            const changelogFile = path.join(path.relative(process.cwd(), location), "CHANGELOG.md");
            updateChangelog(context, changelogFile);
        }
    } else {
        updateChangelog(context, "CHANGELOG.md");
    }
}
