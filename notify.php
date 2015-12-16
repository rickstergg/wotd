<?php
#http://karavadra.net/php-mail-function-with-bluehost-working/
#http://stackoverflow.com/questions/1055460/how-to-sanitze-user-input-in-php-before-mailing

$summonerName = filter_var($_POST['summonerName'], FILTER_SANITIZE_EMAIL);   
$region = filter_var($_POST['region'], FILTER_SANITIZE_EMAIL);   
$code = filter_var($_POST['status_code'], FILTER_SANITIZE_EMAIL);

$emailto = 'rickzhang@live.ca';
$toname = 'Rick Zhang';
$emailfrom = 'marupakuuu@rickzhan.cool';
$fromname = 'Server';
$subject = 'WOTD APP';
$messagebody = 'Someone tried to search with username: ' . $summonerName . ' on ' . $region . ' and got ' . $code;
$headers = 
	'Return-Path: ' . $emailfrom . "\r\n" . 
	'From: ' . $fromname . ' <' . $emailfrom . '>' . "\r\n" . 
	'X-Priority: 3' . "\r\n" . 
	'X-Mailer: PHP ' . phpversion() .  "\r\n" . 
	'Reply-To: ' . $fromname . ' <' . $emailfrom . '>' . "\r\n" .
	'MIME-Version: 1.0' . "\r\n" . 
	'Content-Transfer-Encoding: 8bit' . "\r\n" . 
	'Content-Type: text/plain; charset=UTF-8' . "\r\n";
$params = '-f ' . $emailfrom;
$test = mail($emailto, $subject, $messagebody, $headers, $params);
# $test should be TRUE if the mail function is called correctly
echo $test;
?>