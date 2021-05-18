import * as fs from "fs";
import execa from "execa";
import { Context } from "semantic-release";

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
        for (const [pkgName, pkgTag] of Object.entries(branch.dependencies)) {
            await updateDependency(context, pkgName, pkgTag as string, false);
        }
    }

    if (branch.devDependencies) {
        for (const [pkgName, pkgTag] of Object.entries(branch.devDependencies)) {
            await updateDependency(context, pkgName, pkgTag as string, true);
        }
    }

    if (fs.existsSync("CHANGELOG.md")) {
        const changelogContents: string = fs.readFileSync("CHANGELOG.md", "utf-8");
        const pkgVersion = context.nextRelease!.version;

        if (changelogContents.includes("## Recent Changes") && !changelogContents.includes("## `" + pkgVersion + "`")) {
            fs.writeFileSync("CHANGELOG.md", changelogContents.replace("## Recent Changes", "## `" + pkgVersion + "`"));
        }
    }
}
