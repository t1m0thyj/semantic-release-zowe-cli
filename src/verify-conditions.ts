import { Context } from "semantic-release";
import { readPackageVersion } from "./monorepo";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;
    const pkgVersion = readPackageVersion(context);

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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getLastRelease = require("semantic-release/lib/get-last-release");
    context.logger.log(JSON.stringify((context as any).branch.tags));
    context.logger.log(JSON.stringify(getLastRelease(context)));
    const tags = (context as any).branch.tags.filter((tag: any) => tag.version === pkgVersion);
    if (!pkgVersion.includes("-") && tags.length > 0) {
        tags[0].version = `${pkgVersion}-${(context as any).branch.name}`;
    }
    context.logger.log(JSON.stringify(getLastRelease(context)));
}
