define([

], function (

) {
    return function ($container, data) {
        for (i in data) {
            var val = data[i];
                $item = $container.find('.' + i);
            if (val && $item && $item.length) {
                $item.each(function () {
                    if (this.tagName.toLowerCase() === 'img') {
                        this.src = val;
                    }
                    else {
                        $(this).html(val.replace(/\r\n/ig, '<br />').replace(/\r/ig, '<br />').replace(/\n/ig, '<br />'));
                    }
                });
            }
        }
        return $container;
    };
});