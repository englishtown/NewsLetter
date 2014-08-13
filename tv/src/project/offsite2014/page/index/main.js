define([
    'jquery',
    'salespages-ui/widget/tagger/main',
    'csstemplate!salespages-ui/widget/bootstrap/3.1.1/main.css',
    'csstemplate!./main.css',
    'cssrender',
    'when',
    './widget/header-bar/main',
    './widget/new-comers/main',
    './widget/meet-our-people/main'
], function (
    $,
    tagger,
    cssTxtBootstrapp,
    cssTxtIndex,
    cssRender,
    when,
    headerbar,
    newcomers,
    meetourpeople
) {
    (new tagger()).tag({more: true});

    cssRender(cssTxtBootstrapp + cssTxtIndex).then(cssReady);

    function cssReady() {
        $(domReady);
    }

    function domReady($) {
        var tabs = [{
                $container: $('.new-comers'),
                tab: newcomers
            },{
                $container: $('.meet-our-people'),
                tab: meetourpeople
            }],
            span = 5000,
            iCurrentTab = 0;

        function switchTab() {
            var tabCurrent = tabs[iCurrentTab].tab,
                iNext = (iCurrentTab + 1) > (tabs.length - 1) ? 0 : (iCurrentTab + 1),
                tabNext = tabs[iNext].tab;

            if ((iCurrentTab != iNext) && tabCurrent.close && tabNext.open) {
                tabCurrent.close().then(function () {
                    iCurrentTab = iNext;
                    headerbar.switch(iCurrentTab);
                    tabNext.open();
                });
            }
        }

        if (tabs.length) {
            var dataHeaderBar = [];
            for (var i = 0, iLen = tabs.length; i < iLen; i++) {
                dataHeaderBar.push(tabs[i].tab.headerbar);
            }
            headerbar($('.header-bar'), dataHeaderBar).then(function () {
                if (tabs[0].tab.isInit) {
                    headerbar.switch(iCurrentTab);
                }
            });
        }

        for (var j = 0, jLen = tabs.length; j < jLen; j++) {
            var tab = tabs[j].tab,
                $container = tabs[j].$container;

            tab.config({
                container: $container,
                span: span,
                end: switchTab
            });

            if (j === 0) {
                tab.init().then(function (tab) {
                    if (headerbar.isInit) {
                        headerbar.switch(iCurrentTab);
                    }
                    tab.open();
                });
            }
            else {
                tab.init();
            }
        }
    }
});