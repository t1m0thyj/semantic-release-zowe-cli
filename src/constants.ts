import * as fs from "fs";

export class Constants {
    public static PR_RELEASE_LABELS = ["release-none", "release-patch", "release-minor", "release-major"];

    public static USE_LERNA = fs.existsSync("lerna.json");
}
