define([
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'when',
    '../../../../../../widget/replace-engine/main'
], function (
    $,
    innerHTML,
    cssTxt,
    cssRender,
    when,
    templateEngine
) {
    var defer = when.defer(),
        isCssReady = false,
        fnMain,
        $container,
        $template = $(innerHTML),
        dataMeetOurPeopleDetail,
        isInit = false;

    cssRender(cssTxt).then(cssReady);

    function cssReady() {
        isCssReady = true;
        if (!fnMain) {
            fnMain();
        }
    }

    function domReady($) {
        detail.init().then(function () {
            if (!isInit) {
                isInit = true;
                defer.resolve();
            }
        });
    }

    function appendItem() {
        var $item = $template.clone();

        templateEngine($item, dataMeetOurPeopleDetail);

        $container.append($item);
    }

    function detail(container, data) {
        if (!$container && $(container).length) {
            $container = $(container);
        }
        if ($container.length && !fnMain) {
            dataMeetOurPeopleDetail = data || {};
            fnMain = function () {
                $(domReady);
            };
            if (isCssReady) {
                fnMain();
            }
        }
        else {
            defer.reject();
        }
        return defer.promise;
    }

    detail.isAnimation = false;

    detail.init = function (container, data) {
        var deferInit = when.defer();

        if ($(container).length) {
            $container = $(container);
        }
        if (data) {
            dataMeetOurPeopleDetail = data;
        }

        appendItem();
        $container.find('> *').show();

        deferInit.resolve();

        return deferInit.promise;
    };

    detail.destory = function () {
        $container.remove();
    };

    detail.update = function (data) {
        var deferUpdate = when.defer();
        if (data) {
            dataMeetOurPeopleDetail = data;
            if (isInit) {
                detail.isAnimation = true;
                $container.find('> *').fadeOut(function () {
                    $container.empty();
                    appendItem();
                    $container.find('> *').fadeIn(function () {
                        detail.isAnimation = false;
                        deferUpdate.resolve();
                    });
                });
            }
        }
        else {
            deferUpdate.reject();
        }
        return deferUpdate.promise;
    };

    return detail;
});