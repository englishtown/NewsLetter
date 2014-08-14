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
            }
        });
    }

    function on(name, fnResolve) {
        if (!fnCallback[name]) {
            fnCallback[name] = {
                fnResolve: [],
                fnResolveAppend: []
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

                if (fnCallback[name].fnResolve.length == 1) {
                    setTimeout(function () {
                        polling(name);
                    }, 0);
                }
                if (data[name]) {
                    fnResolve(data);
                }
            }
        }

    }

    function off(name, fnResolve) {
        if (fnResolve && fnCallback[name] && fnCallback[name].fnResolve && fnCallback[name].fnResolve.length) {
            var iFlg = -1;

            for (var i = 0, iLen = fnCallback[name].fnResolve.length; i < iLen; i++) {
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
                }
            }
        }
    }

    return new (function () {
        this.on = on;
        this.off = off;
    })();
});