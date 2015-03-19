
<?php

	$dir = "images";
	if(is_dir($dir)){
		if($dd = opendir($dir)){
			while (($f = readdir($dd)) !== false)
				if($f != "." && $f != ".." && $f != ".DS_Store")
					$files[] = $f;
			closedir($dd);
		}


	$n = $_GET["n"];
	$response = "";
		for($i = $n; $i<$n+25; $i++){
			$response = $response.$files[$i%count($files)].';';
		}
		echo $response;
	}
?>