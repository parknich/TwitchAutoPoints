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
  visibilityChangeFunction();
})();

document.addEventListener('DOMContentLoaded', function () {
  console.log("AutoTwitchPoints DOMContentLoaded")
}, false);

function manualCheckForClaimButton() {
  const claimButton = document.querySelector('button[aria-label="Claim Bonus"]');
  if (claimButton) {
    console.log('Claim button is present:', claimButton);
    claimButton.click(); // Click the claim button
  } else {
    console.log('Claim button not found on this page.');
  }
}

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
  main();
}

function waitForDocumentToBecomeHidden() {
  return new Promise((resolve) => {
    if (document.hidden) {
      resolve();
      return;
    }

    const visibilityChangeHandler = () => {
      if (document.hidden) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        resolve();
      }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);
  });
}

async function visibilityChangeFunction() {
  console.log('Waiting for the document to become hidden...');
  await waitForDocumentToBecomeHidden();
  console.log('Document is now hidden.');

  // Wait for the document to become visible again
  await new Promise((resolve) => {
    const visibilityChangeHandler = () => {
      if (!document.hidden) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        manualCheckForClaimButton()
        resolve();
      }
    };
    document.addEventListener('visibilitychange', visibilityChangeHandler);
  });
}



async function main() {
  try {
    const button = await waitForClaimButton();
    claimButtonAppearedCallback(button);
  } catch (error) {
    console.error('Error while waiting for the claim button:', error);
  }
}

