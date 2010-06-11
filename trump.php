<?php

session_start(); /* стартуем сессию */

$rand = rand(0,3);
$_SESSION[captcha_token] = $rand;
echo $rand;
?>