var website = {};

website.components = {};

(function (publics) {

    website.components.comopnentAtlas = require('../components/controllers/component-atlas');

    publics.changeVariation = function (params, mainCallback) {
        var NA = this,
            variation = params.variation;

        variation = website.components.comopnentAtlas.includeComponents.call(NA, variation, "components", "mainTag", "componentName");

        mainCallback(variation);
    };

}(website));

exports.changeVariation = website.changeVariation;