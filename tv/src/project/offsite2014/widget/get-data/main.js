define([
    'jquery',
    'when'
], function (
    $,
    when
) {
    var urls = {
            'header-bar': '/src/project/offsite2014/page/index/widget/header-bar/data.js',
            'new-comers': '/src/project/offsite2014/page/index/widget/new-comers/widget/list/data.js'
        };

    return function (name) {
        var defer = when.defer();
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