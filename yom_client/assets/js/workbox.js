export default {
    createIndexDB
}

function createIndexDB() {
    if (!('indexedDB' in window)) {return null;}
    return idb.open('dashboardr', 1, function(upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains('events')) {
            const eventsOS = upgradeDb.createObjectStore('events', {keyPath: 'id'});
        }
    });
}
