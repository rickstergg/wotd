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

function validName(name) {
	return name.length >= 2 && name.length <= 16 && /[a-zA-Z0-9 ]+/.test(name);
}

function validRegion(region) {
	return (['na', 'eune', 'euw', 'br', 'lan', 'las', 'oce', 'ru', 'tu', 'kr'].indexOf(region) > -1);
}
// http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

$( document ).ready(function() {
  // Countdown code for warm up.
  /*
  var today = new Date();
  var target = new Date("November 26, 2015 10:55:00"); // WOO YEAH BABE
  var seconds = (target.getTime() - today.getTime()) / 1000;
  var days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  var hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  seconds = Math.floor(seconds);

  $("input[name='days']").val(days);
  $("input[name='hours']").val(hours);
  $("input[name='minutes']").val(minutes);
  $("input[name='seconds']").val(seconds);
  */
  
  $('.yes, .no, .maybe, .loading, .error').hide();
  
  // If they have a region in mind
  var region = getURLParameter('r');
  if(region != null && validRegion(region)) {
    $('ul.region-selection li').removeClass('selected');
	$('li[value='+region+']').addClass('selected');
  }
  window.history.pushState("", "", updateQueryStringParameter(window.location.href, 'r', $('.selected').attr('value')));
  
  // If they have a summoner name in mind
  var summonerName = getURLParameter('u');
  if(summonerName != null) {
    $('#summonerName').val(summonerName);
	wotd();
  }
  
  // Region click handler
  $('ul.region-selection li').click(function(e) { 
    $('.selected').removeClass('selected');
	$(this).addClass('selected');
	window.history.pushState("", "", updateQueryStringParameter(window.location.href, 'r', $(this).attr('value')));
  });
});

function withinTime(game, now) {
  // Get the time right now, compare it with the time the game ended
  // If it's less than 22 hours, then it's within time, and return true.
  return (((now - game.createDate) / 3600000) <= 22);
}

function meetsConditions(game) {
  // Win, >150IP, Matched game, >= smoke weed every day
  return(game['stats']['win'] && game['ipEarned'] >= 150 && game['gameType'] == 'MATCHED_GAME' && game['stats']['timePlayed'] >= 420);
}

function calculateWotdAvailability(games) {
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
        $('.no').slideDown( "slow", function() {
			// Animation complete.
		});
        return;
      }
    } else {
      // If we're outside of the 22 hour window, and we haven't found a game that looks like it is a wotd game, then return true.
      $('.loading').hide();
	  $('.yes').slideDown( "slow", function() {
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
    // Animation complete.
  });
  return;
}

function getRecentGames(summonerName, summonerID, region) {
  console.log("Getting Recent Games.. with summonerID:"+summonerID);
  $.ajax({
    type: "POST",
    url: "wrapper.php",
    dataType: 'json',
      data:   { 'url': "https://"+region+".api.pvp.net/api/lol/"+region+"/v1.3/game/by-summoner/"+summonerID+"/recent?" },
    success: function(data) {
      console.log("Done");
      console.log(data);
      calculateWotdAvailability(data['games']);
    }
  });
}

function getSummonerID(summonerName, region) {
  $.ajax({
    type: "POST",
    url:"wrapper.php",
    dataType:'json',
      data: {
            'url': 'https://'+region+'.api.pvp.net/api/lol/'+region+'/v1.4/summoner/by-name/'+encodeURIComponent(summonerName)+'?'
          },
    success: function(data){
      console.log("Done");
      console.log(data);
      // the data that comes back has to be accessed at the summoner name with no spaces
      var hashSummonerName = summonerName.toLowerCase().replace(/\s+/g, '');
      var id = data[hashSummonerName].id;
      getRecentGames(summonerName, id, region);
    }
  });
}

function processName(name) {
  return encodeURIComponent(name.toLowerCase());
}

function reset() {
    $('.yes, .no, .maybe, .error, .loading').hide();
}

function submitOnEnter(e) {
	if(e.keyCode === 13) {
        wotd();
    }
}

function error(message) {
	$('.error').show();
	$('.error').effect('shake');
	$('#message').text(message);
}

function wotd() {
  reset();
  var summonerName = $('#summonerName').val();
  var region = $(".selected").attr('value');
  window.history.pushState("", "", updateQueryStringParameter(window.location.href, 'u', summonerName)); 
  window.history.pushState("", "", updateQueryStringParameter(window.location.href, 'r', region));
  if (validName(summonerName)) {
	if (validRegion(region)) {
		console.log("Retrieving summoner ID");
		$('.loading').show();
		getSummonerID(summonerName, region);	
	} else {
		error('You need a valid region! Choose any of: ' + 'na' + ' eune' + ' euw' + ' br' + ' lan' + ' las' + ' oce' + ' ru' + ' tu' + ' kr');
	}
  } else {
	error("The summoner name you entered is not valid! (character length, letters, numbers, and spaces only.)");
  }
}
