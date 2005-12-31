<?php
  //die('user='.$_SERVER['PHP_AUTH_USER']);
 if (!isset($_SERVER['PHP_AUTH_USER'])) {
	 header('WWW-Authenticate: Basic realm="del.iciou.us account info"');
	 header('HTTP/1.0 401 Unauthorized');
	 echo '<cancel/>';
	 exit;
 } else {
	 $timefile='time.txt';
	 $lockfile='lock.txt';
	 clearstatcache();
	 
	 $fp=fopen($lockfile,'w');
	 flock($fp, LOCK_EX);
	 $fm = filemtime($timefile);
	 $next_access_time = $fm + 1;
	 $delay = $next_access_time - time();
	 //if ($delay > 0) sleep($delay);
	 
	 $fp2 = fopen($timefile, 'w');	 
	 fwrite($fp2, "$next_access_time\n");
	 fclose($fp2);
	 
	 flock($fp, LOCK_UN);
	 fclose($fp);
	 
	 $user = $_SERVER['PHP_AUTH_USER'];
	 $passwd = $_SERVER['PHP_AUTH_PW'];
	 //$url = "http://".$user.":".$passwd."@del.icio.us/api/posts/all";
	 $url = "http://del.icio.us/api/posts/all";
	 
	 $ch = curl_init($url);
	 curl_setopt($ch, CURLOPT_USERAGENT, 'expialidocio.us');
	 curl_setopt($ch, CURLOPT_USERPWD, $user.':'.$passwd);
	 curl_exec($ch);
	 curl_close($ch);
	 exit;
	 //curl_errno and curl_error
 // int: CURLOPT_CONNECTTIMEOUT CURLOPT_HTTPAUTH=CURLAUTH_BASIC CURLOPT_MAXREDIRS
 // bool: CURLOPT_FAILONERROR CURLOPT_FOLLOWLOCATION CURLOPT_HEADER CURLOPT_RETURNTRANSFER
 // string: CURLOPT_REFERER
	// array: CURLOPT_HTTPHEADER
 //_error
 //_setopt

	 if (!$file) {
		 header('WWW-Authenticate: Basic realm="My Realm"');
		 header('HTTP/1.0 401 Unauthorized');
		 echo "del.icio.us didn't like that username and password.";
	 }
 }
?>
