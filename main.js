function addElement() {
  let fragment = document.createDocumentFragment();

  let continueElement = document.createElement("h1")
  continueElement.innerText = "CONTINUE WATCHING"
  // Create a new div element
  let divElement = document.createElement("div");
  divElement.classList.add("custom-container");

  // Create a ul element
  let ulElement = document.createElement("ul");
  ulElement.classList.add("listContinueWatching");

  // Iterate through localStorage items
  for (let i in localStorage) {
    if (i.startsWith("aid_")) {
      //get storageinfo
      let data = JSON.parse(localStorage.getItem(i))
      // Create a li element for each item in localStorage
      let liElement = document.createElement("li");
      liElement.classList.add("listStyle");
      liElement.setAttribute("data-identifier", i);

      // Create a div element inside the li
      let aInsideLi = document.createElement("a");
      aInsideLi.href = "https://gogoanime3.net/"+  i.split("_").slice(1).join("-") + "-episode-" + data.episode
      aInsideLi.classList.add("imgContainer")

      // Create an img element inside the div
      let imgElement1 = document.createElement("img");
      imgElement1.src = data.imglink; 
      imgElement1.classList.add("coverImage")

      // Append the img element to the div
      aInsideLi.appendChild(imgElement1);

      let divSecond = document.createElement("div");
      divSecond.classList.add("secondDiv")
      // Create a paragraph element inside the li
      let paragraphElement = document.createElement("p");
      paragraphElement.textContent = i.split("_").slice(1).join(" "); // Set the text content

      // Create a second img element inside the second div
      let imgElement2 = document.createElement("img");
      imgElement2.src = chrome.runtime.getURL("assets/remove.png");
      imgElement2.classList.add("adding-btn")
      imgElement2.addEventListener("click", (event) => deleteAnimeHandler(i))

      divSecond.appendChild(paragraphElement)
      // Append the second img element to the second div
      divSecond.appendChild(imgElement2);

      // Append the div to the li
      liElement.appendChild(aInsideLi);

      liElement.appendChild(divSecond);
      
      // Append the li to the ul
      ulElement.appendChild(liElement);
    }
  }

  // Append the ul to the div
  divElement.appendChild(ulElement);

  fragment.appendChild(continueElement)
  // Append the div to the fragment
  fragment.appendChild(divElement);

  // Insert the fragment at the beginning of the <body> tag
  document.body.insertBefore(fragment, document.body.firstChild);
}

function deleteAnimeHandler(identifier) {
  localStorage.removeItem(identifier);
  // Find the <li> element corresponding to the identifier
  const liToRemove = document.querySelector(`li[data-identifier="${identifier}"]`);

  // Remove the <li> element from the DOM if found
  if (liToRemove) {
    liToRemove.remove();
  }
}
(() => {
  let identifier, episode, videoPlayer; 
  //when tab close, check
  window.addEventListener('beforeunload', function (event) {
    if(localStorage.getItem(identifier)){
        let data  = JSON.parse(localStorage.getItem(identifier))
        data.episode = episode
        localStorage.setItem(identifier, JSON.stringify(data));
    }
    
});
  

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "ROOT"){
      addElement()
    }
    else if (request.type === "EPISODE"){
      identifier = request.identifier;
      episode = request.episode
      newEpisodeLoaded();
    }
  });

  const newEpisodeLoaded = () => {
    const addBtnExists = document.getElementsByClassName("adding-btn")[0];

    if (!addBtnExists){
        const bookmarkBtn = document.createElement("img")
        if (localStorage.getItem(identifier) == null){
          bookmarkBtn.src = chrome.runtime.getURL("assets/add.png");
          bookmarkBtn.title = "Click to add anime to watching";
          bookmarkBtn.className = "adding-btn";
        }
        else{
          bookmarkBtn.src = chrome.runtime.getURL("assets/included.png");
          bookmarkBtn.title = "Click to remove anime from watching";
          bookmarkBtn.className = "adding-btn " + "watching";
        }

        placeToInsert = document.querySelectorAll('.link_face:not(.intro)')[0];
        placeToInsert.appendChild(bookmarkBtn)

        bookmarkBtn.addEventListener("click", manageAnimeEventHandler)
    }
    // if(typeof videoPlayer === "undefined"){
    //   videoPlayer = document.querySelector(".play-video > iframe")
    //   videoPlayer.addEventListener("load", manageVideoPlayerEventHandler)
    // }
  }

  const manageVideoPlayerEventHandler = () =>{
    alert("algo")
    videoPlayer = document.querySelector(".jw-video")
    alert(videoPlayer)
    // iframeWindow.addEventListener("click", function(){
    //   alert("video clickdo")
    // })
    
  }


  const manageAnimeEventHandler = async () => {
    const btn = document.getElementsByClassName("adding-btn")[0];
    if(localStorage.getItem(identifier) === null){
        content = {
          episode: episode,
          imglink: await getLink()
        }
        localStorage.setItem(identifier, JSON.stringify(content));
        btn.src = chrome.runtime.getURL("assets/included.png");
        btn.className = "adding-btn " + "watching";
    }
    else{
      localStorage.removeItem(identifier);
      btn.src = chrome.runtime.getURL("assets/add.png");
      btn.className = "adding-btn";
    }
  }

  const getLink = async () => {
    //document.querySelector(".anime_info_body_bg >img").src
    
    const url = document.querySelector(".anime-info > a").href
    const response = await fetch(url);
    const html = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const link = tempDiv.querySelector(".anime_info_body_bg >img").src
    return link
  }
})();