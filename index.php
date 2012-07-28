<?php
/*-----------------------------------------------------------

A simple website online script, I built in 2008. I found it on my computer, and thought it deserved some open source goodness given to it. Released under MIT license.

-----------------------------------------------------------*/
error_reporting(0);
set_time_limit(40);

	if($_SERVER['QUERY_STRING']) {
		$q = $_SERVER['QUERY_STRING'];
		
		if(substr($q, 0, 5) == "json=") {
			$json = 1;
			$q = str_replace("json=", "", $q);
		}
		
		if(substr($q, 0, 7) == "http://") {
			$q = parse_url($q, PHP_URL_HOST);
			$q = str_replace(array('www.', '/'), '', $q);
		}
		
		flush(); /* Dump output */
		
		$ms_ = microtime();
		$qp = get_headers("http://{$q}/", true);
		
		if(is_array($qp) && $qp['Server'] != "OpenDNS Guide" && $qp['Server'][0] != "OpenDNS Guide" && $qp['Server'][1] != "OpenDNS Guide") {
			$is_online = true;
		}

		
		$ms = abs(microtime() - $ms_);
		
		if($is_online)
		{
			$output['data'] = "<div class='success'> The website {$q} is active and online! (responded in {$ms} seconds) It's probably just you. </div>";
		} else {
			$output['data'] = "<div class='error'> The website {$q} is not active and is down! It's not just you. </div>";
		}
		
		if($json) {
			header("Content-Type: text/json");
			echo json_encode($output);
			exit;
		} else {
			$display = implode($output, '');
		}
				
	}

?>

<html>
<head>
	<title>Check whether or not a website is online or not?</title>
	
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/application_config.js"></script>
	
	<style>
		body {
			margin:0px;
			padding:0px;
		}
		
		#layout {
			width:960px;
			padding:4px;
			margin-left:auto;
			margin-right:auto;
		}
		
		h1 {
			font-family: Lucida Sans Unicode, arial;
			font-weight:normal;
			font-size:32px;
			letter-spacing:-2px;
			text-align:center;
		}
		
		form, form * {
			display:inline;
		}
		
		form input {
			font-family:'Microsoft Sans Serif', arial;
			font-size:14px;
			padding:8px;
		}
		
		div.success {
			background:darkgreen;
			color:#dedede;
			font-family:arial;
			font-size:15px;
			padding:12px;
		}
		
		div.error {
			background:darkred;
			color:#dedede;
			font-family:arial;
			font-size:15px;
			padding:12px;
		}
		
		p.footer {
			font-family:arial;
			font-size:12px;
			padding-top:15px;
			text-align:center;
		}
		
		div.cc {
			width:210px;
			padding:3px;
			background:#121212;
		}
	</style>
</head>
<body>

	<div id="layout">

		<h1>Check whether a website is online or not!</h1>

		<div id='output'>
			<?php echo $display; ?>
		</div>
	
		<br />
		
		<div align="center">
			<form action="./_redirect.php" method="post" rel="ajax"> <!-- The rel='ajax' helps the AJAX detect what to process -->
					<input type='text' name='url' value='<?php /* We need to display the URL */ echo $q; ?>' size='120'>
					<div id='loader' style='display:none;'><img src='./__loader.gif' border='0'></div>
					<input type='submit' value='Go'>
			</form>
		</div>
		
		<p class='footer'>&copy; Bilawal Hameed - <a href='http://bilaw.al/'>bilaw.al</a></p>
		
	</div>

</body>
</html>