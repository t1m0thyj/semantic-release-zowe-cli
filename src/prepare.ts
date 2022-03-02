import * as fs from "fs";
import * as path from "path";
import { Constants } from "./constants";
import { IContext } from "./doc/IContext";
import * as utils from "./utils";

function updateChangelog(context: IContext, changelogFile: string) {
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

export default async (pluginConfig: any, context: IContext): Promise<void> => {
    if (context.nextRelease != null) {
        process.env.GIT_TAG_MESSAGE = `Release ${context.nextRelease.version} to ${(context as any).branch.name}`;
    }

    if (Constants.USE_LERNA) {
        for (const { location } of (await utils.getLernaPackageInfo(context)).filter((pkg) => pkg.changed)) {
            const changelogFile = path.join(path.relative(process.cwd(), location), "CHANGELOG.md");
            updateChangelog(context, changelogFile);
        }
    } else {
        updateChangelog(context, "CHANGELOG.md");
    }
}
