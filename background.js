const hostsListUrl = "https://dbl.oisd.nl/basic/";

let blockedRequestsCount = 0;

const fetchListsAndEnableAdBlocking = async () => {
  const hostsResponse = await fetch(hostsListUrl);
  const hostsResponseText = await hostsResponse.text();
  const urlsToBlock = hostsResponseText
    .split("\n")
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((host) => `*://${host}/*`);

  console.log(`${urlsToBlock.length} hosts will be blocked`);

  chrome.webRequest.onBeforeRequest.addListener(
    (requestDetails) => {
      console.log(requestDetails.url);

      blockedRequestsCount++;
      chrome.browserAction.setBadgeText({
        text: blockedRequestsCount.toString(),
      });

      return { cancel: true };
    },
    { urls: urlsToBlock },
    ["blocking"]
  );
};

fetchListsAndEnableAdBlocking();
