chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  var rootbase = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?gogoanime3\.net\/$/;
  var subpage = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?gogoanime3\.net\/(?!anime-list)(?!.*\.html$)[^\/]+$/;

  const isPageReady = changeInfo.status === 'complete'
  const isRootPage = isPageReady && tab.url && rootbase.test(tab.url)
  const isSubPage = isPageReady && tab.url && subpage.test(tab.url)

  if(isRootPage){
    chrome.tabs.sendMessage(tabId, {
      type: "ROOT"
    });
  }
  else if(isSubPage){
    let anime = tab.url.split("net/")[1].split("-")
    let animeName = anime.slice(0,-2).join("_")
    let animeEpisode = Number(anime.slice(-2)[1])
    
    chrome.tabs.sendMessage(tabId, {
      type: "EPISODE",
      identifier: "aid_" + animeName,
      episode: animeEpisode
    });
  }
});