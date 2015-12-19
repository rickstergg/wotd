<?php
$summoner_name = filter_var($_POST['summoner_name'], FILTER_SANITIZE_EMAIL);
$region = filter_var($_POST['region'], FILTER_SANITIZE_EMAIL);
$status_code = filter_var($_POST['status_code'], FILTER_SANITIZE_EMAIL);

$url = 'https://api.mailgun.net/v3/rickzhang.cool/messages';
$api_key = 'key-c5cf541f65f71986d2f0976183c6344b';

$params = array(
	'from'      => 'Rick <mailgun@rickzhang.cool>',
    'to'        => 'rickzhang@live.ca',
    'subject'   => 'Error on WOTD: '.$status_code,
    'text'      => 'name: '.$summoner_name.', region: '.$region
  );

$session = curl_init();
curl_setopt($session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($session, CURLOPT_USERPWD, 'api:'.$api_key);
curl_setopt($session, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($session, CURLOPT_URL, $url);
curl_setopt($session, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($session, CURLOPT_POSTFIELDS, $params);

$response = curl_exec($session);
curl_close($session);

print_r($response);
?>
