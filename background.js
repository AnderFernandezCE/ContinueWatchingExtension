chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  var rootbase = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?gogoanime3\.net\/$/;
  var subpage = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?gogoanime3\.net\/(?!anime-list)(?!.*\.html$)[^\/]+$/;
  if(tab.url && rootbase.test(tab.url)){
    chrome.tabs.sendMessage(tabId, {
      type: "ROOT"
    });
  }
  else if(tab.url && subpage.test(tab.url)){
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

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(sender)
//   console.log(request)
// });