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
        dataMeetOurPeople,
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
                    if (!data['meet-our-people'] && !(data['meet-our-people'] instanceof Array)) {
                        return;
                    }
                    var arrDataMeetOurPeople = [];
                    for (var i = 0, len = data['meet-our-people'].length; i < len && i < numberOfDisplay; i++) {
                        arrDataMeetOurPeople.push(data['meet-our-people'][i]);
                    }
                    dataMeetOurPeople = arrDataMeetOurPeople;
                    list.update(dataMeetOurPeople).then(function () {
                        if (!isInit.list) {
                            if (!isInit.detail && dataMeetOurPeople.length > indexCurrent) {
                                detail.show($detail, dataMeetOurPeople[indexCurrent]).then(function () {
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
                pollingData.on('meet-our-people', callbackData);
                $(window).on('resize', onResize);
                onResize();
            });
        }

        return deferShow.promise;
    }

    function switchDetail($detail, end) {
        timer = setTimeout(function () {
            var $detail = $container.find('.detail'),
                $detailBody = $container.find('.body'),
                heightDetail = (parseInt($detailBody.css('margin-top')) || 0)
                    + (parseInt($detailBody.css('border-top')) || 0)
                    + (parseInt($detailBody.css('padding-top')) || 0)
                    + $detailBody.height()
                    + (parseInt($detailBody.css('margin-bottom')) || 0)
                    + (parseInt($detailBody.css('border-bottom')) || 0)
                    + (parseInt($detailBody.css('padding-bottom')) || 0),
                scrollTopDetail = $detailBody.get(0).scrollTop,
                scrillHeightDetail = $detailBody.get(0).scrollHeight;

            if ((scrollTopDetail + heightDetail) < scrillHeightDetail) {
                $detailBody.animate({
                    scrollTop: scrollTopDetail + heightDetail
                }, function () {
                    switchDetail($detail, end);
                });
            } else {
                if (dataMeetOurPeople.length > (indexCurrent + 1)) {
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
                            topItem = $items.eq(indexCurrent).position().top + scrollTopList,
                            heightItem = $items.eq(indexCurrent).height(),
                            paddingTopList = parseInt($list.css('padding-top')) || 0;
                        if ((scrollTopList + heightList) < (topItem + heightItem)) {
                            $list.animate({
                                // scrollTop: topItem + heightItem - heightList
                                scrollTop: topItem - paddingTopList
                            });
                        }
                    }

                    detail.show($detail, dataMeetOurPeople[indexCurrent]).then(function () {
                        switchDetail($detail, end);
                    });
                }
                else if (typeof(end) == 'function') {
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
            dataMeetOurPeople = undefined;
            // $container.fadeOut(function () {
                $container = undefined;
                deferHide.resolve();
            // });
        }
        return deferHide.promise;
    }

    return new (function () {
        this.headerbar = {
            title: 'MEET OUR PEOPLE',
            subtitle: '-'
        };
        this.config = config;
        this.show = show;
        this.hide = hide;
    })();
});