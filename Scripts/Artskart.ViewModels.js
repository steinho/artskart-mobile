var listViewModel = function(urlClickFunction) {
    var self = this;

    this.list = ko.observableArray([]);
    this.listCount = ko.observable(0);
    this.totalCount = ko.observable(0);
    this.locality = ko.observable('');
    this.taxonCount = ko.observable(0);
    this.taxonName = ko.observable('');
    this.taxonId = ko.observable('');
    this.taxonGroupCount = ko.observable(0);
    this.taxonGroupName = ko.observable('');
    this.url = ko.observable('');

    this.urlClick = function() {
        urlClickFunction(this.url);
    };
    
    this.init = function(metaData) {

        self.clear();

        self.listCount(metaData.ListCount);
        self.totalCount(metaData.TotalCount);
        self.locality(metaData.Locality);

        if (typeof(metaData.Taxons) != "undefined") {
            self.taxonCount(metaData.Taxons.length);
        }

        if (typeof(metaData.TaxonGroups) != "undefined") {
            self.taxonGroupCount(metaData.TaxonGroups.length);
        }

        if (self.taxonCount() == 1) {
            self.taxonName(metaData.Taxons[0].Name);
            self.taxonId(metaData.Taxons[0].Id);
        }

        if (self.taxonGroupCount() == 1) {
            self.taxonGroupName(metaData.TaxonGroups[0].Name);
        }
    };

    this.add = function(item) {
        self.list.push(ko.observable(item));
    };

    this.hasData = function() {
        if (self.list().length == 0)
            return false;
        else return true;
    };


    this.clear = function() {
        self.list.removeAll();
        self.listCount(0);
        self.totalCount(0);
        self.locality('');
        self.taxonGroupCount(0);
        self.taxonGroupName('');
        self.taxonCount(0);
        self.taxonName('');
        self.taxonId('');
        
    };
};

var detailViewModel = function() {
    var self = this;

    this.init = function(data) {
        self.Id(data.Id);
        self.Institution(data.Institution);
        self.InstitutionUrl(data.InstitutionUrl);
        self.InstitutionLogoUrl(data.InstitutionLogoUrl);
        self.Collection(data.Collection);
        self.Sex(data.Sex);
        self.IdentifiedBy(data.IdentifiedBy);
        self.DatetimeIdentified(data.DatetimeIdentified);
        self.Habitat(data.Habitat);
        self.DatasetName(data.DatasetName);
        self.ObsUrl(data.ObsUrl);
        self.DetailUrl(data.DetailUrl);
        self.Name(data.Name);
        self.ScientificName(data.ScientificName);
        self.Author(data.Author);
        self.kingdom(data.kingdom);
        self.phylum(data.phylum);
        self.klass(data.klass);
        self.order(data.order);
        self.family(data.family);
        self.genus(data.genus);
        self.subgenus(data.subgenus);
        self.specificEpithet(data.specificEpithet);
        self.infraspecificEpithet(data.infraspecificEpithet);
        self.Status(data.Status);
        self.BasisOfRecord(data.BasisOfRecord);
        self.TypeObj(data.TypeObj);
        self.DeterminationDate(data.DeterminationDate);
        self.Collector(data.Collector);
        self.CollctedDate(data.CollctedDate);
        self.Count(data.Count);
        self.Notes(data.Notes);
        self.Country(data.Country);
        self.County(data.County);
        self.Municipality(data.Municipality);
        self.Locality(data.Locality);
        self.Longitude(data.Longitude);
        self.Latitude(data.Latitude);
        self.Precision(data.Precision);
        self.Info(data.Info);

        self.PropertyUrls.removeAll();

        jQuery.each(data.PropertyUrls, function(i, val) {
            self.PropertyUrls.push(new propertyUrl(val));
        });

    };

    this.Id = ko.observable('');
    this.Institution = ko.observable('');
    this.InstitutionUrl = ko.observable('');
    this.InstitutionLogoUrl = ko.observable('');
    this.Collection = ko.observable('');
    this.Sex = ko.observable('');
    this.IdentifiedBy = ko.observable('');
    this.DatetimeIdentified = ko.observable('');
    this.Habitat = ko.observable('');
    this.DatasetName = ko.observable('');
    this.ObsUrl = ko.observable('');
    this.DetailUrl = ko.observable('');
    this.Name = ko.observable('');
    this.ScientificName = ko.observable('');
    this.Author = ko.observable('');
    this.kingdom = ko.observable('');
    this.phylum = ko.observable('');
    this.klass = ko.observable('');
    this.order = ko.observable('');
    this.family = ko.observable('');
    this.genus = ko.observable('');
    this.subgenus = ko.observable('');
    this.specificEpithet = ko.observable('');
    this.infraspecificEpithet = ko.observable('');
    this.Status = ko.observable('');
    this.BasisOfRecord = ko.observable('');
    this.TypeObj = ko.observable('');
    this.DeterminationDate = ko.observable('');
    this.Collector = ko.observable('');
    this.CollctedDate = ko.observable('');
    this.Count = ko.observable('');
    this.Notes = ko.observable('');
    this.Country = ko.observable('');
    this.County = ko.observable('');
    this.Municipality = ko.observable('');
    this.Locality = ko.observable('');
    this.Longitude = ko.observable('');
    this.Latitude = ko.observable('');
    this.Precision = ko.observable('');
    this.Info = ko.observable('');
    this.PropertyUrls = ko.observableArray([]);
};

var propertyUrl = function(item) {

    this.LinkTekst = ko.observable(item.LinkTekst);
    this.Url = ko.observable(item.Url);
};