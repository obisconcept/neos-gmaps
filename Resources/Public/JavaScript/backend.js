if (typeof document.addEventListener === 'function') {

    document.addEventListener('Neos.PageLoaded', function(event) {
        
        initGoogleMaps();
        
    });

}