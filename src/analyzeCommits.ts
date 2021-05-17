import { Octokit } from "@octokit/rest";
import { Context } from "semantic-release";
import semverDiff from "semver-diff";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseRepositoryURL = require("@hutson/parse-repository-url");

type ReleaseType = "major" | "minor" | "patch" | "prerelease" | null;

export default async (pluginConfig: any, context: Context): Promise<ReleaseType> => {
    context.logger.log(JSON.stringify(pluginConfig));
    context.logger.log(JSON.stringify(context.options));
    // TODO Handle release type "prerelease"
    if (context.nextRelease != null) {
        const octokit = new Octokit({ auth: context.env.GITHUB_TOKEN });
        const repoInfo = parseRepositoryURL(context.options!.repositoryUrl);
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            owner: repoInfo.user,
            repo: repoInfo.project,
            commit_sha: context.nextRelease.gitHead
        });

        if (prs.data.length > 0) {
            const labels = await octokit.issues.listLabelsOnIssue({
                owner: repoInfo.user,
                repo: repoInfo.project,
                issue_number: prs.data[0].number
            });
            const labelNames = labels.data.map(label => label.name);
            let releaseType: ReleaseType | undefined = undefined;
        
            if (labelNames.includes("release-major")) {
                releaseType = "major";
            } else if (labelNames.includes("release-minor")) {
                releaseType = "minor";
            } else if (labelNames.includes("release-patch")) {
                releaseType = "patch";
            } else if (labelNames.includes("no-release")) {
                releaseType = null;
            }

            if (releaseType !== undefined) {
                context.logger.log(`Detected release type '${releaseType || "none"}' from pull request label`);
                return releaseType;
            }
        }
    }

    const oldPkgVer = context.lastRelease?.version;
    const newPkgVer = context.nextRelease?.version;

    if (oldPkgVer != null && newPkgVer != null) {
        const releaseType = (semverDiff(oldPkgVer, newPkgVer) as ReleaseType) || null;
        context.logger.log(`Detected release type '${releaseType || "none"}' from package.json version field`);
        return releaseType;
    }

    return null;
}
