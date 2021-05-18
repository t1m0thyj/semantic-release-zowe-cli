import * as fs from "fs";
import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;

    const pkgVersion = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
    if (pkgVersion != null) {
        const [major, minor, ...rest] = pkgVersion.split(".");
        switch (branch.level) {
            case "patch":
                branch.range = `${major}.${minor}.x`;
                branch.accept = ["patch"];
                break;
            case "minor":
                branch.range = `${major}.x`;
                branch.accept = ["patch", "minor"];
                break;
            case "major":
            default:
                break;
        }
    }

    if (branch.dependencies && Array.isArray(branch.dependencies)) {
        const dependencies: { [key: string]: string } = {};
        for (const pkgName of branch.dependencies) {
            dependencies[pkgName] = branch.channel || (branch.main ? "latest" : branch.name);
        }
        branch.dependencies = dependencies;
    }

    if (branch.devDependencies && Array.isArray(branch.devDependencies)) {
        const devDependencies: { [key: string]: string } = {};
        for (const pkgName of branch.devDependencies) {
            devDependencies[pkgName] = branch.channel || (branch.main ? "latest" : branch.name);
        }
        branch.devDependencies = devDependencies;
    }
}
