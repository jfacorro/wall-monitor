'use strict';

function rotate(webviews, every) {
    console.log('rotating');
    webviews[0].hide();
    webviews.push(webviews.shift()); // Rotate the array
    webviews[0].show().attr('style', 'width:100%; height: 100%');
    setTimeout(function () { rotate(webviews, every); }, every);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

window.$ = window.jQuery = require('./js/jquery.js');

$(function () {
    let remote = require('remote');
    let screens = remote.getGlobal('screens');
    let id = getParameterByName('screen');
    let screen = screens[id];
    let webviews = [];

    for(var i = 0; i < screen.urls.length; i++) {
        let webview = $('<webview/>').attr('src', screen.urls[i]);
        $('#view').append(webview);

        if(i === 0) {
            webview.show().attr('style', 'width:100%; height: 100%');
        } else {
            webview.hide();
        }

        webviews.push(webview);
    }
    rotate(webviews, screen.rotation);
});
