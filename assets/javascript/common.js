var website = website || {};

(function (publics) {

    publics.loadComponents = function () {
        for (var i in publics.components) {
            if ($("." + i).length > 0) {
                publics.components[i]();
            }
        }
    };

    publics.smartTargetInjection = function () {
        $(document.links).filter(function() {
            return !this.target;
        }).filter(function() {
            return this.hostname !== window.location.hostname ||
                /\.(?!html?|php3?|aspx?)([a-z]{0,3}|[a-zt]{0,4})$/.test(this.pathname);
        }).attr('target', '_blank');
    };

    publics.toggleMenu = function () {
        $(".header-main--button").click(function () {
            $(".header-main--links").toggleClass("is-opened");
        });
    };

    publics.init = function () {
        publics.loadComponents();
        publics.smartTargetInjection();
        publics.toggleMenu();
    };
}(website));

website.init();