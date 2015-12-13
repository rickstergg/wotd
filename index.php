<!DOCTYPE html>
<!--
Name: Rick Zhang
-->
<html>

<head>
  <meta charset="UTF-8">
  <meta name="author" content="rick">
  <meta name="description" content="wotd">
  <meta name="keywords" content="lol,league of legends,wotd">
  <script src="js/jquery.min.js"></script>
  <script src="js/app.js"></script>
  <script src="js/jquery-ui.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>OMG I DID IT</title>
  <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />
</head>

<body>
  <div class="container">
	<div class="title">
		<h1>WOTD APP</h1>
	</div>

    <div class="username-selection">
      <input class="rounded" type="text" maxlength="16" id="summonerName" name="summonerName" onkeypress="submitOnEnter(event)" autofocus>
    </div>

    <div class="region-selection">
      <ul class="input-large" id="region" name="region">
        <li value="na">NA</li>
        <li value="eune">EU.E</li>
        <li value="euw">EU.W</li>
        <li value="br">BR</li>
        <li value="lan">LAN</li>
        <li value="las">LAS</li>
        <li value="oce">OCE</li>
        <li value="ru">RUS</li>
        <li value="tr">TUR</li>
        <li value="kr">KR</li>
      </ul>
    </div>

    <div class="result">
		<div class="yes">
			<img src="img/yes.png"/>
		</div>
		<div class="no">
			<img src="img/no.png"/>
		</div>
		<div class="maybe">
			<img src="img/maybe.png"/>
		</div>
		<div class="loading">
			<img src="img/loader.gif"/>
		</div>
		<div class="error">
			<img src="img/error.png"/>
			<div id="message">
			</div>
		</div>
    </div>
  </div>
</body>

<!--
<h2>WHEN I GET TO SEE MY BB</h2>
<div class="countdown">
  <input type="text" name="days" size="2"> days, <br>
  <input type="text" name="hours" size="2"> hours, <br>
  <input type="text" name="minutes" size="2"> minutes, <br>
  <input type="text" name="seconds" size="2"> seconds, <br>
</div>
-->
</html>
