<?php

echo json_encode($_POST);

$log  = date("F j, Y, g:i a").":".json_encode($_POST).PHP_EOL."-------------------------".PHP_EOL;
//Save string to log, use FILE_APPEND to append.
file_put_contents('./log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
?>