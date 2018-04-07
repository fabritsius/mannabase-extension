// Saves options to chrome.storage.sync.
function save_options() {
  const username = document.getElementById('username').textContent;
  const customGreeting = document.getElementById('customGreeting').value;
  const customAvatar = document.getElementById('customAvatar').value;
  const improveUI = document.getElementById('improveUI').checked;
  const addMarketStats = document.getElementById('addMarketStats').checked;
  chrome.storage.sync.set({
    username: username,
    customGreeting: customGreeting,
    customAvatar: customAvatar,
    improveUI: improveUI,
    addMarketStats: addMarketStats
  }, function() {
    // give the User feedback
    const status = document.getElementById('status');
    status.style.visibility = "visible";
    setTimeout(function() {
      status.style.visibility = "hidden";
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    username: '',
    customGreeting: '',
    customAvatar: '',
    improveUI: true,
    addMarketStats: true
  }, function(items) {
    document.getElementById('username').innerHTML = items.username;
    document.getElementById('customGreeting').value = items.customGreeting;
    document.getElementById('customAvatar').value = items.customAvatar;
    document.getElementById('improveUI').checked = items.improveUI;
    document.getElementById('addMarketStats').checked = items.addMarketStats;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);