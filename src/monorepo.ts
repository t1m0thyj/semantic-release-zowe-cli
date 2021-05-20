import * as fs from "fs";
import execa from "execa";
import { Context } from "semantic-release";

export const USE_LERNA = fs.existsSync("lerna.json");

export async function getPackageInfo(context: Context): Promise<Record<string, any>[]> {
    const packageInfo = JSON.parse((await execa("npx", ["lerna", "list", "--json", "--toposort"])).stdout);
    const changedPackages = (await execa("npx", ["lerna", "changed", "--include-merged-tags"], { reject: false })).stdout.split(/\r?\n/);
    
    for (const pkg of packageInfo) {
        pkg.changed = changedPackages.includes(pkg.name);
    }

    return packageInfo;
}  

export function readPackageVersion(context: Context): string {
    const filename = USE_LERNA ? "lerna.json" : "package.json";
    return JSON.parse(fs.readFileSync(filename, "utf-8")).version;
}
