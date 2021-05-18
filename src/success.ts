import { Context } from "semantic-release";

export default async (pluginConfig: any, context: Context): Promise<void> => {
    const branch = (context as any).branch;

    if (branch.aliasTags && context.nextRelease != null) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { addChannel } = require("@semantic-release/npm");

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
