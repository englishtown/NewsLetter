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
        $row,
        $itemTemplate = $template.find('> .item').clone(),
        dataNewComers,
        isInit = false;

    cssRender(cssTxt).then(cssReady);

    function cssReady() {
        isCssReady = true;
        if (!fnMain) {
            fnMain();
        }
    }

    function domReady($) {
        list.init().then(function () {
            if (!isInit) {
                isInit = true;
                defer.resolve();
            }
        });
    }

    function onResize() {
        var $wrapper = $('.wrapper'),
            $headerbar = $('.header-bar');
        if ($headerbar && $headerbar.length) {
            $container.css('height', $wrapper.height() - ($headerbar.height() + parseInt($headerbar.css('margin-top')) + parseInt($headerbar.css('margin-bottom')) + parseInt($headerbar.css('padding-top')) + parseInt($headerbar.css('padding-bottom'))));
        }
    }

    function list(container, data) {
        if (!$container && $(container).length) {
            $container = $(container);
        }
        if ($container.length && !fnMain) {
            dataNewComers = data || [];
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

    list.init = function (container) {
        var deferInit = when.defer();

        if ($(container).length) {
            $container = $(container);
        }

        $row = $template.clone().empty();

        for (var i = 0, len = dataNewComers.length; i < len; i++) {
            var $item = $itemTemplate.clone();
                dataItem = dataNewComers[i];
            templateEngine($item, dataItem);
            $row.append($item);
        }

        $(window).on('resize', onResize);
        onResize();
        $container.append($row);

        deferInit.resolve();

        return deferInit.promise;
    };

    list.destroy = function () {
        $(window).off('resize', onResize);
        $container.remove();
    };

    list.update = function (data) {
        if (!data) {
            return;
        }
        dataNewComers = data;
        if (isInit) {
            $row.empty();
            for (var i = 0, len = dataNewComers.length; i < len; i++) {
                var $item = $itemTemplate.clone();
                    dataItem = dataNewComers[i];
                $item.find('.pic').prop('src', dataItem.pic);
                $row.append($item);
            }
        }
    };

    return list;
});