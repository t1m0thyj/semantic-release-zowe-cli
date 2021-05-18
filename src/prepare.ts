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
    const latestVersion = (await execa(`npm view ${pkgName}@${pkgTag} version`, context)).stdout;

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
        await execa(`npm install ${pkgName}@${latestVersion} ${npmArgs}`, context);
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
        const changelogContents: string = fs.readFileSync("CHANGELOG.md", "utf-8");
        const pkgVersion = context.nextRelease.version;

        if (changelogContents.includes("## Recent Changes") && !changelogContents.includes("## `" + pkgVersion + "`")) {
            fs.writeFileSync("CHANGELOG.md", changelogContents.replace("## Recent Changes", "## `" + pkgVersion + "`"));
        }
    }
}
