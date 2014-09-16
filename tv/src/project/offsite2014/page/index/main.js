define([
    'module',
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
    module,
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

    function getParameterByURL(n){var qs=window.location.href.toLowerCase().match(/[^\?#]+?\?(.*?)(?:#.*?)?$/i),m=qs?(new RegExp('(?:^|&)'+n+'=([^&]*?)(?:&|$)','i')).exec(qs[1]):qs;return m?m[1]:undefined};

    function domReady($) {
        var config = module.config(),
            tabs = [{
                $container: $('.new-comers'),
                tab: newcomers
            }],
            isHeaderBarInit = false,
            isFirstTabInit = false,
            span = (config && config.span) ? config.span : 1000,
            iCurrentTab = 0;

        if (getParameterByURL('meetourpeople')) {
            tabs.push({
                $container: $('.meet-our-people'),
                tab: meetourpeople
            });
        }

        function switchTab() {
            var tabCurrent = tabs[iCurrentTab].tab,
                $containerCurrent = tabs[iCurrentTab].$container,
                iNext = (iCurrentTab + 1) > (tabs.length - 1) ? 0 : (iCurrentTab + 1),
                tabNext = tabs[iNext].tab,
                $containerNext = tabs[iNext].$container;

            if ((iCurrentTab != iNext) && tabCurrent.hide && tabNext.show) {
                tabCurrent.hide().then(function () {
                    $containerCurrent.fadeOut(function () {
                        $containerCurrent
                            .hide()
                            .empty();
                        iCurrentTab = iNext;
                        headerbar.switchTab(iCurrentTab);
                        tabNext.show($containerNext, switchTab).then(function () {
                            $containerNext.fadeIn();
                        });
                    });
                });
            }
        }

        if (tabs.length) {
            var dataHeaderBar = [];
            for (var i = 0, iLen = tabs.length; i < iLen; i++) {
                dataHeaderBar.push(tabs[i].tab.headerbar);
            }
            headerbar.init($('.header-bar'), dataHeaderBar).then(function () {
                isHeaderBarInit = true;
                if (isFirstTabInit) {
                    headerbar.switchTab(iCurrentTab);
                }
            });
        }

        for (var j = 0, jLen = tabs.length; j < jLen; j++) {
            var tab = tabs[j].tab,
                $container = tabs[j].$container;

            tab.config({
                span: span
            });

            if (j === 0) {
                tab.show($container, switchTab).then(function () {
                    isFirstTabInit = true;
                    if (isHeaderBarInit) {
                        headerbar.switchTab(iCurrentTab);
                    }
                    tabs[iCurrentTab].$container.fadeIn();
                });
            }
        }
    }
});