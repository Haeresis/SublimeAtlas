var website = {};

website.components = {};

(function (publics) {
    "use strict";

    website.components.sublimeAtlas = require('../components/controllers/sublime-atlas');

    publics.changeVariation = function (params, mainCallback) {
        var variation = params.variation,
            NA = params.NA;
        
        variation = website.components.sublimeAtlas.includeComponents(variation, NA, "components", "mainTag");

        mainCallback(variation);
    };

}(website));

exports.changeVariation = website.changeVariation;