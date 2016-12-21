var website = {};

website.components = {};

(function (publics) {

    website.components.comopnentAtlas = require('./modules/component-atlas');

    publics.changeVariations = function (params, next) {
        var NA = this,
            variations = params.variations;

        variations = website.components.comopnentAtlas.includeComponents.call(NA, variations, "components", "mainTag", "componentName");

        next(variations);
    };

}(website));

exports.changeVariations = website.changeVariations;