define([
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'angular',
    'when',
    '../../../../widget/polling-data/main',
    './widget/list/main',
    './widget/detail/main'
], function (
    $,
    innerHTML,
    cssTxt,
    cssRender,
    angular,
    when,
    pollingData,
    list,
    detail
) {
    var $template = $(innerHTML),
        deferCssReady = when.defer(),
        deferDomReady = when.defer(),
        span = 3000,
        numberOfDisplay = 12,
        $container,
        callbackData,
        dataNewComers,
        indexCurrent = 0,
        timer;

    cssRender(cssTxt).then(function () {
        deferCssReady.resolve();
    });
    $(function () {
        deferDomReady.resolve();
    });

    function config(pConfig) {
        if (pConfig) {
            if (pConfig.span) {
                span = pConfig.span;
            }
            if (pConfig.numberOfDisplay) {
                numberOfDisplay = pConfig.numberOfDisplay;
            }
        }
    }

    function show(container, end) {
        var deferShow = when.defer();
        if ($container && $container.length) {
            if (container) {
                deferShow.reject();
                return deferShow.promise;
            }
        } else if (!container || !$(container).length) {
            deferShow.reject();
            return deferShow.promise;
        } else {
            $container = $(container);
        }

        if (!$container.children().length) {
            var $item = $template.clone(),
                $list = $item.filter('.list'),
                $detail = $item.filter('.detail');

            $container.append($item);

            list.init($list).then(function () {
                var isInit = {
                        list: false,
                        detail: false,
                    };
                callbackData = function(data) {
                    if (!data['new-comers'] && !(data['new-comers'] instanceof Array)) {
                        return;
                    }
                    var arrDataNewComers = [];
                    for (var i = 0, len = data['new-comers'].length; i < len && i < numberOfDisplay; i++) {
                        arrDataNewComers.push(data['new-comers'][i]);
                    }
                    dataNewComers = arrDataNewComers;
                    list.update(dataNewComers).then(function () {
                        if (!isInit.list) {
                            if (!isInit.detail && dataNewComers.length > indexCurrent) {
                                detail.show($detail, dataNewComers[indexCurrent]).then(function () {
                                    isInit.detail = true;
                                    if (!isInit.list) {
                                        // $container.fadeIn(function () {
                                            isInit.list = true;
                                            switchDetail($detail, end);
                                            deferShow.resolve();
                                        // });
                                    }
                                });
                            } else {
                                // $container.fadeIn(function () {
                                    isInit.list = true;
                                    deferShow.resolve();
                                // });
                            }
                        }
                    });
                };
                pollingData.on('new-comers', callbackData);
                $(window).on('resize', onResize);
                onResize();
            });
        }

        return deferShow.promise;
    }

    function switchDetail($detail, end) {
        timer = setTimeout(function () {
            var $detail = $container.find('.detail'),
                heightDetail = (parseInt($detail.css('margin-top')) || 0)
                    + (parseInt($detail.css('border-top')) || 0)
                    + (parseInt($detail.css('padding-top')) || 0)
                    + $detail.height()
                    + (parseInt($detail.css('margin-bottom')) || 0)
                    + (parseInt($detail.css('border-bottom')) || 0)
                    + (parseInt($detail.css('padding-bottom')) || 0),
                scrollTopDetail = $detail.get(0).scrollTop,
                scrillHeightDetail = $detail.get(0).scrollHeight,
                flgNext;

            if ((scrollTopDetail + heightDetail) < scrillHeightDetail) {
                $detail.animate({
                    scrollTop: scrollTopDetail + heightDetail
                }, function () {
                    switchDetail($detail, end);
                });
            } else {
                flgNext = dataNewComers.length > (indexCurrent + 1);

                if (flgNext) {
                    var $list = $container.find('.list'),
                        $items = $list.find('.item');

                    indexCurrent++;

                    if ($items.length > indexCurrent) {
                        var heightList = (parseInt($list.css('margin-top')) || 0)
                                + (parseInt($list.css('border-top')) || 0)
                                + (parseInt($list.css('padding-top')) || 0)
                                + $list.height()
                                + (parseInt($list.css('margin-bottom')) || 0)
                                + (parseInt($list.css('border-bottom')) || 0)
                                + (parseInt($list.css('padding-bottom')) || 0),
                            scrollTopList = $list.get(0).scrollTop,
                            scrillHeightList = $list.get(0).scrollHeight,
                            topItem = $items.eq(indexCurrent).position().top,
                            heightItem = $items.eq(indexCurrent).height();
                        if ((scrollTopList + heightList) < (topItem + heightItem)) {
                            $list.animate({
                                scrollTop: topItem + heightItem - heightList
                            });
                        }
                    }

                    detail.show($detail, dataNewComers[indexCurrent]).then(function () {
                        switchDetail($detail, end);
                    });
                } else if (typeof(end) == 'function') {
                    end();
                }
            }
        }, span);
    }

    function onResize() {
        var $wrapper = $('.wrapper'),
            $headerbar = $('.header-bar'),
            $list = ($container && $container.length) ? $container.find('> .list') : undefined;
        if ($wrapper.length && $headerbar.length && $list && $list.length) {
            $list.css(
                'height',
                $wrapper.height() - (
                    (parseInt($headerbar.css('margin-top')) || 0)
                    + (parseInt($headerbar.css('border-top')) || 0)
                    + (parseInt($headerbar.css('padding-top')) || 0)
                    + $headerbar.height()
                    + (parseInt($headerbar.css('padding-bottom')) || 0)
                    + (parseInt($headerbar.css('border-bottom')) || 0)
                    + (parseInt($headerbar.css('margin-bottom')) || 0)
                )
            );
        }
    }

    function hide() {
        var deferHide = when.defer();
        if (!$container || !$container.length) {
            deferHide.reject();
        } else {
            $(window).off('resize', onResize);
            pollingData.off('new-comers', callbackData);
            callbackData = undefined;
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            indexCurrent = 0;
            dataNewComers = undefined;
            // $container.fadeOut(function () {
                $container = undefined;
                deferHide.resolve();
            // });
        }
        return deferHide.promise;
    }

    return new (function () {
        this.headerbar = {
            title: 'NEW COMERS',
            subtitle: 'August 2014'
        };
        this.config = config;
        this.show = show;
        this.hide = hide;
    })();
});