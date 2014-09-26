define([
    'jquery',
    'template!./main.html',
    'csstemplate!./main.css',
    'cssrender',
    'when',
    '../../../../../../widget/template-engine/main'
], function (
    $,
    innerHTML,
    cssTxt,
    cssRender,
    when,
    templateEngine
) {
    var $template = $(innerHTML),
        deferCssReady = when.defer(),
        deferDomReady = when.defer();

    cssRender(cssTxt).then(function () {
        deferCssReady.resolve();
    });
    $(function () {
        deferDomReady.resolve();
    });

    function show(container, data) {
        var deferShow = when.defer();
        when.all([
            deferCssReady.promise,
            deferDomReady.promise
        ]).then(function () {
            var $container = $(container);
            if (!$container.length || !data) {
                return;
            }

            function fadeIn($item) {
                templateEngine($item, data);
                var $desc = $item.find('.desc');
                $desc.html((function () {
                    var strBR = '';
                    for (var i = 0; i < 19; i++) {
                        strBR += '<br />';
                    }
                    return strBR;
                })() + $desc.html());
                $item.fadeIn(function () {
                    deferShow.resolve();
                });
            }

            if ($container.children().length) {
                $container.find('> *').fadeOut(function () {
                    this.scrollLeft = 0;
                    fadeIn($container.find('> *'));
                });
            }
            else {
                fadeIn(
                    $template.clone().appendTo($container)
                );
            }
        });
        return deferShow.promise;
    }

    return new (function() {
        this.show = show;
    })();
});