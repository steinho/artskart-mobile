/// <reference path="OpenLayers.js" />
var app = app || {};

app.ArtskartMap = function (mapDiv) {
    /// <summary>
    ///  Artskart Mobil Map
    ///  Wraps openlayers with Artskart funtionallity
    /// </summary>
    /// <param name="mapDiv">Div Id to place map inside</param>
    var theMapDiv = mapDiv;
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var sm = new OpenLayers.Projection("EPSG:900913"); // visible events
    var gg = new OpenLayers.Projection("EPSG:4326");

    var style = {
        fillOpacity: 0,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.4
    };
    var imageStyle = function () {
        var defaultStyle = new OpenLayers.Style(
            {
                graphicWidth: 23,
                graphicHeight: 27,
                graphicYOffset: -24,
                //label: "${LocationCount}",
                labelOutlineColor: "white",
                labelOutlineWidth: 1,
                fontSize: '10px',
                labelYOffset: 5,
                labelXOffset: 10,
                fontFamily: "Courier New, monospace",
                fontWeight: "bold"
            });

        var ruleP = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "IsAggregated",
                value: true
            }),
            symbolizer: {
                externalGraphic: "img/r_d_large_p.png",
                labelXOffset: 12,
                labelYOffset: 0,
                graphicWidth: 25,
                graphicHeight: 25,
                graphicYOffset: 0
            }
        });

        var ruleSmall = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 0,
                upperBoundary: 20
            }),
            symbolizer: { externalGraphic: "img/r_d_small.png" }
        });

        var ruleMedium = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 20,
                upperBoundary: 100
            }),
            symbolizer: { externalGraphic: "img/r_d_medium.png" }
        });

        var rulelarge = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 100,
                upperBoundary: 9999
            }),
            symbolizer: { externalGraphic: "img/r_d_large.png" }
        });

        defaultStyle.addRules([ruleSmall, ruleMedium, rulelarge, ruleP]);

        var selectStyle = new OpenLayers.Style(
            {
                graphicWidth: 33,
                graphicHeight: 38,
                graphicYOffset: -29,
                //label: "${LocationCount}",
                labelOutlineColor: "white",
                labelOutlineWidth: 1,
                fontSize: '10px',
                labelYOffset: 4,
                labelXOffset: 10,
                fontFamily: "Courier New, monospace",
                fontWeight: "bold"
            });

        var ruleSmalls = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 0,
                upperBoundary: 20
            }),
            symbolizer: { externalGraphic: "img/r_d_small.png" }
        });

        var ruleMediums = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 20,
                upperBoundary: 100
            }),
            symbolizer: { externalGraphic: "img/r_d_medium.png" }
        });

        var rulelarges = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 100,
                upperBoundary: 9999
            }),
            symbolizer: { externalGraphic: "img/r_d_large.png" }
        });

        selectStyle.addRules([ruleSmalls, ruleMediums, rulelarges]);

        return new OpenLayers.StyleMap({ 'default': defaultStyle, 'select': selectStyle });
    };
    var markerStyle = function() {

        var defaultStyle = new OpenLayers.Style(
            {
                graphicWidth: 23,
                graphicHeight: 27
            });

        var ruleP = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "IsAggregated",
                value: true
            }),
            symbolizer: {
                strokeDashstyle: "dot",
                pointRadius: 15,
                fillColor: "#83FF77",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        var ruleSmall = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 0,
                upperBoundary: 20
            }),
            symbolizer: {
                pointRadius: 6,
                fillColor: "green",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        var ruleMedium = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 20,
                upperBoundary: 100
            }),
            symbolizer: {
                pointRadius: 8,
                fillColor: "green",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        var rulelarge = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 100,
                upperBoundary: 9999
            }),
            symbolizer: {
                pointRadius: 10,
                fillColor: "green",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        defaultStyle.addRules([ruleSmall, ruleMedium, rulelarge, ruleP]);

        var selectStyle = new OpenLayers.Style(
            {
                graphicWidth: 33,
                graphicHeight: 38
            });

        var ruleSmalls = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 0,
                upperBoundary: 20
            }),
            symbolizer: {
                pointRadius: 8,
                fillColor: "orange",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        var ruleMediums = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 20,
                upperBoundary: 100
            }),
            symbolizer: {
                pointRadius: 10,
                fillColor: "orange",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        var rulelarges = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "LocationCount",
                lowerBoundary: 100,
                upperBoundary: 9999
            }),
            symbolizer: {
                pointRadius: 12,
                fillColor: "orange",
                fillOpacity: 0.5,
                strokeColor: "black"
            }
        });

        selectStyle.addRules([ruleSmalls, ruleMediums, rulelarges]);


        return new OpenLayers.StyleMap({ 'default': defaultStyle, 'select': selectStyle });
    };
    var setImageStyle = function () {
        observationsLayer.styleMap = imageStyle();
        observationsLayer.redraw();
    };
    var setMarkerStyle = function() {
        observationsLayer.styleMap = markerStyle();
        observationsLayer.redraw();
    };

    var observationsLayer = new OpenLayers.Layer.Vector("Sprinters", { styleMap: imageStyle() });
    var vector = new OpenLayers.Layer.Vector("Vector Layer", { transitionEffect: 'none' });

    var selectControl = new OpenLayers.Control.SelectFeature(observationsLayer, {
        autoActivate: true,
        onSelect: function(feature) {
            featureSelected(feature);
        }
    });

    var geolocateControl = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        }
    });

    geolocateControl.events.register("locationupdated", map, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y), e.position.coords.accuracy / 2, 50, 0), {}, style)
        ]);
        var dataExtent = vector.getDataExtent();
        var getZoomForExtent = map.getZoomForExtent(dataExtent, true);
        if (getZoomForExtent > 16) {
            getZoomForExtent = 16;
        }
        map.setCenter([e.point.x, e.point.y], getZoomForExtent, false, false);
        //that.map.zoomToExtent(dataExtent, true);
        extentChanged();
    });

    $('#' + theMapDiv).html(''); // clean div if there is something there - eg. Map not loaded
    var map = new OpenLayers.Map({
        div: theMapDiv,
        theme: null,
        zoomMethod: null,
        transitionEffect: null,
        projection: sm,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
                                     20037508.34, 20037508.34),
        //resolutions: [156543.033928041,78271.51696402048,39135.75848201023,19567.87924100512,9783.93962050256,4891.96981025128,2445.98490512564,1222.99245256282,611.49622628141,305.7481131407048,152.8740565703525,76.43702828517624,38.21851414258813,19.10925707129406,9.554628535647032,4.777314267823516,2.388657133911758,1.194328566955879,0.5971642834779395,0.29858214173896974,0.14929107086948487],
        //tileManager: new OpenLayers.TileManager(),
        controls: [
            //new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            //new OpenLayersWindowsPinchZoom(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.ZoomBox(),
            geolocateControl,
            selectControl,
            new OpenLayers.Control.ScaleLine({ geodesic: true, bottomOutUnits: '' })
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                numZoomLevels: 18,
                srs: "EPSG:900913",
                projection: sm
            },
                { transitionEffect: 'resize', isBaseLayer: true }),
            new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {
                    numZoomLevels: 20,
                    srs: "EPSG:900913",
                    projection: sm
                },
                { transitionEffect: 'resize', isBaseLayer: true }
            ),
            new OpenLayers.Layer.Google(
                "Google Physical",
                {
                    type: google.maps.MapTypeId.TERRAIN,
                    srs: "EPSG:900913",
                    projection: sm
                },
                { transitionEffect: 'resize', isBaseLayer: true }
            ),
            new OpenLayers.Layer.Google(
                "Google Hybrid",
                {
                    type: google.maps.MapTypeId.HYBRID,
                    numZoomLevels: 20,
                    srs: "EPSG:900913",
                    projection: sm
                },
                { transitionEffect: 'resize', isBaseLayer: true }
            ),
            new OpenLayers.Layer.Google(
                "Google Satellite",
                {
                    type: google.maps.MapTypeId.SATELLITE,
                    numZoomLevels: 22,
                    srs: "EPSG:900913",
                    projection: sm
                },
                { transitionEffect: 'resize', isBaseLayer: true }
            ),
            //new OpenLayers.Layer.Google("Google Streets",
            //    {
            //        numZoomLevels: 20,
            //        projection: this.sm,
            //        srs: "EPSG:900913"
            //    }, { transitionEffect: 'resize' }
            //),
            //new OpenLayers.Layer.Google("Google Physical",
            //    {
            //        type: google.maps.MapTypeId.TERRAIN,
            //        numZoomLevels: 15,
            //        projection: this.sm,
            //        srs: "EPSG:900913"
            //    },
            //    { transitionEffect: 'resize' }
            //),
            //new OpenLayers.Layer.Google("Google Hybrid",
            //    {
            //        type: google.maps.MapTypeId.HYBRID,
            //        numZoomLevels: 20,
            //        projection: this.sm,
            //        srs: "EPSG:900913"
            //    }, { transitionEffect: 'resize' }
            //),
            //new OpenLayers.Layer.Google("Google Satellite",
            //    {
            //        type: google.maps.MapTypeId.SATELLITE,
            //        numZoomLevels: 20,
            //        projection: this.sm,
            //        srs: "EPSG:900913"
            //    }, { transitionEffect: 'resize' }
            //), 
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Aerial",
                name: "Bing Aerial",
                transitionEffect: 'resize',
                numZoomLevels: 19,
                projection: sm
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "AerialWithLabels",
                name: "Bing Aerial + Labels",
                transitionEffect: 'resize',
                numZoomLevels: 19,
                projection: sm
            }),
            vector,
            observationsLayer
        ],

        center: new OpenLayers.LonLat(1800000, 9700000),
        zoom: 4
    });

    // events
    var extentChanged = function() {
        /// <summary>
        ///     Event to bind when wanting to handle a mapExtentChange
        /// </summary>
        $("#" + theMapDiv).trigger("extentChanged", theMapDiv);
    };
    var zoomEnd = function() {

        $("#" + theMapDiv).trigger("zoomEnd", theMapDiv);
    };
    var featureSelected = function(feature) {
        /// <summary>
        ///     Event to bind when wanting to handle a featureselect
        /// </summary>
        $("#" + theMapDiv).trigger("featureSelected", feature);
    };
    map.events.on({
        "zoomend": zoomEnd,
        scope: this
    }); // public functions
    map.events.on({
        "moveend": extentChanged,
        "updatesize": extentChanged,
        scope: this
    });

    var printMarkers = function (json) {
        if (json != null) {
            var gformat = new OpenLayers.Format.GeoJSON();
            var gj = { type: "FeatureCollection", "features": json };

            var features = gformat.read(gj);

            observationsLayer.addFeatures(features);

            $('#btnGetObs').attr('disabled', false);

        }
    };

    var fixContentHeight = function () {
        map.updateSize();
    };
    var clearSelectedMarkers = function()
    {
        selectControl.unselectAll();
    };


    var geoLocate = function () {
        // var control = this.map.getControlsBy("id", "locate-control")[0];
        if (geolocateControl.active) {
            geolocateControl.getCurrentLocation();
        } else {
            geolocateControl.activate();
        }

        // that.extentChanged();
    };

    //sammy.context();
    return {
        map: map, // the map
        resizeMap: fixContentHeight,
        clearSelectedMarkers: clearSelectedMarkers,
        geoLocate: geoLocate,
        setCenterGM: function(y, x, zoom) {
            var lonlat = new OpenLayers.LonLat(y, x);

            map.setCenter(lonlat.transform(gg, sm), zoom);
        },
        setStyle: function (marker) {
            /// <summary>
            ///     Sets map styling to one of "Marker" and "Image"
            /// </summary>
            switch (marker) {
            case "Marker":
                setMarkerStyle();
                break;
            case "Image":
                setImageStyle();
                break;

            default:
            }
        },
        clearFeatures: function() {
            observationsLayer.destroyFeatures();
        },
        drawFeatures: function(json) {
            printMarkers(json);
        }
    };
};



