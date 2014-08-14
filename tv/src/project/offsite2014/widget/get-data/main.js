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
            dataType: 'jsonp',
            jsonpCallback: 'jQuery123456',
            type: 'get',
            url: urls[name]
        }).then(function (dataJSON, status, xhr) {
            var data = {};
            data[name] = dataJSON;
            defer.resolve(data);
        }, function () {
            defer.reject();
        });
        return defer.promise;
    }
});