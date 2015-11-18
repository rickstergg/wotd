$( document ).ready(function() {
	// Pseudocode: 
	//		If the last recent game played has been over 22 hours, doesn't matter what they've won or lost, wotd is up.
	// 		If the games recently weren't over 150 IP in winnings, ignore.
	//		
	
	// Countdown code
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
});

function calculateWotdAvailability(games) {
	
}

function getRecentGames(summonerName, summonerID, region) {
	console.log("Getting Recent Games.. with summonerID:"+summonerID);
	$.ajax({
		type: "POST",
		url: "wrapper.php",
		dataType: 'json',
			data: 	{	'url': "https://"+region+".api.pvp.net/api/lol/"+region+"/v1.3/game/by-summoner/"+summonerID+"/recent?"	},
		success: function(data) {
			console.log("Done");
			console.log(data);
			calculateWotdAvailability(data);
		}
	});
}

function getSummonerID(summonerName, region) {
	$.ajax({
		type: "POST",
		url:"wrapper.php",
		dataType:'json',
			data:	{	'url': "https://"+region+".api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+summonerName+"?",
						'name': summonerName
					},
		success: function(data){
			console.log("Done");
			console.log(data);
			var id = data[summonerName].id;
			getRecentGames(summonerName, id, region);
		}
	});
}

function wotd() {
	var summonerName = $('#summonerName').val();
	summonerName = summonerName.toLowerCase();
	var region = $('#region option:selected').val();
	console.log("Retrieving summoner ID");
	getSummonerID(summonerName, region);
    return true;
}