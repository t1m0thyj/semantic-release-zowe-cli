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
}
