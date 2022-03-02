import { BranchSpec, Context } from "semantic-release";

export interface IContext extends Context {
    /**
     * Current working directory
     */
    cwd: string;

    /**
     * Information about CI environment
     */
    envCi: {
        /**
         * True if the environment is a CI environment
         */
        isCi: boolean;

        /**
         * Commit hash
         */
        commit: string;

        /**
         * Current branch
         */
        branch: string;
    };

    /**
     * Information on the current branch
     */
    branch: BranchSpec;

    /**
     * Information on branches
     */
    branches: BranchSpec[];
}
