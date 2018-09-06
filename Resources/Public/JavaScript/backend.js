if (typeof document.addEventListener === 'function') {

    document.addEventListener('Neos.PageLoaded', function(event) {
        
        initGoogleMaps();
        
    }, false);
    
    document.addEventListener('Neos.NodeCreated', function(event) {
        
        if ($(event.detail.element).find('.google-map-canvas')) {
            
            initGoogleMaps();
            
        }
        
    }, false);

}