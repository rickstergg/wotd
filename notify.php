<?php
$summonerName = filter_var($_POST['summonerName'], FILTER_SANITIZE_EMAIL);
$region = filter_var($_POST['region'], FILTER_SANITIZE_EMAIL);
$status_code = filter_var($_POST['status_code'], FILTER_SANITIZE_EMAIL);

$url = 'https://api.mailgun.net/v3/rickzhang.cool/messages';
$api_key = 'api:key-c5cf541f65f71986d2f0976183c6344b';

$params = array(
    'api_user'  => 'api',
    'api_key'   => $api_key,
	'from'      => 'Rick <mailgun@rickzhang.cool>',
    'to'        => 'rickzhang@live.ca',
	'to'		=> 'admin@rickzhang.cool',
    'subject'   => 'Error on WOTD',
    'text'      => 'name: '.$summonerName.', region: '.$region.', status code: '.$status_code
  );

// Generate curl request
$session = curl_init($url);
// Tell curl to use HTTP POST
curl_setopt ($session, CURLOPT_POST, true);
// Tell curl that this is the body of the POST
curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
// Tell curl not to return headers, but do return the response
curl_setopt($session, CURLOPT_HEADER, false);
// Tell PHP not to use SSLv3 (instead opting for TLS)
curl_setopt($session, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
print_r($response);
?>