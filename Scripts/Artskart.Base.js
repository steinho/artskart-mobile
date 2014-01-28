/// <reference path="OpenLayers.js" />
/// <reference path="Artskart.Map.js" />
/// <reference path="Artskart.Routes.js" />
/// <reference path="store.js"/>
/// <reference path="toastr.min.js"/>

var app = app || {};
app.ArtkartMobile = function() {
    /// <summary>
    ///  Artskart Mobil App
    /// </summary>
    var mapJsonRequest;
    var listJsonRequest;
    var detailsJsonRequest;
    var locationJsonRequest;
    var lastUpdatedNdToken;
    var theMap;
    var vmModelTaxonGroups;
    var vmModelTaxons;
    var vmModelObservations;
    var vmlistDetailViewModel;
    var filter;
    var $locationClass;
    var $page;
    var $fullPage;
    var $pageSlideUp;
    var $splash;
    var $splashImg;
    var $modalBg;
    var $layerspage;
    var $searchpage;
    var $ddStatus;
    var $ddTaxongroups;
    var $ddObsPrecision;
    var $ddActivity;
    var $tbTaxonName;
    var $tbdateFrom;
    var $rdoPresNotSet;
    var $tbTaxonNameVal;
    var $tbMaxMarkers;
    var $summary;
    var $chkShowOnlyImageObs;
    var $btnBack;
    var $pagecontent;
    var $observationList;
    var $observationListpage;
    var $observationLocationList;
    var $observationLocationTaxonGroups;
    var $observationLocationTaxons;
    var $observationDetails;
    var $detailImgContainer;
    var $detailImgdialogContainer;
    var $listHeader;
    var $layerslist;
    var $loading;
    var $filterpage;
    var $chkSplashNoShow;
    var $searchResultsTaxon;
    var $searchResultsSted;
    var $btnImgFilter;
    var $dialogLocation;
    var $query;
    var $filterTaxonGroup;
    var $filterTaxon;
    var $map;
    var navigationHistory;

    var getNdToken = function() {
        /// <summary> Gets the Norge digitalt Token </summary>
        var getNdTokenTimer = function() {
            window.clearTimeout(this.timeoutTokenID);
            this.timeoutTokenID = window.setTimeout(function() { getNdToken(); }, 3600000);
        };

        var firstNdToken = true;
        var ndurl;

        var diff = new Date().getTime() - lastUpdatedNdToken;

        if (diff > 3600000 || (isNaN(lastUpdatedNdToken))) {

            $.ajax({
                url: url + 'GetNorgeDigitaltToken',
                timeout: 25000,
                dataType: "jsonp",
                contentType: "application/json; charset=utf-8"
            }).done(function(data) {

                ndurl = "http://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.cache?gkt=" + data.Token + "&";
                lastUpdatedNdToken = new Date().getTime();
                var oldLayer = theMap.map.getLayersByName('StatKart Topografisk norgeskart')[0];
                if (oldLayer) {
                    oldLayer.setUrl(ndurl);
                } else {
                    var ndLayer = new OpenLayers.Layer.WMS('StatKart Topografisk norgeskart', ndurl,
                        {
                            layers: 'topo2',
                            format: 'image/jpeg',
                            projection: theMap.sm,
                            srs: theMap.sm,
                            numZoomLevels: 20
                        }, { transitionEffect: 'resize', isBaseLayer: true }
                    );
                    theMap.map.addLayer(ndLayer);
                    if (firstNdToken) {
                        if (ndLayer.isBaseLayer) {
                            theMap.map.setBaseLayer(ndLayer);
                        } else {
                            ndLayer.setVisibility(!layer.getVisibility());
                        }
                        firstNdToken = false;
                    }

                }
                //initLayerList(theMap.map);
                getNdTokenTimer();

            }).fail(
                function(jqxhr, message) {
                    var oldLayer = theMap.map.getLayersByName('Topografisk norgeskart');
                    if (oldLayer.length)
                        theMap.map.removeLayer(oldLayer);
                    showError('Feil under henting av NorgeDigitaltToken: ' + message);
                }
            );
        }

        getNdTokenTimer();
    };

    var nullStillFilter = function() {
        $ddObsPrecision.prop('selectedIndex', 2);
        ////updateUrlFilter();
    };

    var loadFilterValues = function() {

        if (store.enabled) {

            try {


                var observationStatusString = store.get('observationStatusValues');
                if (observationStatusString !== null && observationStatusString != 'undefined') {
                    populateSelectGroup(observationStatusString, $ddStatus);
                }

                var taxongroupsString = store.get('taxongroupsValues');
                if (taxongroupsString !== null && taxongroupsString != 'undefined') {
                    populateSelect(taxongroupsString, $ddTaxongroups);
                }

                var precisionString = store.get('precisionValues');
                if (precisionString !== null && precisionString != 'undefined') {
                    populateSelect(precisionString, $ddObsPrecision);
                }

                var activityString = store.get('activityValues');
                if (activityString !== null && activityString != 'undefined') {
                    populateSelect(activityString, $ddActivity);
                }

                var maxMarkeString = store.get('maxMarkersValue');
                if (maxMarkeString !== null && maxMarkeString != 'undefined') {
                    $tbMaxMarkers.val(maxMarkeString);
                }


            } catch (e) {
                store.clear();
            }

        }


        $.ajax({
            type: "GET",
            url: apiurl + 'Lookup/?context=status',
            dataType: "jsonp",
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                populateSelectGroup(data, $ddStatus);
                if (store.enabled) {
                    store.set('observationStatusValues', data);
                }
            }
        });

        $.ajax({
            type: "GET",
            url: apiurl + 'Lookup/?context=taxongroup',
            dataType: "jsonp",
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                populateSelect(data, $ddTaxongroups);
                if (store.enabled) {
                    store.set('taxongroupsValues', data);
                }
            }
        });

        $.ajax({
            type: "GET",
            url: apiurl + 'Lookup/?context=activity',
            dataType: "jsonp",
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                populateSelect(data, $ddActivity);
                if (store.enabled) {
                    store.set('activityValues', data);
                }
            }
        });

        $.ajax({
            type: "GET",
            url: apiurl + 'Lookup/?context=geoprecision',
            dataType: "jsonp",
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                populateSelect(data, $ddObsPrecision);
                if (store.enabled) {
                    store.set('precisionValues', data);
                }
            }
        });


        function populateSelect(data, selectField) {
            selectField.empty().append(getHtml(data));

            function getHtml(data) {

                var html = '';
                html = "<option value=' '>Velg en...</option>";
                $.each(data, function(i, item) {
                    html += '<option value="' + item.Key + '">' + item.Value + '</option>';
                });

                return html;
            }

        }


        function populateSelectGroup(data, selectField) {
            selectField.empty().append(getHtml(data));

            function getHtml(data) {

                var html = '';
                html = "<option value=' '>Velg en...</option>";


                $.each(data, function(i, group) {
                    html += "<optgroup label= '" + group.Key + "'>";
                    $.each(group.ValueList, function(j, item) {
                        html += '<option value="' + item.Key + '">' + item.Value + '</option>';
                    });
                    html += "</optgroup>";
                });

                return html;
            }

        }


    };

    var getLocationByTerm = function() {
        /// <summary>Søk etter stedsnavn </summary>
        var getZoomByType = function(productTypeLevel) {

            switch (productTypeLevel) {
            case 1:
                return 16;
            case 2:
                return 14;
            case 3:
                return 12;
            case 4:
                return 4;
            default:
                return 14;
            }

        };
        var searchUrl = url + 'GetLocationByTerm?term=';
        searchUrl += $query[0].value + '*';
        $searchResultsSted.empty();
        if (locationJsonRequest != null) {
            locationJsonRequest.abort();
        }

        locationJsonRequest = $.ajax({
            type: "GET",
            url: searchUrl,
            dataType: "jsonp",
            timeout: 20000,
            success: function(data) {

                $.each(data, function() {
                    var place = this;
                    var desc = '<b>' + place.MunicipalityName + '</b> ';
                    if (place.CountyName) {
                        desc += ', ' + place.CountyName;
                    }

                    desc += ', ' + place.Product;

                    $('<li class="next">')
                        .hide().append($('<a />').append($('<b />', { text: place.Name })).append($('<p />', { html: desc })))
                        .appendTo($searchResultsSted)
                        .click(function() {

                            listenExtentChanged(true);
                            theMap.setCenterGM(place.Coordinate.Y, place.Coordinate.X, getZoomByType(place.ProductTypeLevel));
                            $modalBg.fadeOut();
                            $searchpage.hide();
                        })
                        .show();
                });
                $.unblockUI();
            },
            error: function(jqXHR, exception) {
                if (exception === 'abort') {
                } else {
                    showError('Feil under søk: ' + exception);

                }
            }
        });
    };

    var getTaxonByName = function() {
        /// <summary>Søk etter arter </summary>
        var searchUrl = url + 'GetTaxonNames?term=';
        searchUrl += $tbTaxonName[0].value;

        //$search_resultsTaxon.empty();
        $searchResultsTaxon.show();

        if (locationJsonRequest != null) {
            locationJsonRequest.abort();
        }

        locationJsonRequest = $.ajax({
            type: "GET",
            url: searchUrl,
            dataType: "jsonp",
            timeout: 20000,
            success: function(data) {
                $searchResultsTaxon.empty();
                $.each(data, function() {
                    var taxon = this;

                    $('<li class="next">')
                        .hide().append(($('<a />').append($('<b />', { text: taxon.label }))))
                        .appendTo($searchResultsTaxon)
                        .click(function() {
                            $tbTaxonNameVal.val(taxon.value);
                            $tbTaxonName.val(taxon.label);
                            $searchResultsTaxon.empty();
                            $searchResultsTaxon.hide();

                        })
                        .show();
                });
                $.unblockUI();
            },
            error: function(jqXHR, exception) {
                if (exception === 'abort') {
                } else {
                    showError('Feil under søk: ' + exception);

                }
            }
        });
    };

    var initLayerList = function(map) {
        ///<summary> Henter liste av kartlag fra map til kartlagliste</summary>
        $layerslist.empty();

        var baseLayers = map.getLayersBy("isBaseLayer", true);
        $.each(baseLayers, function() {
            addLayerToList(this);
        });

        //map.events.register("addlayer", this, function(e) {
        //    addLayerToList(e.layer);
        //});

        function addLayerToList(layer) {
            var item = $('<li class="next' + (layer.visibility ? ' checked">' : '">')
                )
                .append($('<b />')
                    .append($('<a />', {
                            text: layer.name
                        })
                        .click(function() {

                            if (layer.isBaseLayer) {
                                theMap.map.setBaseLayer(layer);
                            } else {
                                layer.setVisibility(!layer.getVisibility());
                            }
                            setBaseUrl();

                            $modalBg.fadeOut();
                            $layerspage.hide();
                        })
                    ).append('<span />'))
                .appendTo('#layerslist');
            //layer.events.on({
            //    'visibilitychanged': function() {
            //        $(item).toggleClass('checked');
            //    }
            //});
        }

    };

    // get geolocations
    // todo: noe er ulogisk her - timeing
    var getObservationLocationsTimerId;
    var getObservationLocationsTimer = function() {

        if (mapJsonRequest != null) {
            mapJsonRequest.abort();
        }
        $loading.hide(25);

        window.clearTimeout(getObservationLocationsTimerId);

        getObservationLocationsTimerId = window.setTimeout(function() { getObservationLocations(); }, 700);
    };
    var getObservationLocations = function() {
        window.clearTimeout(getObservationLocationsTimerId);
        if (typeof (theMap.map) === 'undefined')
            return;

        if (mapJsonRequest != null) {
            mapJsonRequest.abort();
        }

        $summary.empty();
        $loading.show(15);

        var filterValues = filter.getUrlParams();
        var param = $.param(filterValues);

        mapJsonRequest = $.ajax({
            async: true,
            global: false,
            //url: url + 'GetObservationLocations?' + param,
            url: apiurl + 'Location?requestType=locations&' + param,
            timeout: 20000,
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: (function(data) {
                $loading.hide(10);
                var count = data.Count;
                var totalcount = data.TotalCount;

                if (data.FeaturesIsAggregated) {
                    $summary.hide();
                } else {
                    $summary.html('<strong>' + count + ' av ' + totalcount + '</strong>').fadeIn(50);
                }

                theMap.clearFeatures();
                var json = eval(data.Features);
                theMap.drawFeatures(json);

            }),
            fail: (function(jqxhr, message) {

                if (message === 'abort') {
                } else {
                    theMap.clearFeatures();
                    showError('Feil under henting av markører: ' + message);
                }
                $loading.hide(50);

            })
        });

    };

    var urlHandler = function(locationId, taxonGroupId, taxonId, observationId) {

        var centerPoint = navigationHistory.context.params['centerPoint'];
        var zoomLevel = navigationHistory.context.params['zoom'];

        if (!locationId) {
            locationId = navigationHistory.context.params['idp1'] + "/" + navigationHistory.context.params['idp2'];
        }

        var hash = "#/map/" + centerPoint + "/" + zoomLevel + "/";

        if (locationId) {
            hash += "Location/" + locationId + "/";
        }

        if (observationId) {
            hash += observationId + "/";
        } else if (taxonId) {
            hash += taxonId + "/";
        } else if (taxonGroupId) {
            hash += taxonGroupId + "/";
        }

        return hash;

    };

    function setBaseUrl(filterparams) {

        listenExtentChanged(true);

        var mapZoom = theMap.map.getZoom();
        var lon = parseFloat(theMap.map.center.lon).toFixed(0);
        var lat = parseFloat(theMap.map.center.lat).toFixed(0);

        var hash = "#/map/" + lon + "," + lat + "/" + mapZoom + "/";

        setHash(hash, filterparams);

    }

    function updateUrlFilter() {

        var params = filter.getActiveFilterValues();
        setBaseUrl(params);
    }

    function setHash(hash, filterparams, clearFilter) {

        var fitlerHash = getFilterHash(filterparams);
        if (!clearFilter) {
            hash += fitlerHash;
        }
        window.location.hash = hash;

    }

    function getFilterHash(filterparams) {

        var hashFilter = "";

        if (filterparams) {
            hashFilter = "filter/";
            var params = "";
            var first = true;
            $.each(filterparams, function(index, param) {
                if (first) {
                    params += param;
                    first = false;
                } else {
                    params += "&" + param;
                }

            });

            hashFilter += params + "/";

        } else if (navigationHistory.context) {

            if (navigationHistory.context.params) {
                var filterParam = navigationHistory.context.params['filter'];

                if (filterParam) {
                    if (filterParam != "undefined") {
                        hashFilter += "filter/" + filterParam + "/";
                    }
                }
            }
        }

        return hashFilter;
    }

    var getObservationLocationData = function(locationId, taxonGroupId, taxonId) {

        vmModelTaxonGroups.clear();
        vmModelTaxons.clear();
        vmModelObservations.clear();

        $btnBack.hide();
        $btnBack.off('click');
        $observationLocationList.hide();
        $observationLocationTaxonGroups.hide();
        $observationLocationTaxons.hide();
        $observationDetails.hide();
        $observationList.empty();

        if (!$observationListpage.is(':visible')) {
            $observationListpage.show();
        }

        if (!$modalBg.is(':visible')) {
            $modalBg.show();
        }

        var loadingTimeout = setTimeout(function() {
            $pagecontent.block({ message: 'Henter observasjoner... <br /><img style="height: 4px;width:288px;" src="img/loadingDots.gif" /> ' });
        }, 800);


        var filterValues = filter.getUrlParams();
        var filterParams = {
            id: locationId,
            precision: filterValues.precision,
            taxons: taxonId || filterValues.taxons,
            status: filterValues.status,
            taxongroups: taxonGroupId || filterValues.taxongroups,
            onlyImageObs: filterValues.onlyImageObs,
            includeObsNoPrec: filterValues.includeObsNoPrec,
            activityType: filterValues.activityType,
            dateFrom: filterValues.dateFrom,
            behaviors: filterValues.behaviors
        };

        var param = $.param(filterParams);
        if (listJsonRequest != null) {
            listJsonRequest.abort();
        }
        listJsonRequest = $.ajax({
            type: "GET",
            url: apiurl + 'Location?requestType=list&' + param,
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            timeout: 20000,
            success: function(data) {

                if (data.MetaData) {

                    //if (!taxonId) {
                    //    if (data.MetaData.TaxonGroups.length == 1) {
                    //        taxonGroupId = data.MetaData.TaxonGroups[0].Id;
                    //        var url = urlHandler("", taxonGroupId);
                    //        var fitlerHash =  getFilterHash();
                    //        url += fitlerHash;
                    //        if ("/" + url != sammy.context.path) {
                    //            sammy.redirectUrl(url);
                    //        }
                    //    }
                    //}

                    if (taxonId) {
                        populateObservationList(data);
                    } else if (taxonGroupId) {
                        populateTaxonList(data, taxonGroupId, true);
                    } else if (locationId) {
                        populateTaxongroupList(data);

                    }
                } else {

                    showWarning("Ingen observasjoner funnet.");

                    setTimeout(hidePage, 1500);
                }

                $pagecontent.unblock();
                //$.unblockUI();
                clearTimeout(loadingTimeout);

            },
            error: function(jqXHR, error) {
                if (error === 'abort') {

                } else {
                    $observationList.empty();
                    $.unblockUI();
                    clearTimeout(loadingTimeout);
                    $pagecontent.unblock();
                    showError("Failed to load details: " + error);
                    setTimeout(hidePage, 1500);
                }
            }
        });
    };

    function populateTaxongroupList(currentModel) {
        if (currentModel.MetaData.TaxonGroups.length == 1) {
            // bare en - vis treff i stedet...
            populateTaxonList(currentModel, currentModel.MetaData.TaxonGroups[0].Id, false);
        } else {
            // flere - vis grupper
            $listHeader.text('Artsgrupper');
            $observationLocationTaxonGroups.show();


            vmModelTaxonGroups.init(currentModel.MetaData);

            $.each(currentModel.MetaData.TaxonGroups, function(index, tg) {

                tg.url = urlHandler("", tg.Id);
                vmModelTaxonGroups.add(tg);
            });
        }
    }

    function populateTaxonList(currentModel, taxonGroupId, backNavigation) {

        $listHeader.text('Arter');
        $observationLocationTaxons.show();

        vmModelTaxons.clear();
        var taxonGroup;
        $.each(currentModel.MetaData.TaxonGroups, function(index, tg) {
            if (tg.Id == taxonGroupId) {
                taxonGroup = tg;
                return false;
            }
        });

        vmModelTaxons.init(currentModel.MetaData);
        vmModelTaxons.taxonGroupName(taxonGroup.Name);
        vmModelTaxons.taxonCount(currentModel.MetaData.TaxonGroups.length);

        if (!taxonGroupId) {
            $.each(currentModel.MetaData.Taxons, function(index, tg) {
                vmModelTaxons.add(tg);
            });
        } else {
            $.each(currentModel.MetaData.Taxons, function(index, t) {
                if (t.TaxonGroupId == taxonGroupId) {

                    var url = urlHandler("", "", t.Id);
                    t["url"] = url;
                    vmModelTaxons.add(t);
                }
            });
        }

        if (backNavigation && currentModel.MetaData.TaxonGroups.length >= 1) {

            $btnBack.show();
            var url = urlHandler();
            $btnBack.click(function() {
                setHash(url);
            });

        }

    }

    function populateObservationList(currentModel) {

        $listHeader.text('Observasjoner');
        $observationLocationList.show();

        vmModelObservations.init(currentModel.MetaData);

        $.each(currentModel.ObservationList, function(index, tg) {

            var url = urlHandler("", "", "", tg.Id.replace("observations", "Observations"));
            tg["url"] = url;
            vmModelObservations.add(tg);
        });

        $btnBack.show();

        var taxonGroupId = "";
        if (currentModel.MetaData.TaxonGroups.length > 0) {
            taxonGroupId = currentModel.MetaData.TaxonGroups[0].Id;
        }


        var url = urlHandler("", taxonGroupId);

        $btnBack.click(function() {
            setHash(url);
        });


    }

    function getObservationDetail(id) {

        var loadingTimeout = setTimeout(function() {
            $pagecontent.block({ message: 'Henter observasjon' });
        }, 500);

        $modalBg.show();
        $observationListpage.show();
        $observationLocationList.hide();
        $observationLocationTaxonGroups.hide();
        $observationLocationTaxons.hide();
        $btnBack.off('click');


        var param = $.param({ id: id });

        if (detailsJsonRequest != null) {
            detailsJsonRequest.abort();
        }
        detailsJsonRequest = $.ajax({
            type: "GET",
            //url: url + 'GetGeoObservationDetails/?' + param,
            url: apiurl + 'Observations/?' + param,
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            timeout: 20000,
            success: function(data) {


                vmlistDetailViewModel.init(data);

                $listHeader.text('Observasjon');
                $observationDetails.show();
                $detailImgContainer.empty();
                $detailImgdialogContainer.empty();


                if (!vmModelObservations.hasData()) {

                    $btnBack.hide();
                } else {
                    var taxonId = vmModelObservations.taxonId();


                    $btnBack.click(function() {
                        setHash(urlHandler("", "", taxonId));
                    });
                }

                var dialogsContainer = $detailImgContainer;

                if (data.ThumbImgUrls.length) {
                    $.each(data.ThumbImgUrls, function(i, val) {

                        var foto = val.Collector.split(",")[0];
                        dialogsContainer.append('<a class="fancybox" title="© ' + foto + '" rel="group" href="' + val.ImageUrl + '"><img src="' + apiurl + "Image?id=" + val.ThumbId + '" alt="" /></a>');

                    });

                    $(".fancybox")
                        .fancybox(
                        {
                            helpers: { title: { type: 'over' } },
                            padding: 5,
                            beforeShow: function() {
                                $.fancybox.wrap.bind("contextmenu", function(e) {
                                    return false;
                                });
                            }
                        });
                }

                $pagecontent.unblock();
                $.unblockUI();
                clearTimeout(loadingTimeout);

            },
            error: function(jqXHR, error) {
                if (error === 'abort') {

                } else {
                    $pagecontent.unblock();
                    $.unblockUI();
                    clearTimeout(loadingTimeout);
                    showError("Failed to load details: " + error);
                }

            }
        });
    }

    var filterAktiv = false;

    function filterModel() {

        this.getActiveFilterValues = function() {

            var propertyObsPrecision = $.trim($ddObsPrecision.val());
            var propertyStatus = $.trim($ddStatus.val());
            var taxongroupId = $.trim($ddTaxongroups.val());
            var activityType = $.trim($ddActivity.val());
            var taxonId = $.trim($tbTaxonNameVal.val());
            var onlyImageObs = $chkShowOnlyImageObs.is(':checked');
            var includeObsNoPrec = $rdoPresNotSet.is(':checked');
            var maxMarkers = $tbMaxMarkers.val();

            var dateFrom = $tbdateFrom.datepicker({ dateFormat: 'dd-mm-yy' }).val().replace(/\//g, '.');


            var filterAktiv = getFilterAktivEval(propertyObsPrecision, propertyStatus, taxongroupId, taxonId, onlyImageObs, includeObsNoPrec, activityType, dateFrom);
            var test = new RegExp("[^/]*$");
            if (filterAktiv) {
                var result = new Array();
                var regMatch = test; // /[^/]*$/;
                if (taxonId) {
                    result.push("taxons[]=" + regMatch.exec(taxonId)[0]);
                }
                if (taxongroupId) {
                    result.push("taxongroups[]=" + regMatch.exec(taxongroupId)[0]);
                }
                if (propertyStatus) {
                    result.push("status[]=" + regMatch.exec(propertyStatus)[0]);
                }
                if (propertyObsPrecision) {
                    result.push("precision=" + regMatch.exec(propertyObsPrecision)[0]);
                }
                if (onlyImageObs) {
                    result.push("onlyImageObs=" + onlyImageObs);
                }
                if (activityType) {
                    result.push("behaviors[]=" + regMatch.exec(activityType)[0]);
                }
                if (!includeObsNoPrec) {
                    result.push("includeObsNoPrec=" + includeObsNoPrec);
                }
                if (maxMarkers != 150) {
                    //  result.push("maxMarkers=" + maxMarkers);
                }
                if (dateFrom) {
                    result.push("dateFrom=" + dateFrom);
                }

                return result;
            }
            return "";


        };

        this.getUrlParams = function() {

            var hash, vars = [];
            var status = new Array();
            var taxongroups = new Array();
            var taxons = new Array();
            var behaviors = new Array();
            var precision = "";
            var includeObsNoPrec = true;
            var onlyImageObs = false;
            var dateFrom = "";
            var activityType = "";


            if (navigationHistory.context.params) {

                var filterParam = navigationHistory.context.params['filter'];

                if (filterParam) {
                    if (filterParam != "undefined") {

                        var decode = decodeURIComponent(filterParam);
                        var hashes = decode.split('&');
                        for (var i = 0; i < hashes.length; i++) {

                            if (hashes[i].length) {

                                hash = hashes[i].split('=');

                                var key = stripTrailingSlash(hash[0]);
                                var value = stripTrailingSlash(hash[1]);

                                if (key == "taxongroups[]") {

                                    $.each(value.split(','), function(i, val) {
                                        if (val) {
                                            taxongroups.push("TaxonGroups/" + val);
                                        }
                                    });

                                } else if (key == "taxons[]") {

                                    $.each(value.split(','), function(i, val) {
                                        if (val) {
                                            taxons.push("Taxon/" + val);
                                        }
                                    });


                                } else if (key == "status[]") {
                                    $.each(value.split(','), function(i, val) {
                                        if (val) {
                                            status.push(val);
                                        }
                                    });

                                } else if (key == "behaviors[]") {

                                    $.each(value.split(','), function(i, val) {
                                        if (val) {
                                            behaviors.push("behaviors/" + val);
                                        }
                                    });


                                } else if (key == "includeObsNoPrec") {
                                    includeObsNoPrec = strToBool(value);
                                } else if (key == "precision") {
                                    precision = value;
                                } else if (key == "onlyImageObs") {
                                    onlyImageObs = strToBool(value);

                                } else if (key == "maxMarkers") {
                                    maxMarkers = value;
                                    $tbMaxMarkers.val(maxMarkers);

                                } else if (key == "dateFrom") {
                                    dateFrom = value;
                                    $tbdateFrom.val(dateFrom);

                                } else if (key == "activityType") {
                                    activityType = value;

                                }


                            }


                        }
                    }
                }
            }

            function stripTrailingSlash(str) {
                if (str) {
                    if (str.substr(-1) == '/') {
                        return str.substr(0, str.length - 1);
                    }
                }
                return str;
            }


            //var includeObsNoPrec = $rdoPresNotSet.is(':checked');
            var mapExtent = theMap.map.getExtent();
            var zoomLevel = theMap.map.getZoom();
            var maxMarkers = $tbMaxMarkers.val();

            var filterValues = {
                bounds: mapExtent.toBBOX(),
                maxMarkers: maxMarkers,
                zoomLevel: zoomLevel,
                taxons: taxons,
                behaviors: behaviors,
                precision: precision,
                includeObsNoPrec: includeObsNoPrec,
                status: status,
                taxongroups: taxongroups,
                onlyImageObs: onlyImageObs,
                activityType: activityType,
                dateFrom: dateFrom
            };

            window.filterAktiv = getFilterAktivEval(precision, status, taxongroups, taxons, onlyImageObs, includeObsNoPrec, activityType, dateFrom);

            if (window.filterAktiv) {
                $btnImgFilter.attr('src', 'img/filterAktiv.png');
            } else {
                $btnImgFilter.attr('src', 'img/filter.png');
            }


            return filterValues;

        };

        //this.updateDOMFilter = function() {

        //    var urlFilter = this.getUrlParams();

        //    //bounds: mapExtent.toBBOX(),
        //    //maxMarkers: maxMarkers,
        //    //zoomLevel: zoomLevel,
        //    //taxons: taxons,
        //    //precision: precision,
        //    //includeObsNoPrec: includeObsNoPrec,
        //    //status: status,
        //    //taxongroups: taxongroups,
        //    //onlyImageObs: onlyImageObs


        //    //var propertyObsPrecision = $.trim($ddObsPrecision.val());
        //    //var propertyStatus = $.trim($ddStatus.val());
        //    //var taxongroupId = $.trim($ddTaxongroups.val());
        //    //var taxonId = $.trim($tbTaxonNameVal.val());
        //    //var onlyImageObs = $('#showImageObs').val();
        //    //var includeObsNoPrec = $rdoPresNotSet.is(':checked');


        //    if (urlFilter.maxMarkers) {
        //        $tbMaxMarkers.val(maxMarkers);
        //    }
        //    if (urlFilter.taxons) {

        //    } else if (taxongroups) {

        //    }

        //    if (urlFilter.precision) {

        //    }
        //    if (urlFilter.onlyImageObs) {

        //    }


        //    if (urlFilter.status) {

        //    }


        //};

        function getFilterAktivEval(propertyObsPrecision, propertyStatus, taxongroupId, taxonId, onlyImageObs, includeObsNoPrec, activityType, dateFrom) {

            if (strHasValue(propertyObsPrecision) ||
                strHasValue(propertyStatus) ||
                strHasValue(taxongroupId) ||
                strHasValue(taxonId) ||
                strHasValue(activityType) ||
                strHasValue(dateFrom) ||
                onlyImageObs ||
                !includeObsNoPrec) {
                return true;
            } else {
                return false;
            }


            function strHasValue(str) {
                if (str == null || str == '')
                    return false;
                else
                    return true;
            }

        }


    }

    function strToBool(str) {
        if (str == null || str == '')
            return false;
        else if (str == 'true' || str == 'True')
            return true;
        return false;
    }

    function showFilterPage() {

        $searchResultsTaxon.empty().hide();
        $modalBg.show();
        $filterpage.fadeIn();


    }

    function showLayersPage() {
        $modalBg.show();
        $layerspage.fadeIn();
        initLayerList(theMap.map);
    }

    function hidePage() {

        if ($page.is(":visible"))
            $page.hide();

        if ($fullPage.is(":visible"))
            $fullPage.hide();

        if ($pageSlideUp.is(":visible"))
            $pageSlideUp.hide();

        if ($splash.is(":visible"))
            $splash.hide();

        if ($splashImg.is(":visible"))
            $splashImg.hide();

        if ($modalBg.is(":visible"))
            $modalBg.hide();


        clearTimeout(unselectAllMarkers);
        setTimeout(unselectAllMarkers, 500);


    }

    function unselectAllMarkers() {
        theMap.clearSelectedMarkers();
    }

    function showSplash() {
        hidePage();
        $modalBg.show();
        $splash.fadeIn();
        //theMap.geoLocate();
    }

    function hideSplash() {
        $splash.hide();
        $splashImg.hide();
        $modalBg.hide();

    }

    function showPage(pageName) {
        hidePage();
        $modalBg.show();
        $('#' + pageName).fadeIn();
    }

    function showSearchPage() {
        $modalBg.show();
        $searchpage.fadeIn();
        $locationClass.hide();
    }

    function showError(error) {
        toastr.error(error, 'Feil oppstod');
    }

    function showWarning(message) {
        toastr.warning(message);
    }

    function zoomToExtent(boundsarray) {
        listenExtentChanged(false);
        var bounds = new OpenLayers.Bounds(boundsarray.split(","));
        theMap.map.zoomToExtent(bounds, true);
        //getObservationLocations();
        listenExtentChanged(true);

    }

    function zoomToCurrent(coords) {
        listenExtentChanged(false);
        var lonlat = new OpenLayers.LonLat(coords[0].replace(",", "."), coords[1].replace(",", "."));
        theMap.map.setCenter(lonlat.transform(theMap.gg, theMap.sm), 14, false, false);
        listenExtentChanged(true);
    }

    function zoomToCurrent(point, zoomLevel) {
        listenExtentChanged(false);
        var zoom = zoomLevel || 14;
        var lonlat = new OpenLayers.LonLat(point.split(","));
        theMap.map.setCenter(lonlat, zoom, false, false);
        listenExtentChanged(true);
    }

    var listenExtentChanged = function(listen) {
        ///<summary>Slå lytting på map events av og på</summary>
        //  $map = $('#map');
        $map.off("extentChanged");
        $map.off("zoomEnd");
        if (listen) {
            $map.on("extentChanged", function() {
                getObservationLocationsTimer();
                setBaseUrl();
            });
            $map.on("zoomEnd", function() {
                getObservationLocations();
                setBaseUrl();
            });
        }
    };

    var onResume = function() {
        onBrowserResized();
        getNdToken();
    };

    var setupImgHover = function() {
        /// <summary>Sett hover og unhover images i gui</summary>
        $('#btnHvordanbrukeArtskart').hover(function() {
            $(this).attr('src', 'img/btnHvordanbrukeArtskart_over.png');
        }, function() {
            $(this).attr('src', 'img/btnHvordanbrukeArtskart.png');
        });

        $('#btnOmkildene').hover(function() {
            $(this).attr('src', 'img/btnOmkildene_over.png');
        }, function() {
            $(this).attr('src', 'img/btnOmkildene.png');
        });


        $('#btnOmArtsdatabanken').hover(function() {
            $(this).attr('src', 'img/btnOmArtsdatabanken_over.png');
        }, function() {
            $(this).attr('src', 'img/btnOmArtsdatabanken.png');
        });


        $('.btnX').hover(function() {
            $(this).attr('src', 'img/btnX_over.png');
        }, function() {
            $(this).attr('src', 'img/btnX.png');
        });

        $('.btnNullstil').hover(function() {
            $(this).attr('src', 'img/btnNullstil_over.png');
        }, function() {
            $(this).attr('src', 'img/btnNullstil.png');
        });

        $('.btnBack').hover(function() {
            $(this).attr('src', 'img/btnBack_over.png');
        }, function() {
            $(this).attr('src', 'img/btnBack.png');
        });

        $('.btnOk').hover(function() {
            $(this).attr('src', 'img/btnOK_over.png');
        }, function() {
            $(this).attr('src', 'img/btnOK.png');
        });


        $('.btnPil').hover(function() {
            $(this).attr('src', 'img/pil_over.png');
        }, function() {
            $(this).attr('src', 'img/pil.png');
        });

        $('.btnArk').hover(function() {
            $(this).attr('src', 'img/ark_over.png');
        }, function() {
            $(this).attr('src', 'img/ark.png');
        });

        $('.btnFilter').hover(function() {
            $(this).attr('src', 'img/filter_over.png');
        }, function() {
            if (window.filterAktiv) {
                $(this).attr('src', 'img/filterAktiv.png');
            } else {
                $(this).attr('src', 'img/filter.png');
            }

        });

        $('.btnPluss').hover(function() {
            $(this).attr('src', 'img/pluss_over.png');
        }, function() {
            $(this).attr('src', 'img/pluss.png');
        });

        $('.btnMinus').hover(function() {
            $(this).attr('src', 'img/minus_over.png');
        }, function() {
            $(this).attr('src', 'img/minus.png');
        });

        $('.btnLocate').hover(function() {
            $(this).attr('src', 'img/locate_over.png');
        }, function() {
            $(this).attr('src', 'img/locate.png');
        });

        $('.btnNorway').hover(function() {
            $(this).attr('src', 'img/norway_over.png');
        }, function() {
            $(this).attr('src', 'img/norway.png');
        });

        $('.btnSok').hover(function() {
            $(this).attr('src', 'img/sok_over.png');
        }, function() {
            $(this).attr('src', 'img/sok.png');
        });

    };

    var onBrowserResized = function () {
        /// <summary>
        ///  What to do when browser resizes
        /// </summary>
        theMap.resizeMap();
    };

    var run = function() {
        //FastClick.attach(document.body);
        window.jQuery.ajaxSettings.traditional = true;
        $.ajaxSetup({ cache: false });

        $.support.cors = true;
        $.blockUI.defaults.css = {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        };

        $locationClass = $('.locationClass');
        $page = $('.page');
        $fullPage = $('.fullPage');
        $pageSlideUp = $('.pageSlideUp');
        $splash = $('#splash');
        $splashImg = $('#splashImg');
        $modalBg = $('#modalBg');
        $layerspage = $('#layerspage');
        $searchpage = $('#searchpage');
        $ddStatus = $('#ddStatus');
        $ddTaxongroups = $('#ddTaxongroups');
        $ddObsPrecision = $('#ddObsPrecision');
        $ddActivity = $('#ddActivity');
        $tbTaxonName = $('#tbTaxonName');
        $tbdateFrom = $('#tbdateFrom');
        $rdoPresNotSet = $('#rdoPresNotSet');
        $tbTaxonNameVal = $('#tbTaxonNameVal');
        $tbMaxMarkers = $('#tbMaxMarkers');
        $summary = $('#summary');
        $chkShowOnlyImageObs = $('#chkShowOnlyImageObs');
        $btnBack = $('#btnBack');
        $pagecontent = $('.pagecontent');
        $observationList = $('#observationList');
        $observationListpage = $('#observationListpage');
        $observationLocationList = $('#observationLocationList');
        $observationLocationTaxonGroups = $('#observationLocationTaxonGroups');
        $observationLocationTaxons = $('#observationLocationTaxons');
        $observationDetails = $('#observationDetails');
        $detailImgContainer = $('#detailImgContainer');
        $detailImgdialogContainer = $('#detailImgdialogContainer');
        $listHeader = $('#listHeader');
        $layerslist = $('#layerslist');
        $loading = $('#loading');
        $filterpage = $('#filterpage');
        $chkSplashNoShow = $('#chkSplashNoShow');
        $searchResultsTaxon = $('#search_resultsTaxon');
        $searchResultsSted = $('#search_resultsSted');
        $btnImgFilter = $('#btnImgFilter');
        $dialogLocation = $('#dialogLocation');
        $query = $('#query');
        $filterTaxonGroup = $('#filterTaxonGroup');
        $filterTaxon = $('#filterTaxon');

        //initiate and hold reference to $map
        theMap = app.ArtskartMap('map');
        getNdToken();
        document.addEventListener("resume", onResume, false);
        document.body.style.overflow = 'hidden';

        hidePage();

        //Hide Splash if disabled
        if (store.enabled) {
            var shouldHideSplash = store.get('hidesplash');
            if (shouldHideSplash !== null && shouldHideSplash != 'undefined') {
                if (shouldHideSplash) {
                    //theMap.geoLocate();
                    setBaseUrl();
                }
                $chkSplashNoShow.prop('checked', shouldHideSplash);
            }

            $chkSplashNoShow.change(function () {
                store.set('hidesplash', this.checked);
            });
        }

        // handle browser resize
        $(window).bind("orientationchange resize ", function () {
            onBrowserResized();
        });
        $map = $('#map');
        listenExtentChanged(false);
        onBrowserResized();

        //initLayerList(theMap.map);
        setupImgHover();

        getNdToken();

        // subscribe to artskart feature selections

        $map.on("featureSelected", function (e, feature) {

            if (feature.attributes.IsAggregated) {

                var zoom = theMap.map.getZoom() + 3;
                var centerPoint = feature.geometry.getCentroid();
                var lonlat = new OpenLayers.LonLat(centerPoint.x, centerPoint.y);
                theMap.map.setCenter(lonlat, zoom);
                //getObservationLocations();

            } else {

                var hash = urlHandler(feature.attributes.StringId);
                setHash(hash);

            }
        });

        // search locations
        $query.keyup(function (event) {
            if (event.which == 13) {
                getLocationByTerm();
                event.preventDefault();
            }
            if ($query.val().length > 1)
                getLocationByTerm();
        });

        var searchTimeout;
        $tbTaxonName.keydown(function (event) {
            clearTimeout(searchTimeout);
            var theWhich = event.which;
            searchTimeout = setTimeout(doSearch(theWhich), 300);

        });

        function doSearch(theWhich) {
            if (theWhich == 13) {
                getTaxonByName();
                event.preventDefault();
            }
            if ($tbTaxonName.val().length > 1)
                getTaxonByName();
        }

        var imagestyle = true;
        $("#btnMarkerStyle").bind('click', function () {

            if (imagestyle) {
                theMap.setStyle("Marker");
                imagestyle = false;
            } else {
                theMap.setStyle("Image");
                imagestyle = true;
            }
        });

        $("#btnSplash").bind('click', function () {

            var hash = "#/splash/";
            setHash(hash);

        });

        $(".btnBackToSplash").bind('click', function () {

            var hash = "#/splash/";
            setHash(hash);

        });

        $("#btnOmArtsdatabanken").bind('click', function () {

            var hash = "#/omartsdatabanken/";
            setHash(hash);

        });

        $("#btnOmkildene").bind('click', function () {

            var hash = "#/omkildene/";
            setHash(hash);

        });

        $("#btnHvordanbrukeArtskart").bind('click', function () {

            var hash = "#/hvordanbrukeartskart/";
            setHash(hash);

        });

        $("#plus").bind('click', function () {
            theMap.map.zoomIn();
        });

        $("#minus").bind('click', function () {
            theMap.map.zoomOut();
        });

        $("#btnLocation").bind('click', function () {

            var offs = $("#btnLocation").offset();
            $dialogLocation.css({ left: offs.left, top: offs.top - 55 });
            $locationClass.show();
        });

        $("#modalTransparentBg").bind('click', function () {
            $locationClass.hide();
        });

        $("#btnLocate").bind('click', function () {
            theMap.geoLocate();
            $locationClass.hide();
        });

        $("#btnZoomNorway").bind('click', function () {
            var zoom = 3;
            var lonlat = new OpenLayers.LonLat(1879518.6942113, 10538745.275484);
            theMap.map.setCenter(lonlat, zoom);

            $locationClass.hide();
        });

        $("#btnSearch").bind('click', function () {
            var hash = "#/searchpage/";
            setHash(hash);
        });

        $("#btnClearFilter").bind('click', function () {

            $ddStatus.prop('selectedIndex', 0);
            $ddTaxongroups.prop('selectedIndex', 0);
            $chkShowOnlyImageObs.prop('checked', false);
            $tbTaxonName.val('');
            $tbTaxonNameVal.val('');
            $tbdateFrom.val('');
            $ddActivity.prop('selectedIndex', 0);
            $ddObsPrecision.prop('selectedIndex', 2);
            $rdoPresNotSet.prop('checked', true);

            var hash = "#/filterpage/";
            setHash(hash, "", true);

        });


        $(".btnHideFilter").bind('click', function () {
            hidePage();
            updateUrlFilter();

            if (store.enabled) {
                store.set('maxMarkersValue', $tbMaxMarkers.val());
            }

            getObservationLocations();
        });

        $(".skjul").bind('click', function () {

            hidePage();
            setBaseUrl();
        });

        $(".skjulSplash").bind('click', function () {

            shouldHideSplash();
            setBaseUrl();
            getObservationLocations();

        });

        $("#btnImgFilter").bind('click', function () {

            var hash = "#/filterpage/";
            setHash(hash);

        });

        $("#btnLayerspage").bind('click', function () {

            var hash = "#/layerspage/";
            setHash(hash);

        });

        $("#btnTaxonomy").bind('click', function () {

            var divTaxonomy = $('#divTaxonomy');
            if (divTaxonomy.is(":visible")) {
                divTaxonomy.hide();
                $("#spanTaxonomy").html("<strong> + Taksonomi </strong>");
            } else {
                divTaxonomy.show();
                $("#spanTaxonomy").html("<strong> - Taksonomi </strong>");
            }

        });

        // sett oppslagsverdier o.l.
        loadFilterValues();
        //Filter setup
        $tbdateFrom.datepicker({ dateFormat: 'dd-mm-yy' });

        $("input[name=artFilter]").change(function () {

            $ddTaxongroups.prop('selectedIndex', 0);
            $tbTaxonName.val('');
            $tbTaxonNameVal.val('');

            var value = $('input[name=artFilter]:checked').val();
            if (value == 'Taxon') {
                $filterTaxonGroup.hide();
                $filterTaxon.show();
            } else {
                $filterTaxon.hide();
                $filterTaxonGroup.show();
            }
        });

        vmModelTaxonGroups = new listViewModel(setHash);
        ko.applyBindings(vmModelTaxonGroups, document.getElementById('observationLocationTaxonGroups'));

        vmModelTaxons = new listViewModel(setHash);
        ko.applyBindings(vmModelTaxons, document.getElementById('observationLocationTaxons'));

        vmModelObservations = new listViewModel(setHash);
        ko.applyBindings(vmModelObservations, document.getElementById('observationLocationList'));

        vmlistDetailViewModel = new detailViewModel();
        ko.applyBindings(vmlistDetailViewModel, document.getElementById('observationDetails'));

        filter = new filterModel();

        $("a[target='_system']").click(function (event) {

            event.preventDefault();
            window.open($(this).attr("href"), "_system");
        });

        navigationHistory = app.initiateBrowserNavigation(this);
        navigationHistory.run('#/splash/');

        toastr.info("Initsierer artskart");
    };

    return {
        run: run,
        listenExtentChanged: listenExtentChanged,
        showSplash: showSplash,
        showLayersPage: showLayersPage,
        showSearchPage: showSearchPage,
        showFilterPage: showFilterPage,
        showPage: showPage,
        hidePage: hidePage,
        zoomToCurrent: zoomToCurrent,
        getObservationLocationsTimer: getObservationLocationsTimer,
        getObservationLocationData: getObservationLocationData,
        getObservationDetail: getObservationDetail
    };
};