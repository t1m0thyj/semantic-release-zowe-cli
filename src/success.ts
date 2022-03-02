import { Constants } from "./constants";
import { IContext } from "./doc/IContext";

export default async (pluginConfig: any, context: IContext): Promise<void> => {
    const branch = (context as any).branch;

    if (branch.aliasTags && context.nextRelease != null) {
        const publishPlugin = Constants.USE_LERNA ? "semantic-release-lerna" : "@semantic-release/npm";
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
