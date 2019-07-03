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
                    await fetch(entry.request).then(res=> {
                        console.log('fetch successfully');
                        if (Notification.permission === "granted") {
                            self.registration.showNotification('The project was created successfully!', {
                                body: '🎉`🎉`🎉`'
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Replay failed for request', entry.request, error);
                await queue.unshiftRequest(entry);
                return;
            }
        }
    }
});

const bgSyncPluginForUpdate = new workbox.backgroundSync.Plugin('projects-update-queue', {
    onSync: async ({queue}) => {
        let entry;
        while (entry = await queue.shiftRequest()) {
            await fetch(entry.request).then(res=> {
                if (Notification.permission === "granted" && entry.request.url.indexOf('projects')!=-1) {
                    self.registration.showNotification('The project was updated successfully!', {
                        body: '🎉`🎉`🎉`'
                    });
                }
            });
        }
    }
});


// 'http://localhost:1337'
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