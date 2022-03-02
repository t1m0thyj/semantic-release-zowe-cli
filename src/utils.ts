import * as fs from "fs";
import execa from "execa";
import gitUrlParse from "git-url-parse";
import { Constants } from "./constants";
import { IContext } from "./doc/IContext";

export async function getLernaPackageInfo(context: IContext): Promise<Record<string, any>[]> {
    const packageInfo = JSON.parse((await execa("npx", ["lerna", "list", "--json", "--toposort"])).stdout);
    const changedPackages = (await execa("npx", ["lerna", "changed", "--include-merged-tags"], { reject: false })).stdout.split(/\r?\n/);
    
    for (const pkg of packageInfo) {
        pkg.changed = changedPackages.includes(pkg.name);
    }

    return packageInfo;
}  

export function gitRepoFromUrl(context: IContext): { owner: string, repo: string } {
    const urlParsed = gitUrlParse(context.options!.repositoryUrl);
    return { owner: urlParsed.owner, repo: urlParsed.name };
}

export function readPackageVersion(context: IContext): string {
    const filename = Constants.USE_LERNA ? "lerna.json" : "package.json";
    return JSON.parse(fs.readFileSync(filename, "utf-8")).version;
}
