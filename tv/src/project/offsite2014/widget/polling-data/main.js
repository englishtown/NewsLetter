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
                if (fnCallback[name] && fnCallback[name].fnResolveAppend && (fnCallback[name].fnResolveAppend instanceof Array)) {
                    fnCallback[name].fnResolveAppend = [];
                }
            }
            else {
                if (fnCallback[name] && fnCallback[name].fnResolveAppend && (fnCallback[name].fnResolveAppend instanceof Array)) {
                    for (var i = 0, len = fnCallback[name].fnResolveAppend.length; i < len; i++) {
                        fnCallback[name].fnResolveAppend[i](data);
                    }
                    fnCallback[name].fnResolveAppend = [];
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
                fnCallback[name].fnResolveAppend.push(fnResolve);
            }
        }

        if (!isInit[name]) {
            isInit[name] = true;

            setTimeout(function () {
                polling(name);
            }, 0);
        }
    }

    function off(name, fnResolve) {
        if (isInit[name] && fnResolve && fnCallback[name] && fnCallback[name].fnResolve && fnCallback[name].fnResolve.length) {
            var iFlg = -1,
                jFlg = -1;

            for (var i = 0, iLen = fnCallback[name].fnResolve.length; i < iLen; i++) {
                if (fnCallback[name].fnResolve[i] == fnResolve) {
                    iFlg = i;
                    break;
                }
            }
            for (var j = 0, jLen = fnCallback[name].fnResolveAppend.length; j < jLen; j++) {
                if (fnCallback[name].fnResolveAppend[j] == fnResolve) {
                    jFlg = j;
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
            if (jFlg > -1) {
                fnCallback[name].fnResolveAppend.splice(jFlg, 1);
            }
        }
    }

    return new (function () {
        this.on = on;
        this.off = off;
    })();
});