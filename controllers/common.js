var website = {};

website.components = {};

(function (publics) {

    website.components.comopnentAtlas = require('./modules/component-atlas');

    publics.changeVariation = function (params, next) {
        var NA = this,
            variation = params.variation;

        variation = website.components.comopnentAtlas.includeComponents.call(NA, variation, "components", "mainTag", "componentName");

        next(variation);
    };

}(website));

exports.changeVariation = website.changeVariation;