import * as fs from "fs";
import execa from "execa";
import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;

    if (branch.aliasTags && context.nextRelease != null) {
        const pkgName = JSON.parse(fs.readFileSync("package.json", "utf-8")).name;
        const pkgVersion = context.nextRelease.version;

        for (const pkgTag of branch.aliasTags) {
            const taggedVersion = (await execa(`npm view ${pkgName}@${pkgTag} version`)).stdout;
            if (taggedVersion !== pkgVersion) {
                await execa(`npm dist-tag add ${pkgName}@${pkgVersion} ${pkgTag}`);
            }
        }
    }
}
