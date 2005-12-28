<?php
 if (!isset($_SERVER['PHP_AUTH_USER'])) {
   header('WWW-Authenticate: Basic realm="My Realm"');
   header('HTTP/1.0 401 Unauthorized');
   echo 'Text to send if user hits Cancel button';
   exit;
 } else {
	 $user = $_SERVER['PHP_AUTH_USER'];
	 $passwd = $_SERVER['PHP_AUTH_PW'];
	 if ($user == 'ows') $user = 'osteele';
	 $user = 'osteele';
	 $passwd = 'pa55wdde';
	 //if ($passwd == 'passwd') $passwd = 'pa55wdde';
	 $url = "http://".$user.":".$passwd."@del.icio.us/api/posts/all";
	 $file = @fopen($url, "r");
	 //$file = fsockopen("www.example.com", 80, $errno, $errstr, 30);
	 //die('err '.$errno.', '.$errstr);
	 if (!$file) {
		 die('no file');
	 }
	 //die($http_response_header);
	 header("Content-type: application/xml");
	 while (!feof($file)) {
		 $line = fgets($file, 1024);
		 echo $line;
	 }
	 fclose($file);
 }
// $http_response_header or stream_get_meta_data()
?>