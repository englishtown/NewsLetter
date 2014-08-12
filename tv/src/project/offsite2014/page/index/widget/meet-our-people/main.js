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
        dataMeetOurPeople;

    var isListFilled = false,
        $list,
        $detail,
        $items,
        iCurrent = -1,
        timer = {
            meetourpeople: {
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
            dataMeetOurPeople = data['new-comers'];

            if (meetourpeople.isAvailable) {
                if (!isListFilled) {
                    fillList().then(function () {
                        $container.show();
                        if (isInitializing) {
                            isInitializing = false;
                            deferInit.resolve();
                        }
                    });
                } else {
                    list.update(window.angular.copy(dataMeetOurPeople));
                }
            }
            else if (isInitializing) {
                isInitializing = false;
                deferInit.resolve(meetourpeople);
            }
        });
    }

    function fillList() {
        var deferFillList = when.defer();
        (!meetourpeople.isInit ? list($list, window.angular.copy(dataMeetOurPeople)) : list.init($list)).then(function () {
            $items = $list.find('.item');
            if ($items.length) {
                iCurrent = 0;
                (!meetourpeople.isInit ? detail($detail, dataMeetOurPeople[iCurrent]) : detail.init($detail, dataMeetOurPeople[iCurrent])).then(function () {
                    timer.meetourpeople.detail = setInterval(function () {
                        if (!dataMeetOurPeople.length) {
                            iCurrent = -1;
                            return;
                        }
                        else {
                            iCurrent++;
                            if (dataMeetOurPeople.length > iCurrent) {
                                meetourpeople.isAnimation = true;
                                detail.update(dataMeetOurPeople[iCurrent]).then(function () {
                                    meetourpeople.isAnimation = false;
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
            meetourpeople.isAvailable = true;
            meetourpeople.isInit = true;
            deferFillList.resolve();
        });

        return deferFillList.promise;
    }


    function meetourpeople() {}

    meetourpeople.headerbar = {
        title: 'MEET OUR PEOPLE',
        subtitle: '-'
    };
    meetourpeople.isInit = false;
    meetourpeople.isAnimation = false;

    meetourpeople.config = function (objConfig) {
        if (objConfig) {
            if (objConfig.container && $(objConfig.container).length) {
                $container =  $(objConfig.container);
            }
            if (objConfig.span) {
                spanSwtich = objConfig.span;
            }
            if (objConfig.end) {
                fnEnd = objConfig.end;
            }
        }
    };

    meetourpeople.init = function () {
        if (!$container || !$container.length || isPendingInit || isInitializing || meetourpeople.isInit) {
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

    meetourpeople.open = function () {
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

    meetourpeople.close = function () {
        var deferClose = when.defer();

        meetourpeople.isAvailable = false;

        if (timer.meetourpeople.detail) {
            clearInterval(timer.meetourpeople.detail);
            timer.meetourpeople.detail = undefined;
        }
        $container.fadeOut(function () {
            $container.hide();
            list.destroy();
            detail.destory();
            isListFilled = false;
            $list = undefined;
            $detail = undefined;
            $items = undefined;
            iCurrent = -1;
            deferClose.resolve();
        });

        return deferClose.promise;
    };

    return meetourpeople;
});