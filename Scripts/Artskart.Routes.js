var app = app || {};

app.initiateBrowserNavigation = function(artskartMobile) {
    var amapp = artskartMobile;
    var sammy = $.sammy('#debug', function() {

        var isFirst = true;
        var that = this;
        var isRedirect = false;

        this.before(function (context) {
            // setter context til den navigerte ruten
            that.context = context;
        });

        this.before(/#\/map\/.*/, function() {
            if (isFirst) {
                // bare første gangs navigering
                isFirst = false;
                var centerPoint = this.params['centerPoint'];
                var zoom = this.params['zoom'];
                amapp.zoomToCurrent(centerPoint, zoom);
                amapp.getObservationLocationsTimer();
            }

            amapp.listenExtentChanged(true);
        });

        this.get("#/map/:centerPoint/:zoom/", function() {
             amapp.hidePage();
        });
        this.get("#/map/:centerPoint/:zoom/filter/:filter/", function() {
             amapp.hidePage();
        });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/", function() { detailsUrlHandler(this); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/filter/:filter/", function() { detailsUrlHandler(this); });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/TaxonGroups/:taxongroup/", function() { detailsUrlHandler(this); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/TaxonGroups/:taxongroup/filter/:filter/", function() { detailsUrlHandler(this); });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/TaxonGroups/:taxongroup/Taxon/:taxon/", function() { detailsUrlHandler(this); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/TaxonGroups/:taxongroup/Taxon/:taxon/filter/:filter/", function() { detailsUrlHandler(this); });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Taxon/:taxon/", function() { detailsUrlHandler(this); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Taxon/:taxon/filter/:filter/", function() { detailsUrlHandler(this); });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Observations/:instCode/:collCode/:catNr/", function() { obsdetailUrlHandler(); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Observations/:instCode/:collCode/:catNr/filter/:filter/", function() { obsdetailUrlHandler(); });

        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Taxon/:taxon/observations/:instCode/:collCode/:catNr/", function() { obsdetailUrlHandler(); });
        this.get("#/map/:centerPoint/:zoom/Location/:idp1/:idp2/Taxon/:taxon/observations/:instCode/:collCode/:catNr/filter/:filter/", function() { obsdetailUrlHandler(); });


        this.get("#/filterpage/", function() {
            showPage("filterpage");
        });
        this.get("#/filterpage/filter/:filter/", function() {
            amapp.listenExtentChanged(false);
            this.redirect("#/filterpage/");
        });

        this.get("#/layerspage/", function() {
            showPage("layerspage");
        });
        this.get("#/layerspage/filter/:filter/", function() {
            showPage("layerspage");
        });

        this.get("#/searchpage/", function() {
            showPage("searchpage");
        });
        this.get("#/searchpage/filter/:filter/", function() {
            showPage("searchpage");
        });

        this.get("#/splash/", function() {
            showPage("splash");
        });
        this.get("#/splash/filter/:filter/", function() {
            showPage("splash");
        });

        this.get("#/hvordanbrukeartskart/", function() {
            showPage("divHvordanbrukeArtskart");
        });
        this.get("#/hvordanbrukeartskart/filter/:filter/", function() {
            showPage("divHvordanbrukeArtskart");
        });

        this.get("#/omkildene/", function() {
            showPage("divOmkildene");
        });
        this.get("#/omkildene/filter/:filter/", function() {
            showPage("divOmkildene");
        });

        this.get("#/omartsdatabanken/", function() {
            showPage("divOmArtsdatabanken");
        });
        this.get("#/omartsdatabanken/filter/:filter/", function() {
            showPage("divOmArtsdatabanken");
        });

        var showPage = function(page) {
            amapp.listenExtentChanged(false);
            switch (page) {
            case "splash":
                amapp.showSplash();
                break;
            case "searchpage":
                amapp.showSearchPage();
                break;
            case "layerspage":
                amapp.showLayersPage();
                break;
            case "filterpage":
                amapp.showFilterPage();
                break;
            default:
                amapp.showPage(page);
            }
        };

        var notFound = function() {
            console.log("route not found : " + this.last_location);
            amapp.setBaseUrl("");
        };

        function obsdetailUrlHandler() {

            amapp.listenExtentChanged(false);

            var id = "Observations/" + that.context.params['instCode'] + "/" + that.context.params['collCode'] + "/" + that.context.params['catNr'];
            amapp.getObservationDetail(id);

        }

        var detailsUrlHandler = function() {

            amapp.listenExtentChanged(false);

            if (isRedirect) {
                isRedirect = false;
                return;
            }

            var locationId = that.context.params['idp1'] + "/" + that.context.params['idp2'];

            if (isFirst) {
                isFirst = false;
                amapp.listenExtentChanged(false);
                amapp.zoomToCurrent(locationId.split("/"));
                amapp.listenExtentChanged(true);
            }

            var taxonGroup = "";
            var taxon = "";
            if (that.context.params['taxongroup'])
                taxonGroup = "TaxonGroups/" + that.context.params['taxongroup'];
            if (that.context.params['taxon'])
                taxon = "Taxon/" + that.context.params['taxon'];


            amapp.getObservationLocationData(locationId, taxonGroup, taxon);

        };

        var redirectUrl = function(newLocation) {
            isRedirect = true;
            sammy.trigger('redirect', { to: newLocation });
            sammy.last_location = ['get', newLocation];
            sammy.setLocation(newLocation);
        };

        return {
            context: that.context,
            app: that
        };
    });
    return sammy;
};