import { Context } from "semantic-release";
import { USE_LERNA } from "./monorepo";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;

    if (branch.aliasTags && context.nextRelease != null) {
        const publishPlugin = USE_LERNA ? "semantic-release-lerna" : "@semantic-release/npm";
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { addChannel } = require(publishPlugin);

        for (const pkgTag of branch.aliasTags) {
            await addChannel(pluginConfig, {
                ...context,
                nextRelease: {
                    ...context.nextRelease,
                    channel: pkgTag
                }
            });
        }
    }
}
