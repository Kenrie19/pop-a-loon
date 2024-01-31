import { storage } from "../utils";
import "./style.css";

const balloonCount = document.getElementById("balloonCount")!;

function setBalloonCount(count: number) {
  console.log("Setting balloon count:", count);
  
  balloonCount.textContent = count.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  storage.get("balloonCount").then((result) => {
    setBalloonCount(result.balloonCount);
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'updateCounter') {
    console.log('Received updated counter:', message);

    // Update the popup UI or perform other actions as needed
    setBalloonCount(message.balloonCount);
  }
});