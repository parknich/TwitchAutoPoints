// Content script (runs in the context of the webpage)
(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  console.log("AutoTwitchPoints Loaded");

  // Call the main function to start the process
  main();
})();

document.addEventListener('DOMContentLoaded', function () {
  console.log("AutoTwitchPoints DOMContentLoaded")
}, false);

function waitForClaimButton() {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const claimButton = document.querySelector('button[aria-label="Claim Bonus"]');
      if (claimButton) {
        observer.disconnect();
        resolve(claimButton);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function claimButtonAppearedCallback(claimButton) {
  console.log('%c Claim button has appeared:', claimButton< "color:green;");
  try {
    claimButton.click(); // Click the claim button
  } catch(error) {
    console.error("Error while trying to click claim button: ", error)
  }
  console.log("%c Claim button clicked", "color:green;");
}

async function main() {
  try {
    const button = await waitForClaimButton();
    claimButtonAppearedCallback(button);
  } catch (error) {
    console.error('Error while waiting for the claim button:', error);
  }
}
