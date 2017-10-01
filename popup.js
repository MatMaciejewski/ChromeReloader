function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function reloader(tab,amount){
  if(tab.length>0&&amount>0){
    await sleep(1000);
    chrome.tabs.reload(tab[0].id);
    reloader(tab.slice(1,),amount-1);
  }
}

function reloadAllTabs(toRight){
  var queryInfo = {
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    if(toRight==true){
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
          reloader(tabs.slice(index+1,),tabs.length);
        }
      })
    }else{
      reloader(tabs)
    }
  });
}

function reloadNumberOfTabs(amount){
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
        reloader(tabs.slice(index+1,),amount);
      }
    })
  });
}

document.addEventListener('DOMContentLoaded', () => {
    var tabNum = document.getElementById('tabNum');
    tabNum.addEventListener('change', () => {
      reloadNumberOfTabs(tabNum.value);
    });
    var buttonAll = document.getElementById('reloadAll');
    buttonAll.addEventListener('click', () => {
      reloadAllTabs();
    });
    var buttonRight = document.getElementById('reloadAllTabsToTheRight');
    buttonRight.addEventListener('click', () => {
      reloadAllTabs(true);
    });
});
