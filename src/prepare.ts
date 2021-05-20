import * as fs from "fs";
import * as path from "path";
import execa from "execa";
import { Context } from "semantic-release";
import { getPackageInfo, USE_LERNA } from "./monorepo";

function getDependencies(branch: any, dev: boolean): Record<string, string> {
    const dependencies = dev ? branch.devDependencies : branch.dependencies;

    if (!Array.isArray(dependencies)) {
        return dependencies || {};
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
    const latestVersion = (await execa("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).stdout;

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? ["--save-dev"] : ["--save-prod", "--save-exact"];
        if (!context.options?.dryRun) {
            await execa("npm", ["install", `${pkgName}@${latestVersion}`, ...npmArgs]);
            context.logger.log(`Updated package ${pkgName} to version ${latestVersion}`);
        } else {
            context.logger.log(`[skip] npm install ${pkgName}@${latestVersion} ${npmArgs.join(" ")}`);
        }
    }
}

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
    const branch = (context as any).branch;
    const dependencies = getDependencies(branch, false);
    const devDependencies = getDependencies(branch, true);

    if (branch.dependencies) {
        for (const [pkgName, pkgTag] of Object.entries(dependencies)) {
            await updateDependency(context, pkgName, pkgTag, false);
        }
    }

    if (branch.devDependencies) {
        for (const [pkgName, pkgTag] of Object.entries(devDependencies)) {
            await updateDependency(context, pkgName, pkgTag, true);
        }
    }

    if (USE_LERNA && (branch.dependencies || branch.devDependencies)) {
        const dependencyList = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
        if (!context.options?.dryRun) {
            await execa("npx", ["-y", "--", "syncpack", "fix-mismatches", "--dev", "--prod", "--filter", dependencyList.join("|")]);
            context.logger.log(`Updated dependencies across monorepo: ${dependencyList.join(", ")}`);
        } else {
            context.logger.log(`[skip] npx -y -- syncpack fix-mismatches --dev --prod --filter "${dependencyList.join("|")}"`);
        }
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
