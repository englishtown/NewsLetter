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
            'new-comers': './src/project/offsite2014/page/index/widget/new-comers/widget/list/data.js',
            'meet-our-people': './src/project/offsite2014/page/index/widget/new-comers/widget/list/data.js'
        };

    return function (name) {
        var defer = when.defer(),
            config = module.config(),
            jsonpCallback = {
                jsonpCallback: 'jQuery123456'
            };

        if (config.handler && config.handler[name]) {
            urls[name] = config.handler[name];
            jsonpCallback = {};
        }

        $.ajax($.extend(true, {}, {
            dataType: 'jsonp',
            type: 'get',
            url: urls[name]
        }, jsonpCallback)).then(function (dataJSON, status, xhr) {
            var data = {};
            data[name] = dataJSON;
            defer.resolve(data);
        }, function () {
            defer.reject();
        });
        return defer.promise;
    }
});