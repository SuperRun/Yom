if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const worker of registrations) {
            console.log('Service worker:', worker)
        }
    });
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.getRegistrations().then((registrations) => {
    //         for (const worker of registrations) {
    //             console.log('Service worker:', worker)
    //         }
    //     });
    // });

}