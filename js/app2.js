var app = new App();

function submitOnEnter(e) {
  if(e.keyCode === 13) {
    // allow submission to go through only if another response is not currently going.
    app.wotd();
  }
}

// http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function validName(name) {
  return name.length >= 2 && name.length <= 16 && name.match(/^[A-Za-z0-9 ]+$/i) !== null;
}

function validRegion(region) {
  return (['na', 'eune', 'euw', 'br', 'lan', 'las', 'oce', 'ru', 'tu', 'kr'].indexOf(region) > -1);
}

function withinTime(game, now) {
  // Get the time right now, compare it with the time the game ended
  // If it's less than 22 hours, then it's within time, and return true.
  return (((now - game.createDate) / 3600000) <= 22);
}

function meetsConditions(game) {
  // Win, >150IP, Matched game, >= smoke weed every day
  return(game['stats']['win'] && game['ipEarned'] >= 150 && game['gameType'] == 'MATCHED_GAME' && game['stats']['timePlayed'] >= 420);
}

function calculateTime(game) {
  var today = new Date();
  var up = game.createDate + 79200000;
  var remaining = (up - today.getTime()) - 1000;
  var seconds = Math.floor( (remaining/1000) % 60 );
  var minutes = Math.floor( (remaining/1000/60) % 60 );
  var hours = Math.floor( (remaining/(1000*60*60)) % 24 );
  return { 'total': remaining, 'hours': hours, 'minutes': minutes, 'seconds': seconds }
}

// https://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter/6021027#6021027
function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

$( document ).ready(function() {
  $('.yes, .no, .maybe, .loading, .error, .timer').hide();

  // If they have a region in mind
  var region = getURLParameter('r');
  if(region != null && validRegion(region)) {
    $('ul.region-selection li').removeClass('selected');
    $('li[value='+region+']').addClass('selected');
  }
  window.history.pushState('', '', updateQueryStringParameter(window.location.href, 'r', $('.selected').attr('value')));

  // If they have a summoner name in mind
  var summonerName = getURLParameter('u');
  if(summonerName != null) {
    $('#summonerName').val(summonerName);
    app.wotd();
  }

  // Region click handler
  $('ul.region-selection li').click(function(e) {
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    window.history.pushState('', '', updateQueryStringParameter(window.location.href, 'r', $(this).attr('value')));
  });
});

function App() {
  this.disabled = false;
  this.interval = null;

  this.resetResults = function() {
    $('.yes, .no, .maybe, .error, .loading, .timer').hide();
    $('.timer').text('');
    clearInterval(this.interval);
  };

  this.error = function(message) {
    $('.error').show();
    $('.error').effect('shake');
    $('#message').text(message);
  };

  this.wotd = function() {
    this.resetResults();
    // Check availability of disable
    if(this.disabled) {
      this.error("Submissions are disabled because of API errors! Refresh the page after a while!");
      return;
    }
    var summonerName = $('#summonerName').val();
    var region = $('.selected').attr('value');
    window.history.pushState('', '', updateQueryStringParameter(window.location.href, 'u', summonerName));
    window.history.pushState('', '', updateQueryStringParameter(window.location.href, 'r', region));
    if (validName(summonerName)) {
      if (validRegion(region)) {
        $('.loading').show();
        this.getSummonerID(summonerName, region);
      } else {
        this.error('You need a valid region! Choose any of: ' + 'na' + ' eune' + ' euw' + ' br' + ' lan' + ' las' + ' oce' + ' ru' + ' tu' + ' kr');
      }
    } else {
      this.error('The summoner name you entered is not valid! (character length, letters, numbers, and spaces only.)');
    }
  };

  this.initializeCountdown = function(game) {
    var countdown = document.getElementById('timer');
    this.interval = setInterval(function() {
    var t = calculateTime(game);
      countdown.innerHTML =
        ('0' + t.hours).slice(-2) + ':' +
        ('0' + t.minutes).slice(-2) + ':' +
        ('0' + t.seconds).slice(-2);
      if(t.total <= 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  this.calculateWotdAvailability = function(games) {
    /* Pseudocode:
      Constants:
        - 10 game list.
        - Rules for win of the day.
        - Win, 150 IP, > 7 minutes of a game, anything but custom game, every 22 hours.
      Within last 22 hours, find the game they got win of the day.
      If criteria was met, return no. Otherwise, yes.
      Cannot find game they got win of the day, game 10 was within 22 hours, return maybe? Need moar games!!!
      Cannot find game they got win of the day, game 10 outside 22 hours, return yes.
    */
    var now = new Date().getTime();

    for(var i = 0; i < games.length; i++) {
      // While game time is less than 22 hours from now, check if it satisfies the wotd conditions.
      if(withinTime(games[i], now)) {
        if(meetsConditions(games[i])) {
          // If we find a game that meets the conditions, then wotd was gotten on this game (not factoring in IP boosts)
          // So, we need to return false, since it's not up.
          $('.loading').hide();
          $('.no').slideDown( 'slow', function() {
            // Animation complete.
          });
          $('.timer').show();
          this.initializeCountdown(games[i]);
          return;
        }
      } else {
        // If we're outside of the 22 hour window, and we haven't found a game that looks like it is a wotd game, then return true.
        $('.loading').hide();
        $('.yes').slideDown( 'slow', function() {
          // Animation complete.
        });
        return;
      }
    }

    // If we get here, we looped through all 10 games, and none of them:
    // Were within the time and met the conditions.
    // Possible if user plays more than 10 games within 22 hours.
    $('.loading').hide();
    $('.maybe').slideDown( "slow", function() {
      this.error('You have played more than 10 games in the last 22 hours! I can not see past that, so I can only say maybe! =(');
    });
    return;
  };

  this.getRecentGames = function(summonerName, summonerID, region) {
    console.log('Getting Recent Games.. with summonerID: '+summonerID);
    $.ajax({
      type: "POST",
      url: "wrapper.php",
      dataType: 'json',
      data:   { 'url': 'https://'+region+'.api.pvp.net/api/lol/'+region+'/v1.3/game/by-summoner/'+summonerID+'/recent?' },
      success: function(data) {
        if(data['response'] == 200) {
          this.calculateWotdAvailability(data['games']);
        } else {
          this.handleError(summonerName, region, data['response']);
        }
      },
      error: this.handlePHPError
    });
  };

  this.getSummonerID = function(summonerName, region) {
    console.log('Retrieving summoner ID');
    $.ajax({
      type: "POST",
      url:"wrapper.php",
      dataType:'json',
      data:
        {
          'url': 'https://'+region+'.api.pvp.net/api/lol/'+region+'/v1.4/summoner/by-name/'+encodeURIComponent(summonerName)+'?'
        },
      success: function(data){
        if(data['response'] == 200) {
          // the data that comes back has to be accessed at the summoner name with no spaces
          var hashSummonerName = summonerName.toLowerCase().replace(/\s+/g, '');
          var id = data[hashSummonerName].id;
          this.getRecentGames(summonerName, id, region);
        } else {
          this.handleError(summonerName, region, data['response']);
        }
      },
      error: this.handlePHPError
    });
  };

  this.handlePHPError = function() {
    this.resetResults();
    this.error("Rick must've done goofed somewhere in the PHP, hold on! ;3");
  };

  this.notify = function(summonerName, region, statusCode) {
    console.log('Admin is being notified');
    $.ajax({
      type: "POST",
      url: "notify.php",
      dataType: 'text',
      data:
      {
        'summoner_name' : summonerName,
        'region' : region,
        'status_code' : statusCode
      },
      success: function(data) {
        console.log("Successfully notified!");
      },
      error: function(xhr, responseText, thrownError) {
        console.log("Failed to notify admin.");
      }
    });
  };

  this.handleError = function(summonerName, region, statusCode) {
    this.resetResults();
    switch(statusCode) {
      case 400:
        this.error('Okay, so you may have found an edge case that messes up the request, or I dun goofed.');
        break;
      case 401:
        this.error('Something is messed up with the API Key, let me take a look at it soontime.');
        break;
      case 404:
        this.error('This username does not exist or does not have any recent games played.');
        return;
      case 415:
        this.error('I dunno what you did but I am curious..');
        break;
      case 429:
        // ANTI SPAM MECHANISMS and RATE LIMIT IMPLEMENTATIONS
        this.disabled = true;
        this.error('API limit reached! Disabling!');
        break;
      case 500:
        this.error('Alright, Rito did something that is messing up on their server side');
        break;
      case 503:
        this.error('Riot is unable to handle the request for some reason. Try again later, maybe.');
        break;
      default:
        this.error('I have no idea what Riot sent me. Hold up.');
    }
    this.notify(summonerName, region, statusCode);
  };
}