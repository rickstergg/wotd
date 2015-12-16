<?php
# http://stackoverflow.com/questions/14229656/mailgun-sent-mail-with-attachment
$mg_api = 'key-c5cf541f65f71986d2f0976183c6344b';
$mg_version = 'api.mailgun.net/v3/';
$mg_domain = "rickzhang.cool";
$mg_from_email = "admin@rickzhang.cool";

$mg_message_url = "https://".$mg_version.$mg_domain."/messages";

$summonerName = filter_var($_POST['summonerName'], FILTER_SANITIZE_EMAIL);
$region = filter_var($_POST['region'], FILTER_SANITIZE_EMAIL);
$status_code = filter_var($_POST['status_code'], FILTER_SANITIZE_EMAIL);

$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

curl_setopt ($ch, CURLOPT_MAXREDIRS, 3);
curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_VERBOSE, 0);
curl_setopt ($ch, CURLOPT_HEADER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);

curl_setopt($ch, CURLOPT_USERPWD, 'api:' . $mg_api);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($ch, CURLOPT_POST, true);
//curl_setopt($curl, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_HEADER, false);

//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_URL, $mg_message_url);
curl_setopt($ch, CURLOPT_POSTFIELDS,
        array(  'from'      => 'Rick <' . 'mailgun@rickzhang.cool' . '>',
                'to'        => 'rickzhang@live.ca',
                'h:Reply-To'=>  ' <' . $mg_reply_to_email . '>',
                'subject'   => 'Error on WOTD APP',
                'text'      => '',
            ));
$result = curl_exec($ch);
curl_close($ch);
$res = json_decode($result,TRUE);
print_r($res);
?>