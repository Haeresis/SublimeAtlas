var website = {};

website.components = {};

(function (publics) {

    website.components.comopnentAtlas = require('./modules/component-atlas');

    publics.changeVariations = function (next, locals) {
        var NA = this;

        locals = website.components.comopnentAtlas.includeComponents.call(NA, locals, "components", "mainTag", "componentName");

        next();
    };

}(website));

exports.changeVariations = website.changeVariations;