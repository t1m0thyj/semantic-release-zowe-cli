import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    // Update deps/dev deps
    // Update version in changelog
    context.logger.log(JSON.stringify(context.options?.branches));
}

/*
    public static async version(strategy: VersionStrategy, branch: IProtectedBranch): Promise<void> {
        const semverInfo = await this.beforeVersion(strategy, branch);

        if (!semverInfo) {
            return;
        }

        // Update dependencies across all packages and commit updates
        if (branch.dependencies) {
            for (const [pkgName, pkgTag] of Object.entries(branch.dependencies)) {
                await this.updateDependency(pkgName, pkgTag, false);
            }
        }

        // Update dev dependencies across all packages and commit updates
        if (branch.devDependencies) {
            for (const [pkgName, pkgTag] of Object.entries(branch.devDependencies)) {
                await this.updateDependency(pkgName, pkgTag, true);
            }
        }

        // Update version number in package-lock.json and changelog
        await exec.exec("git reset --hard");
        let newVersion: string = semverInfo.newVersion || semverInfo.level;
        newVersion = await utils.npmVersion(newVersion);
        Changelog.updateLatestVersion("CHANGELOG.md", newVersion);

        // Commit version bump and create tag
        await exec.exec("git add -u");
        await utils.gitCommit(`Bump version to ${newVersion}`);
        await exec.exec(`git tag v${newVersion} -m "Release ${newVersion} to ${branch.tag}"`);

        // Push commits and tag
        await utils.gitPush(branch.name, true);
        core.setOutput("new-version", newVersion);
    }

    private static async beforeVersion(strategy: VersionStrategy, branch: IProtectedBranch): Promise<ISemVerInfo | undefined> {
        const newVersion: string = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
        const semverInfo = await SemVer.getSemVerInfo((strategy === "compare") ? newVersion : undefined);

        if (!semverInfo || semverInfo.level === "none") {
            return;
        }

        // Check semver level to see if new version is ok
        if (branch.level && branch.level !== "major") {
            if (semverInfo.level === "major" || (semverInfo.level === "minor" && branch.level === "patch")) {
                core.setFailed(`Protected branch ${branch.name} does not allow ${semverInfo.level} version changes`);
                process.exit();
            }
        }

        // Configure Git user, email, and origin URL
        await utils.gitConfig();

        return semverInfo;
    }


     private static async updateDependency(pkgName: string, pkgTag: string, dev: boolean): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        const dependencies = packageJson[dev ? "devDependencies" : "dependencies"] || {};
        const currentVersion: string = dependencies[pkgName];
        const latestVersion = await utils.npmViewVersion(pkgName, pkgTag);

        if (currentVersion !== latestVersion) {
            const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
            await exec.exec(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);

            await exec.exec(`git add package.json package-lock.json`);
            await utils.gitCommit(`Bump ${pkgName} from ${currentVersion} to ${latestVersion}`);
        }
    }


    public static updateLatestVersion(changelogFile: string, pkgVer: string): void {
        if (!fs.existsSync(changelogFile)) {
            core.warning("Missing changelog file, skipping changelog update");
            return;
        }

        const changelogHeader = core.getInput("changelog-header");
        if (!changelogHeader) {
            core.warning("Changelog header was not defined, skipping changelog update")
            return;
        }

        const changelogContents: string = fs.readFileSync(changelogFile, "utf-8");
        if (changelogContents.includes("## `" + pkgVer + "`")) {
            core.warning(`Changelog header already exists for version ${pkgVer}, skipping changelog update`);
            return;
        }

        if (!changelogContents.includes(changelogHeader)) {
            core.warning("Changelog header not found in changelog file, skipping changelog update");
            return;
        }

        // TODO Make changelog format less rigid
        fs.writeFileSync(changelogFile, changelogContents.replace(changelogHeader, "## `" + pkgVer + "`"));
    }
 */
