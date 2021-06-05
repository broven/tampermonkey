// ==UserScript==
// @name         淘宝购物车多件警告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对购物车多件物品的进行高亮
// @author       metajs
// @require      https://code.jquery.com/git/jquery-3.x-git.min.js
// @match        https://cart.taobao.com/cart.htm*
// @grant        none
// ==/UserScript==
(function () {
  'use strict';
  function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
            return;
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  }
  const highLight = (element) => {
    const highLightColor = 'red';
    element.css('color', highLightColor);
    element.css('fontWeight', 'bold');
    element.css('borderWidth', '3px');
    element.parents('.J_ItemBody')
    .css('border', `2px solid ${highLightColor}`)
  };

  const findAndHighlight = () => {
    const inputArr = $('.item-amount > input');
    $.each(inputArr, (_, _ipt) => {
    const ipt = $(_ipt);
      const val = ipt.val();
      if (+val !== 1) {
        highLight(ipt);
      }
    });
  };
  const addWarningToCheckoutBtn = () => {
      $.each($('.J_CheckBoxItem:checked'), (_, val) => {
          const $el = $(val);
          if (+$el.parents('.J_ItemBody')
          .find('.item-amount>input')
          .val() !== 1) {
            $('.submit-btn>span').text('买多了!');
          }
      })
  }
  const bindEvent = () => {
        setInterval(findAndHighlight, 1000);
        setInterval(addWarningToCheckoutBtn, 1000);
      $('.item-amount').on('click', findAndHighlight);
      $('.item-amount>input').on('input', findAndHighlight);
  }
  waitForElementToDisplay('.item-amount>input', findAndHighlight, 200, 5000);
  waitForElementToDisplay('.item-amount>input', bindEvent, 200, 5000);
})();
