const hostsListUrl = "https://dbl.oisd.nl/basic/";

let urlsToBlock = [];
let blockedRequestsCount = 0;
let isAdBlockingActive = true;

const blockRequest = (requestDetails) => {
  console.log(requestDetails.url);

  blockedRequestsCount++;
  chrome.browserAction.setBadgeText({ text: blockedRequestsCount.toString() });

  return { cancel: true };
};

const enableAdBlocking = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    blockRequest,
    { urls: urlsToBlock },
    ["blocking"]
  );
  chrome.browserAction.setBadgeText({ text: blockedRequestsCount.toString() });
  isAdBlockingActive = true;
};

const disableAdBlocking = () => {
  chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  chrome.browserAction.setBadgeText({ text: "off" });
  isAdBlockingActive = false;
};

const fetchListsAndEnableAdBlocking = async () => {
  const hostsResponse = await fetch(hostsListUrl);
  const hostsResponseText = await hostsResponse.text();
  urlsToBlock = hostsResponseText
    .split("\n")
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((host) => `*://${host}/*`);

  console.log(`${urlsToBlock.length} hosts will be blocked`);

  enableAdBlocking();
};

fetchListsAndEnableAdBlocking();

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === "toggleAdBlocking") {
    if (isAdBlockingActive) {
      disableAdBlocking();
      response("Désactivé");
    } else {
      enableAdBlocking();
      response("Activé");
    }
  }
});
