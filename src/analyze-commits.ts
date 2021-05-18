import * as fs from "fs";
import { Octokit } from "@octokit/rest";
import execa from "execa";
import gitUrlParse from "git-url-parse";
import { Context } from "semantic-release";
import semverDiff from "semver-diff";

type ReleaseType = "major" | "minor" | "patch" | "prerelease" | null;

function getGitOwnerAndRepo(context: Context): [string, string] {
    const urlParsed = gitUrlParse(context.options!.repositoryUrl);
    return [urlParsed.owner, urlParsed.name];
}

export default async (pluginConfig: any, context: Context): Promise<ReleaseType> => {
    const branch = (context as any).branch;
    if (branch.prerelease) {
        context.logger.log(`Detected release type 'prerelease' from branch name '${branch.name}'`);
        return "prerelease";
    }

    if (context.nextRelease != null) {
        const octokit = new Octokit({
            auth: context.env.GH_TOKEN || context.env.GITHUB_TOKEN
        });
        const [owner, repo] = getGitOwnerAndRepo(context);
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            owner, repo,
            commit_sha: (await execa("git rev-parse HEAD", context)).stdout
        });

        if (prs.data.length > 0) {
            const labels = await octokit.issues.listLabelsOnIssue({
                owner, repo,
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
    const newPkgVer = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;

    if (oldPkgVer != null && newPkgVer != null) {
        const releaseType = (semverDiff(oldPkgVer, newPkgVer) as ReleaseType) || null;
        context.logger.log(`Detected release type '${releaseType || "none"}' from package.json version field`);
        return releaseType;
    }

    return null;
}
