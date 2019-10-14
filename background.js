const hostsListUrl = "https://dbl.oisd.nl/basic/";

fetch(hostsListUrl)
  .then((response) => response.text())
  .then((responseText) => {
    let urlsToBlock = responseText
      .split("\n")
      .filter(Boolean)
      .filter((line) => !line.startsWith("#"))
      .map((host) => `*://${host}/*`);

    console.log(`${urlsToBlock.length} hosts will be blocked`);

    chrome.webRequest.onBeforeRequest.addListener(
      (requestDetails) => {
        console.log(requestDetails.url);
        return { cancel: true };
      },
      { urls: urlsToBlock },
      ["blocking"]
    );
  });
