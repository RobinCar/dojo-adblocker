let isAdBlockingActive = true;

chrome.declarativeNetRequest.setExtensionActionOptions({
  displayActionCountAsBadgeText: true,
});

const enableAdBlocking = () => {
  chrome.declarativeNetRequest.updateEnabledRulesets(
    {
      enableRulesetIds: ["ruleset_1", "ruleset_2", "ruleset_3", "ruleset_4"],
    },
    () => {
      console.log("rules added");
    }
  );

  isAdBlockingActive = true;
};

const disableAdBlocking = () => {
  chrome.declarativeNetRequest.updateEnabledRulesets(
    {
      disableRulesetIds: ["ruleset_1", "ruleset_2", "ruleset_3", "ruleset_4"],
    },
    () => {
      console.log("rules removed");
    }
  );

  isAdBlockingActive = false;
};

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
