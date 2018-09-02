window.onload = () => {
  let username = document.getElementsByClassName('dashboard-card-container')[0]
    .getElementsByTagName('h5')[0].textContent.split(' ')[1];
  load(username);
  console.log('Extension works!');
}

// Main function
function load(username) {
  chrome.storage.sync.get({
    username: '',
    customGreeting: `Welcome, [${username}]`,
    customAvatar: '',
    improveUI: true,
    addMarketStats: true
  }, function(items) {
    // if first launch ever
    if (!items.username) {
      chrome.storage.sync.set({'username': username});
      items.username = username;
    }
    if (items.username == username) {
      // change Greeting Message
      if (items.customGreeting) {
        changeGreeting(items.customGreeting); 
      }
      // change Avatar
      if (items.customAvatar) { 
        changeAvatar(items.customAvatar); 
      }
    }
    // change UI a bit
    if (items.improveUI) { 
      improveUI();
    }
    // add basic market statistics to the page
    if (items.addMarketStats) {
      const request = "https://api.coinmarketcap.com/v2/ticker/1019/";
      fetch(request)
        .then(response => response.json())
        .then(function(responseJSON) {
          addMarketStats(responseJSON);
      });
    }
  });
}

function changeGreeting(newGreeting) {
  const greetingMessage = document.getElementsByClassName('dashboard-card-container')[0].getElementsByTagName('h5')[0];
  const greetingHTML = newGreeting.replace('[', '<span style="color:#fc8326;">').replace(']', '</span>');
  greetingMessage.innerHTML = greetingHTML;
}

function changeAvatar(newAvatar) {
  const avatarHTML = `<img style="width:100px;height:100px;" src="${newAvatar}" alt="User Avatar">`;
  document.getElementsByClassName('profile-headshot')[0].innerHTML = avatarHTML;  
}

function improveUI() {
  // separate Distribution Card
  const sidePart = document.getElementsByClassName('col-md-5 float-right-md')[0];
  const distrContainer = document.createElement('div');
  distrContainer.setAttribute('class', 'distribution-container dashboard-card-container');
  distrContainer.style['margin-top'] = '30px';
  
  sidePart.children[1].setAttribute('class', 'referral-container dashboard-card-container');
  sidePart.insertBefore(distrContainer, sidePart.children[1]);
  
  const distrCard = document.createElement('div');
  distrCard.setAttribute('class', 'card bg-white lg-padding z-1');
  distrContainer.appendChild(distrCard);
  
  const refContainer = sidePart.children[2].children[0];
  for (i = 7; i > 2; i--) {
    distrCard.insertBefore(refContainer.children[i], distrCard.firstChild);
  }
  distrCard.firstChild.removeAttribute('class');
  // remove ApprovedLabel
  if (distrCard.lastChild.textContent.trim() == 'approved') {
    distrCard.removeChild(distrCard.lastChild);
    distrCard.removeChild(distrCard.lastChild);
  }
  distrCard.lastChild.classList.remove('md-margin-vertical');
  // distrCard.lastChild.classList.add('md-margin-top');
  // change Selection Background Color
  const castomStyle = document.createElement('style');
  castomStyle.innerHTML = "::selection {\n    background-color: #e0eaff;\n}";
  document.head.append(castomStyle);
}

function addMarketStats(statsJSON) {
  // add basic market statistics to the side column
  const stats = statsJSON.data;

  const sidePart = document.getElementsByClassName('col-md-5 float-right-md')[0];
  const statsContainer = document.createElement('div');
  statsContainer.setAttribute('class', 'market-stats-constainer dashboard-card-container');
  statsContainer.style['margin-top'] = '30px';
  
  const statsCard = document.createElement('div');
  statsCard.setAttribute('class', 'card bg-white lg-padding z-1');
  statsCard.style.display = 'flex';
  statsCard.style.textAlign = 'center';
  statsCard.style['flex-wrap'] = 'wrap';

  const statsTitleArea = document.createElement('div');
  statsTitleArea.style.width = '90%';
  statsTitleArea.innerHTML = '<h6 class="headline small c-steel text-uppercase">Manna Market Stats</h6>';
  statsCard.appendChild(statsTitleArea);

  const moreStatsLinkArea = document.createElement('div');
  moreStatsLinkArea.style.width = '10%';
  statsCard.appendChild(moreStatsLinkArea);

  const moreStatsLink = document.createElement('a');
  const moreStatsImg = document.createElement('img');
  moreStatsLink.setAttribute('href', 'https://coinmarketcap.com/currencies/manna/');
  moreStatsLink.setAttribute('target', '_blank');
  moreStatsImg.setAttribute('src', chrome.extension.getURL('more.png'));
  moreStatsImg.setAttribute('alt', 'More Stats');
  moreStatsImg.style.width = '50%';
  moreStatsLink.appendChild(moreStatsImg);
  moreStatsLinkArea.appendChild(moreStatsLink);

  const priceBox = document.createElement('div');
  priceBox.setAttribute('class', 'md-margin-top');
  priceBox.style.width = '100%';
  priceBox.style.textAlign = 'left';
  priceBox.style['font-size'] = '14px';
  priceBox.innerHTML = `<p>Price: &nbsp<span style="font-size: 25px">$${parseFloat(stats.quotes.USD.price).toPrecision(4)}</span> USD 
  <span style="font-size: 25px" id="change24h">(${parseFloat(stats.quotes.USD.percent_change_24h).toFixed(2)} %)</span></p>`;
  statsCard.appendChild(priceBox);

  const rankBox = document.createElement('div');
  rankBox.style.width = '20%';
  rankBox.style.padding = '10px 0px';
  rankBox.innerHTML = (`<h6>Rank</h6><p>${stats.rank}</p>`);
  statsCard.appendChild(rankBox);

  const capBox = document.createElement('div');
  capBox.style.width = '50%';
  capBox.style.padding = '10px 0px';
  capBox.innerHTML = `<h6>Market Cap</h6><p>$${parseFloat(stats.quotes.USD.market_cap)
    .toLocaleString(undefined, {maximumFractionDigits: 0})} USD</p>`;
  statsCard.appendChild(capBox);

  const volumeBox = document.createElement('div');
  volumeBox.style.width = '30%';
  volumeBox.style.padding = '10px 0px';
  volumeBox.innerHTML = (`<h6>Volume (24h)</h6><p>$${parseFloat(stats.quotes.USD.volume_24h)
    .toLocaleString(undefined, {maximumFractionDigits: 0})} USD</p>`);
  statsCard.appendChild(volumeBox);
  
  statsContainer.appendChild(statsCard);
  sidePart.insertBefore(statsContainer, sidePart.children[2]);
  // change color of "price chnage in last 24 hours percent" based on its value
  if (stats.quotes.USD.percent_change_24h > 0) {
    document.getElementById('change24h').style.color = 'green';
  } else if (stats.quotes.USD.percent_change_24h < 0) {
    document.getElementById('change24h').style.color = 'red';
  } else {
    document.getElementById('change24h').style.color = '#fc8326';
  }
}