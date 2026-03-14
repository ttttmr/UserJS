// ==UserScript==
// @name         禁用sendBeacon
// @namespace    https://blog.xlab.app/
// @supportURL   https://github.com/ttttmr/UserJS
// @version      0.3
// @description  禁用navigator.sendBeacon
// @author       tmr
// @include      http://*
// @include      https://*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  navigator.sendBeacon = function (url, data) {
    // console.log('fake sendBeacon: ', url, data);
    return true;
  };
})();
