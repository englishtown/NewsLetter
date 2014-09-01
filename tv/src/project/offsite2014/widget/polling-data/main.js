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
        timer = {},

        $console,
        dateUpdate
        iConsole = 0;

    function getStrDate() {
        var now = new Date();
        return now.getHours().toString() + ':' + now.getMinutes().toString() + ':' + now.getSeconds().toString();
    }

    function polling(name) {
        if (!$console || !$console.length) {
            $console = $('.console');
        }
        $console.html($console.html() + ' <b>|</b> ' + 'begin getData');
        if (fnCallback[name] && !fnCallback[name].isGetingData) {
            fnCallback[name].isGetingData = true;
        }
        getData(name).then(function (dataJSON) {
            $console.html($console.html() + ' <b>|</b> ' + 'receive data');
            var isEquals = true;
            try {
                isEquals = window.angular.equals(data[name], dataJSON[name]);
            } catch (ex) {
                $console.html($console.html() + ' <b>|</b> ' + 'equals error');
            }
            if (!isEquals) {
                dateUpdate = getStrDate();
                $console.html($console.html() + ' <b>|</b> ' + 'fillData');
                data[name] = dataJSON[name];
                $console.html($console.html() + ' <b>|</b> ' + 'callback');
                if (fnCallback[name] && fnCallback[name].fnResolve) {
                    for (var i = 0, len = fnCallback[name].fnResolve.length; i < len; i++) {
                        fnCallback[name].fnResolve[i](data);
                    }
                }
                $console.html($console.html() + ' <b>|</b> ' + 'UI updated');
            }
            $console.html(
                $console.html() + ' <b>|</b> ' + 'getData:' + getStrDate() + '<br />'
                + '!equals: ' + dateUpdate
            );
            if (timer[name]) {
                $console.html($console.html() + ' <b>|</b> ' + 'clearTimeout');
                clearTimeout(timer[name]);
                delete timer[name];
            }
            if (fnCallback[name] && fnCallback[name].fnResolve && fnCallback[name].fnResolve.length) {
                $console.html($console.html() + ' <b>|</b> ' + 'setTimeout:' + span);
                timer[name] = setTimeout(function () {
                    $console.html('run polling ' + (++iConsole).toString());
                    polling(name);
                }, span);
            }

            if (fnCallback[name] && fnCallback[name].isGetingData) {
                fnCallback[name].isGetingData = false;
            }
        });
    }

    function on(name, fnResolve) {
        if (!fnCallback[name]) {
            fnCallback[name] = {
                fnResolve: [],
                isGetingData: false
            };
        }
        if (fnResolve) {
            var iFlg = true;
            for (var i = 0, iLen = fnCallback[name].fnResolve.length; i < iLen; i++) {
                if (fnCallback[name].fnResolve[i] == fnResolve) {
                    iFlg = false;
                    break;
                }
            }
            if (iFlg) {
                fnCallback[name].fnResolve.push(fnResolve);

                if ((fnCallback[name].fnResolve.length == 1) && !fnCallback[name].isGetingData) {
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