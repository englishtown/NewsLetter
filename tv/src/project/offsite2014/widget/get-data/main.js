define([
    'module',
    'jquery',
    'when'
], function (
    module,
    $,
    when
) {
    var urls = {
            'new-comers': './src/project/offsite2014/page/index/widget/new-comers/widget/list/data.js'
        };

    return function (name) {
        var defer = when.defer(),
            config = module.config();

        if (config.handler && config.handler[name]) {
            urls[name] = config.handler[name];
        }

        $.ajax({
            dataType: 'json',
            type: 'get',
            url: urls[name]
        }).then(function (dataJSON, status, xhr) {
            defer.resolve(dataJSON);
        }, function () {
            defer.reject();
        });
        return defer.promise;
    }
});