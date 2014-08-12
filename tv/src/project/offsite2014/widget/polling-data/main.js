define([
    'angular',
    '../get-data/main'
], function (
    angular,
    getData
) {
    var data = {},
        fnCallback = {},
        span = 3000,
        isInit = {},
        timer = {};

    function polling(name) {
        getData(name).then(function (dataJSON) {
            if (!window.angular.equals(data[name], dataJSON[name])) {
                data[name] = dataJSON[name];
                if (fnCallback[name] && fnCallback[name].fnResolve) {
                    for (var i = 0, len = fnCallback[name].fnResolve.length; i < len; i++) {
                        fnCallback[name].fnResolve[i](data);
                    }
                }
            }
            if (fnCallback[name] && fnCallback[name].fnResolve && fnCallback[name].fnResolve.length) {
                timer[name] = setTimeout(function () {
                    polling(name);
                }, span);
            }
            else if (timer[name]) {
                clearTimeout(timer[name]);
                delete timer[name];
                delete isInit[name];
            }
        });
    }

    // function pollingData(name) {
    //     if (!isInit[name]) {
    //         isInit[name] = true;
    //         setTimeout(function () {
    //             polling(name);
    //         }, 0);
    //     }
    //     return {
    //         then: function (fnResolve, fnReject) {
    //             if (!fnCallback[name]) {
    //                 fnCallback[name] = {
    //                     fnResolve: [],
    //                     fnReject: []
    //                 };
    //             }
    //             if (fnResolve) {
    //                 var iFlg = true;
    //                 for (var i = 0, iLen = fnCallback[name].length; i < iLen; i++) {
    //                     if (fnCallback[name].fnResolve[i] == fnResolve) {
    //                         iFlg = false;
    //                         break;
    //                     }
    //                 }
    //                 if (iFlg) {
    //                     fnCallback[name].fnResolve.push(fnResolve);
    //                 }
    //             }
    //             if (fnReject) {
    //                 var jFlg = true;
    //                 for (var j = 0, jLen = fnCallback[name].length; j < iLen; j++) {
    //                     if (fnCallback[name].fnReject[j] == fnReject) {
    //                         jFlg = false;
    //                         break;
    //                     }
    //                 }
    //                 if (jFlg) {
    //                     fnCallback[name].fnReject.push(fnReject);
    //                 }
    //             }
    //         }
    //     }
    // }

    function pollingData() {}

    pollingData.on = function (name, fnResolve) {
        if (!fnCallback[name]) {
            fnCallback[name] = {
                fnResolve: [],
                fnReject: []
            };
        }
        if (fnResolve) {
            var iFlg = true;
            for (var i = 0, iLen = fnCallback[name].length; i < iLen; i++) {
                if (fnCallback[name].fnResolve[i] == fnResolve) {
                    iFlg = false;
                    break;
                }
            }
            if (iFlg) {
                fnCallback[name].fnResolve.push(fnResolve);
            }
        }

        if (!isInit[name]) {
            isInit[name] = true;

            setTimeout(function () {
                polling(name);
            }, 0);
        }
    };

    pollingData.off = function (name, fnResolve) {
        if (isInit[name] && fnResolve && fnCallback[name] && fnCallback[name].fnResolve && fnCallback[name].fnResolve.length) {
            var iFlg = -1;
            for (var i = 0, iLen = fnCallback[name].length; i < iLen; i++) {
                if (fnCallback[name].fnResolve[i] == fnResolve) {
                    iFlg = i;
                    break;
                }
            }
            if (iFlg > -1) {
                fnCallback[name].fnResolve.splice(iFlg, 1);

                if (!fnCallback[name].fnResolve.length) {
                    if (timer[name]) {
                        clearTimeout(timer[name]);
                        delete timer[name];
                    }
                    delete isInit[name];
                }
            }
        }
    };

    return pollingData;
});