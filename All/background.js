function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function reloader(tab){
  console.log("Reloader");
  if(tab.length>0){
    await sleep(1000);
    chrome.tabs.reload(tab[0].id);
    console.log("Deeper");
    reloader(tab.slice(1,));
  }
}

async function queryTabs( query) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(query, (tabs) => {
      resolve(tabs);
    });
  });
}

async function reloadTabs(){
  console.log("Reloading");
  let tabs = await queryTabs({currentWindow: true});
  reloader(tabs);
}

chrome.browserAction.onClicked.addListener(reloadTabs);
