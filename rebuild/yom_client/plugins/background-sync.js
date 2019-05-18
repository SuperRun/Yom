const bgSyncPluginForCreate = new workbox.backgroundSync.Plugin('projects-create-queue', {
    onSync: async ({queue}) => {
        console.log('onSync');
        let savedProjId = [];
        let entry;
        while (entry = await queue.popRequest()) {
            const markId = entry.request.headers.get('X-Mark-Id');
            try {
                if (savedProjId.indexOf(markId) ===-1){
                    console.log('fetch the first time');
                    savedProjId.push(markId);
                    await fetch(entry.request);
                }
            } catch (error) {
                console.error('Replay failed for request', entry.request, error);
                await this.unshiftRequest(entry);
                return;
            }
        }
    }
});

const bgSyncPluginForUpdate = new workbox.backgroundSync.Plugin('projects-update-queue');



const baseUrl = 'https://strapiserver.herokuapp.com';

const networkWithBackgroundSyncForCreate = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPluginForCreate],
});

const networkWithBackgroundSyncForUpdate = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPluginForUpdate],
});

workbox.routing.registerRoute(
    new RegExp(`${baseUrl}/projects`),
    networkWithBackgroundSyncForCreate,
    'POST'
);

workbox.routing.registerRoute(
    new RegExp(`${baseUrl}/(projects|projhistorycats)`),
    networkWithBackgroundSyncForUpdate,
    'PUT'
);