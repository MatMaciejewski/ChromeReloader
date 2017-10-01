// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}



async function getCurrentTabIndex(){
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    console.log(tabs);
    console.log("INSIDE GET");
  });

  console.log("Poszukiwany ",url)
  var queryInfo = {
      currentWindow: true
  }
  chrome.tabs.query(queryInfo, (tabs) => {
    for (i = 0; i < tabs.length; i++) {
      if( tabs[i].url == url ){
        console.log("Index GET ",i);
        console.log("Index GET ",i);
        return i
      }
      console.log("NOPE ",tabs[i].url)
      // await sleep(500);
      // await sleep(500);
      // chrome.tabs.reload(tabs[i].id);
    }
  });

  return -1;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function reloader(tab){
  if(tab.length>0){
    await sleep(1000);
    chrome.tabs.reload(tab[0].id);
    reloader(tab.slice(1,));
  }
}

function reloadAllTabs(){
  var queryInfo = {
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (act) => {
      var index = -1;
      for(i = 0;i<tabs.length;i++){
        if(tabs[i].url == act[0].url){
          index=i;
          break;
        }
      }
      if(index<tabs.length-1){
        reloader(tabs.slice(index+1,));
      }
    })
    // reloader(tabs)
  });
}



document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var tabNum = document.getElementById('tabNum');
    tabNum.addEventListener('change', () => {
      console.log("Number");
      reloadAllTabs();
    });
    var button = document.getElementById('reloadAll');
    button.addEventListener('click', () => {
      console.log("Button");
      reloadAllTabs();
    })
  });
});
