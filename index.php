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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="app.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>WOTD APP</title>
</head>

<body>
  <div class="container">
    <div class="username-selection">
      <input class="rounded" type="text" id="summonerName" name="summonerName">
    </div>

    <div class="region-selection">
      <select class="input-large" id="region" name="region">
        <option value="na" selected="selected">NA</option>
        <option value="eune">EU Nordic &amp; East</option>
        <option value="euw">EU West</option>
        <option value="br">Brazil</option>
        <option value="lan">Latin America North</option>
        <option value="las">Latin America South</option>
        <option value="oce">Oceania</option>
        <option value="ru">Russia</option>
        <option value="tr">Turkey</option>
        <option value="kr">Korea</option>
      </select>
    </div>

    <div>
      <button type="button" onClick="wotd();">LEMME KNOW</button>
    </div>

    <div class="result">
      <input type="text" id="status">
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
