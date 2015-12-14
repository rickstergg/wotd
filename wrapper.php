<?php

	// http://php.net/manual/en/reserved.variables.httpresponseheader.php#117203
	function parseHeaders( $headers )
	{
		$head = array();
		foreach( $headers as $k=>$v )
		{
			$t = explode( ':', $v, 2 );
			if( isset( $t[1] ) )
				$head[ trim($t[0]) ] = trim( $t[1] );
			else
			{
				$head[] = $v;
				if( preg_match( "#HTTP/[0-9\.]+\s+([0-9]+)#",$v, $out ) )
					$head['reponse_code'] = intval($out[1]);
			}
		}
		return $head;
	}


  header('Content-Type: application/json');
  $url = $_POST['url'];
  $json = file_get_contents($url.'api_key=325f0342-8487-463f-be24-96ed6fb11bf1');
  echo $json;
  echo parseHeaders($http_response_header));
?>
