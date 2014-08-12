define([
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'when',
    '../../../../widget/get-data/main'
], function (
    $,
    innerHTML,
    cssTxt,
    cssRender,
    when,
    getData
) {
    var defer = when.defer(),
        isCssReady = false,
        fnMain,
        $container,
        $items,
        dataHeaderBar,
        iCurrent = -1;

    cssRender(cssTxt).then(cssReady);

    function cssReady() {
        isCssReady = true;
        if (!fnMain) {
            fnMain();
        }
    }

    function headerbar(container, data) {
        if (!$container && $(container).length) {
            $container = $(container);
        }
        dataHeaderBar = data || dataHeaderBar;
        if ($container.length && !fnMain) {
            fnMain = function () {
                if ($.isReady) {
                    domReady.apply(document, [$]);
                }
                else {
                    $(domReady);
                }
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

    function domReady($) {
        var $template = $(innerHTML),
            $row = $template.clone().empty(),
            $itemTemplate = $template.find('> .item').clone();
        $container.append($row);

        for (var i = 0, len = dataHeaderBar.length; i < len; i++) {
            var $item = $itemTemplate.clone(),
                dataItem = dataHeaderBar[i];
            $item.find('.title').html(dataItem.title);
            $item.find('.subtitle').html(dataItem.subtitle);
            if (i == 0) {
                $item.find('.pre-line').remove();
            }
            if (i >= (len - 1)) {
                $item.find('.next-line').remove();
            }
            $row.append($item);
            $items = $items ? $items.add($item) : $item;
        }
        headerbar.isInit = true;
        defer.resolve();
    }

    headerbar.refresh = function(index, obj) {
        if ($items && $items.length && $items.length > index) {
            var $item = $items.eq(index);
            for (var i in obj) {
                $item.find('.' + i).html(obj[i]);
            }
        }
    }

    headerbar.switch = function(iNext) {
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

    return headerbar;
});