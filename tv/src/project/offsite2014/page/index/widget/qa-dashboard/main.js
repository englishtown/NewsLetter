define([
    'module',
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'when'
], function (
    module,
    $,
    innerHTML,
    cssTxt,
    cssRender,
    when
) {
    var configModule = module.config(),
        $template = $(innerHTML),
        deferCssReady = when.defer(),
        deferDomReady = when.defer(),
        span = 3000,
        handler = (configModule && configModule.handler) ? configModule.handler : undefined,
        $container;

    cssRender(cssTxt).then(function () {
        deferCssReady.resolve();
    });
    $(function () {
        deferDomReady.resolve();
    });

    function config(pConfig) {
        if (pConfig) {
            if (pConfig.span) {
                span = (configModule && configModule.span) ? configModule.span : pConfig.span;
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
            $container.append($template);
            if (handler) {
                $container.find('iframe').prop('src', handler);
            }
            switchDetail(end);
        }

        $(window).on('resize', onResize);
        onResize();

        deferShow.resolve();

        return deferShow.promise;
    }

    function switchDetail(end) {
        timer = setTimeout(function () {
            if (typeof(end) == 'function') {
                end();
            }
        }, span);
    }

    function onResize() {
        var $wrapper = $('.wrapper'),
            $headerbar = $('.header-bar'),
            $iframe = $container ? $container.find('iframe') : undefined;
        if ($wrapper && $wrapper.length && $headerbar && $headerbar.length && $iframe && $iframe.length) {
            $iframe.css(
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
            // $container.fadeOut(function () {
                $container = undefined;
                deferHide.resolve();
            // });
        }
        return deferHide.promise;
    }

    return new (function () {
        this.headerbar = {
            title: 'QA DASHBOARD',
            subtitle: '-'
        };
        this.config = config;
        this.show = show;
        this.hide = hide;
    })();
});