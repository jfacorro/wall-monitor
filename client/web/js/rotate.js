window.$ = window.jQuery = require('./js/jquery.js');

function rotate(webviews, every) {
    console.log('rotating');
    webviews[0].hide();
    webviews.push(webviews.shift()); // Rotate the array
    webviews[0].show();
    setTimeout(function () { rotate(webviews, every); }, every);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

$(function () {
    let remote = require('remote');
    let screens = remote.getGlobal('screens');
    let id = getParameterByName('screen');
    let screen = screens[id];
    let webviews = [];

    for(var i = 0; i < screen.urls.length; i++) {
        let webview = $('<webview/>')
                .attr('src', screen.urls[i])
                .attr('style', 'width:100%; height: 100%');
        $('#view').append(webview);

        if(i === 0) {
            webview.show();
        } else {
            webview.hide();
        }

        webviews.push(webview);
    }
    rotate(webviews, screen.rotation);
});
