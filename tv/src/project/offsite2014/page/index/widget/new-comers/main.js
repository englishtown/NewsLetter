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
    var $container,
        spanSwtich = 3000,
        fnEnd;

    var isCssReady = false,
        isPendingInit = false,
        isInitializing = false,
        deferInit = when.defer(),
        $template = $(innerHTML),
        dataNewComers;

    var isListFilled = false,
        $list,
        $detail,
        $items,
        iCurrent = -1,
        timer = {
            newcomers: {
                detail: undefined
            }
        };

    cssRender(cssTxt).then(cssReady);
    function cssReady() {
        isCssReady = true;
        if (isPendingInit && $.isReady) {
            isPendingInit = false;
            init();
        }
    }

    function init() {
        isInitializing = true;

        pollingData.on('new-comers', function (data) {
            dataNewComers = data['new-comers'];

            if (newcomers.isAvailable) {
                if (!isListFilled) {
                    fillList().then(function () {
                        $container.show();
                        if (isInitializing) {
                            isInitializing = false;
                            deferInit.resolve();
                        }
                    });
                } else {
                    list.update(window.angular.copy(dataNewComers));
                }
            }
            else if (isInitializing) {
                isInitializing = false;
                deferInit.resolve(newcomers);
            }
        });
    }

    function fillList() {
        var deferFillList = when.defer();

        (!newcomers.isInit ? list($list, window.angular.copy(dataNewComers)) : list.init($list)).then(function () {
            $items = $list.find('.item');
            if ($items.length) {
                iCurrent = 0;
                (!newcomers.isInit ? detail($detail, dataNewComers[iCurrent]) : detail.init($detail, dataNewComers[iCurrent])).then(function () {
                    timer.newcomers.detail = setInterval(function () {
                        if (!dataNewComers.length) {
                            iCurrent = -1;
                            return;
                        }
                        else {
                            iCurrent++;
                            if (dataNewComers.length > iCurrent) {
                                newcomers.isAnimation = true;
                                detail.update(dataNewComers[iCurrent]).then(function () {
                                    newcomers.isAnimation = false;
                                });
                            }
                            else {
                                if (typeof(fnEnd) == 'function') {
                                    fnEnd();
                                }
                            }
                        }
                    }, spanSwtich);
                });
            }
            isListFilled = true;
            newcomers.isAvailable = true;
            newcomers.isInit = true;
            deferFillList.resolve();
        });

        return deferFillList.promise;
    }


    function newcomers() {}

    newcomers.headerbar = {
        title: 'NEW COMERS',
        subtitle: 'August 2014'
    };
    newcomers.isInit = false;
    newcomers.isAnimation = false;

    newcomers.config = function (objConfig) {
        if (objConfig) {
            if (objConfig.container && $(objConfig.container).length) {
                $container =  $(objConfig.container);
            }
            if (objConfig.span) {
                spanSwtich = objConfig.span;
            }
            if (objConfig.end) {
                fnEnd = objConfig.end
            }
        }
    };

    newcomers.init = function () {
        if (!$container || !$container.length || isPendingInit || isInitializing || newcomers.isInit) {
            var deferReject = when.defer();
            deferReject.reject();
            return deferReject.promise;
        }
        isPendingInit = true;
        $(function ($) {
            if (isPendingInit && isCssReady) {
                isPendingInit = false;
                init();
            }
        });
        return deferInit.promise;
    };

    newcomers.open = function () {
        var deferOpen = when.defer(),
            $templateClone = $template.clone();

        $list = $templateClone.filter('.list');
        $detail = $templateClone.filter('.detail');

        $container.append($templateClone);

        fillList().then(function () {
            $container.fadeIn(function () {
                deferOpen.resolve();
            });
        });

        return deferOpen.promise;
    };

    newcomers.close = function () {
        var deferClose = when.defer();

        newcomers.isAvailable = false;

        if (timer.newcomers.detail) {
            clearInterval(timer.newcomers.detail);
            timer.newcomers.detail = undefined;
        }
        $container.fadeOut(function () {
            $container
                .hide()
                .empty();
            isListFilled = false;
            $list = undefined;
            $detail = undefined;
            $items = undefined;
            iCurrent = -1;
            deferClose.resolve();
        });

        return deferClose.promise;
    };

    return newcomers;
});