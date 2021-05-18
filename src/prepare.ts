import * as fs from "fs";
import execa from "execa";
import { Context } from "semantic-release";

function getDependencies(branch: any, dev: boolean): Record<string, string> {
    const dependencies = dev ? branch.devDependencies : branch.dependencies;

    if (!Array.isArray(dependencies)) {
        return dependencies;
    }

    const dependencyMap: Record<string, string> = {};

    for (const pkgName of dependencies) {
        dependencyMap[pkgName] = branch.channel || (branch.main ? "latest" : branch.name);
    }

    return dependencyMap;
}

async function updateDependency(context: Context, pkgName: string, pkgTag: string, dev: boolean): Promise<void> {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const dependencies = packageJson[dev ? "devDependencies" : "dependencies"] || {};
    const currentVersion: string = dependencies[pkgName];
    const latestVersion = (await execa(`npm view ${pkgName}@${pkgTag} version`)).stdout;

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
        if (!context.options?.dryRun) {
            await execa(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);
            context.logger.log(`Updated package ${pkgName} to version ${latestVersion}`);
        } else {
            context.logger.log(`[skip] npm install ${pkgName}@${latestVersion} ${npmArgs}`);
        }
    }
}

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;

    if (branch.dependencies) {
        for (const [pkgName, pkgTag] of Object.entries(getDependencies(branch, false))) {
            await updateDependency(context, pkgName, pkgTag, false);
        }
    }

    if (branch.devDependencies) {
        for (const [pkgName, pkgTag] of Object.entries(getDependencies(branch, true))) {
            await updateDependency(context, pkgName, pkgTag, true);
        }
    }

    if (fs.existsSync("CHANGELOG.md") && context.nextRelease != null) {
        const oldContents = fs.readFileSync("CHANGELOG.md", "utf-8");
        const searchValue = "## Recent Changes";
        const replaceValue = `## \`${context.nextRelease.version}\``;
        const newContents = oldContents.replace(searchValue, replaceValue);

        if (newContents !== oldContents) {
            if (!context.options?.dryRun) {
                fs.writeFileSync("CHANGELOG.md", newContents);
                context.logger.log(`Updated version header in CHANGELOG.md`)
            } else {
                context.logger.log(`[skip] Replace "${searchValue}" with "${replaceValue}" in CHANGELOG.md`);
            }
        }
    }
}
