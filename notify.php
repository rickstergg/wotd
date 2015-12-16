<?php
$summonerName = filter_var($_POST['summonerName'], FILTER_SANITIZE_EMAIL);
$region = filter_var($_POST['region'], FILTER_SANITIZE_EMAIL);
$status_code = filter_var($_POST['status_code'], FILTER_SANITIZE_EMAIL);
print_r('name: '.$summonerName.', region: '.$region.', status code: '.$status_code);

$url = 'https://api.mailgun.net/v3/rickzhang.cool/messages';
$api_key = 'api:key-c5cf541f65f71986d2f0976183c6344b';

$params = array(
	'from'      => 'Rick <mailgun@rickzhang.cool>',
    'to'        => 'rickzhang@live.ca',
    'subject'   => 'Error on WOTD',
    'text'      => 'name: '.$summonerName.', region: '.$region.', status code: '.$status_code
  );

// Generate curl request
$session = curl_init();
// Set opts
curl_setopt($session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($session, CURLOPT_USERPWD, 'api:'.$api_key);
curl_setopt($session, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($session, CURLOPT_URL, $url);
curl_setopt($session, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($session, CURLOPT_POSTFIELDS, $params);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
print_r($response);
?>