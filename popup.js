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
async function queryTabs( query) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(query, (tabs) => {
      resolve(tabs);
    });
  });
}

async function reloadTabs(toRight,amount) {
  let queryInfo = {
    currentWindow: true
  };
  let activeQuery = {
    active: true,
    currentWindow: true
  };
  let tabs = await queryTabs(queryInfo);
  if(toRight) {
    let activeTabs = await queryTabs(activeQuery);
    var index = -1;
	  for(i = 0;i<tabs.length;i++){
		  if(tabs[i].url == activeTabs[0].url){
			  index=i;
			  break;
		  }
	  }
	  if(index<tabs.length-1){
      if(amount>0){
        reloader(tabs.slice(index+1,),amount);
      }else{
        reloader(tabs.slice(index+1,),tabs.length);
      }
	  }
  } else {
    reloader(tabs,tabs.length);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    var tabNum = document.getElementById('tabNum');
    tabNum.addEventListener('change', () => {
      reloadTabs(true,tabNum.value);
    });
    var buttonAll = document.getElementById('reloadAll');
    buttonAll.addEventListener('click', () => {
      reloadTabs(false,-1);
    });
    var buttonRight = document.getElementById('reloadAllTabsToTheRight');
    buttonRight.addEventListener('click', () => {
      reloadTabs(true,-1);
    });
});
