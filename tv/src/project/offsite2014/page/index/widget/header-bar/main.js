define([
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'when',
    '../../../../widget/template-engine/main'
], function (
    $,
    innerHTML,
    cssTxt,
    cssRender,
    when,
    templateEngine
) {
    var $template = $(innerHTML),
        $itemTemplate = $template.find('> .item').clone(),
        deferCssReady = when.defer(),
        deferDomReady = when.defer(),
        $container,
        $items,
        iCurrent = -1;

    cssRender(cssTxt).then(function () {
        deferCssReady.resolve();
    });
    $(function () {
        deferDomReady.resolve();
    });

    function init(container, data) {
        var deferInit = when.defer();
        when.all([
            deferCssReady.promise,
            deferDomReady.promise
        ]).then(function () {
            if ($container && $container.length) {
                if (container) {
                    deferInit.reject();
                    return deferInit.promise;
                }
            } else if (!container || !$(container).length) {
                deferInit.reject();
                return deferInit.promise;
            } else {
                $container = $(container);
            }
            if (!data) {
                deferInit.reject();
                return deferInit.promise;
            }

            if (!$container.children().length) {
                var $row = $template.clone().empty();
                for (var i = 0, iLen = data.length; i < iLen; i++) {
                    var $item = $itemTemplate.clone(),
                        dataItem = data[i];
                    templateEngine($item, dataItem);
                    if (i == 0) {
                        $item.find('.pre-line').remove();
                    }
                    if (i >= (iLen - 1)) {
                        $item.find('.next-line').remove();
                    }
                    $row.append($item);
                }
                $container.append($row);
            }

            deferInit.resolve();
        });
        return deferInit.promise;
    }

    function switchTab(iNext) {
        var $items = ($container && $container.length) ? $container.find('> .row >.item') : undefined;
        if (!$items || !$items.length) {
            return;
        }
        if (typeof(iNext) == 'undefined') {
            iNext = iCurrent + 1;
        }
        if (!$items || iNext < 0 || iNext == iCurrent) {
            return;
        }
        if (iNext > $items.length) {
            if (iCurrent == 0) {
                return;
            }
            iNext = 0;
        }
        if (iCurrent >= 0 && $items.length > iCurrent) {
            $items.eq(iCurrent).removeClass('current');
        }
        $items.eq(iNext).addClass('current');
        iCurrent = iNext;
    }

    function refresh(index, obj) {
        var $items = ($container && $container.length) ? $container.find('> .row >.item') : undefined;
        if (!$items || !$items.length) {
            return;
        }
        if ($items.length > index) {
            var $item = $items.eq(index);
            for (var i in obj) {
                $item.find('.' + i).html(obj[i]);
            }
        }
    }

    return new (function () {
        this.init = init;
        this.switchTab = switchTab;
        this.refresh = refresh;
    })();
});