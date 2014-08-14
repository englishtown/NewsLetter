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
        $itemTemplate = $template.find('> .item').clone(),
        deferCssReady = when.defer(),
        deferDomReady = when.defer(),
        $container;

    cssRender(cssTxt).then(function () {
        deferCssReady.resolve();
    });
    $(function () {
        deferDomReady.resolve();
    });

    function init(container) {
        var deferInit = when.defer();
        when.all([
            deferCssReady.promise,
            deferDomReady.promise
        ]).then(function () {
            $container = $(container);
            if (!$container.length) {
                deferInit.reject();
                return;
            }

            if (!$container.children().length) {
                $container.append(
                    $template.clone().empty()
                );
            }

            deferInit.resolve();
        });
        return deferInit.promise;
    }

    function update(data) {
        var deferUpdate = when.defer(),
            $row = ($container && $container.length) ? $container.find('> .row') : undefined;

        if (!$row || !$row.length || !data) {
            deferShow.reject();
            return deferUpdate.promise;
        }

        if ($row.children().length) {
            $row.empty();
        }
        for (var i = 0, len = data.length; i < len; i++) {
            var $item = $itemTemplate.clone();
                dataItem = data[i];
            templateEngine($item, dataItem);
            $row.append($item);
            deferUpdate.resolve();
        }
        return deferUpdate.promise;
    }

    return new (function() {
        this.init = init;
        this.update = update;
    })();
});