<?php
	header('Content-Type: application/json');
	$url = $_POST['url'];
	$json = file_get_contents($url.'api_key=325f0342-8487-463f-be24-96ed6fb11bf1');
	echo $json;
?>