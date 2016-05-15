'use strict';

window.$ = window.jQuery = require('./js/jquery.js');

$(function () {
    let remote = require('remote');
    let screens = remote.getGlobal('screens');
    let id = getParameterByName('screen');
    let screen = screens[id];
    var webviews = null;

    switch(screen.layout.name) {
    case 'carrousel':
        webviews = carrousel(screen);
        break;
    case 'splitted':
        webviews = splitted(screen);
        break;
    }
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function carrousel(screen) {
    let webviews = [];

    for(var i = 0; i < screen.pages.length; i++) {
        let webview = $('<webview/>')
                .attr('src', screen.pages[i].url)
                .attr('style', 'width:100%; height: 100%');
        let container = $('<div></div>')
                .addClass('container')
                .addClass(i === 0 ? 'top' : 'bottom')
                .append(webview);

        $('#view').append(container);

        executeOnLoad(webview, screen.pages[i]);

        webviews.push(container);
    }
    rotate(webviews, screen.layout.time);
    return webviews;
}

function rotate(webviews, every) {
    let prev = webviews[0];
    webviews.push(webviews.shift()); // Rotate the array
    let next = webviews[0];

    next.removeClass('bottom').addClass('top');
    prev.removeClass('top').addClass('bottom');

    setTimeout(function () { rotate(webviews, every); }, every);
}

function splitted(screen) {
    let orientation = screen.layout.orientation;
    let count = screen.pages.length;
    let percentage = 100 / count;
    let webviews = [];

    for(var i = 0; i < count; i++) {
        console.log(screen.pages[i]);
        let webview = $('<webview/>').attr('src', screen.pages[i].url);
        $('#view').append(webview);

        let width  = (orientation == 'horizontal' ? 100 : percentage);
        let height = (orientation == 'horizontal' ? percentage : 100);
        let style = 'float: left;'
                + ' width: ' + width + '%;'
                + ' height:' + height + '%';
        webview.attr('style', style);

        executeOnLoad(webview, screen.pages[i]);

        webviews.push(webview);
    }
    return webviews;

}

function executeOnLoad(webview, page) {
    if(page.code !== undefined) {
        console.log(page.code);
        let code = page.code;
        let webviewObj = webview.get(0);
        webview.on('dom-ready', function() {
            webviewObj.executeJavaScript(code);
        });
    }
}
