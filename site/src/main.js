define(
    [
        "backbone",
        "app",
        "tincanjs"
    ],
    function (Backbone, App, TinCan) {
        //
        // construct an LRS object to use in the application
        // as a place to store data, this ultimately isn't
        // necessary for the Recipes themselves (though the
        // state maintenance could become standardized for them)
        //
        AppConfig._lrs = new TinCan.LRS(
            AppConfig.LRS
        );
        console.log("main - initialized LRS", AppConfig._lrs);

        console.log("main - creating App instance");
        new App ();

        console.log("main - starting backbone history: " + AppConfig.routesRoot);
        Backbone.history.start(
            {
                root: AppConfig.routesRoot
            }
        );
    }
);
