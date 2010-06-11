<?php
/*
Plugin Name: WP-TrumpCHA
Plugin URI: http://cane.0fees.net
Description: The unique jquery ajaxed one-click/mouse-move CAPTCHA.
Version: 1.4
Author: Cane
Author URI: http://cane.0fees.net
*/ 


if ( !function_exists ('add_action') ) {
	header('Status: 403 Forbidden');
	header('HTTP/1.1 403 Forbidden');
	exit();
}

if ( function_exists('add_action') ) {
	// plugin definitions
    define( 'WP_TCPL_URL', dirname( WP_PLUGIN_URL . '/' . plugin_basename( __FILE__ ) ) );	
}

// если не в админке
if ( !is_admin() ) {

    add_action('wp_head', 'jquery_include', 8);
    add_action('wp_head', 'trumpcha_include', 9);
    add_action('preprocess_comment', 'check_trumpcha_comment_post');   
}

// при отправке комментария, проверяем выполнена ли trampcha (находится ли козырь в доме)
function check_trumpcha_comment_post($comment){
  if(!session_id())
    session_start();
  
  if(isset($_POST['captcha_token']) && $_POST['captcha_token'] == $_SESSION['captcha_token']){
		unset($_SESSION[captcha_token]);
		return($comment);
	}	
	else 
      wp_die("Error: Скиньте козырь в дом!");
}

//Подключаем jQuery UI и trumpcha 
function trumpcha_include() {
  if ( comments_open() && ( is_single() || is_page() ) ) {    
echo '
<script type="text/javascript" src="' . WP_TCPL_URL . '/jquery-trumpcha.js"></script>
<link type="text/css" href="' . WP_TCPL_URL . '/ui/jquery-ui.css" rel="stylesheet" />
<link type="text/css" href="' . WP_TCPL_URL . '/style.css" rel="stylesheet" />
<script type="text/javascript">
var resp ="' . WP_TCPL_URL . '/trump.php";
var $jq = jQuery.noConflict();
$jq(document).ready(function(){  
  $jq("#commentform").trumpcha();
});      	              	
</script>
';
  }
}
    // подключаем jQuery
    function jquery_include() {
      if ( comments_open() && ( is_single() || is_page() ) ) {    
        //wp_deregister_script('jquery');
    	//wp_register_script('jquery', WP_PLUGIN_URL . '/wp-trumpcha/jquery-1.4.2.min.js', false, '1.4.2');
    	wp_enqueue_script('jquery');
    	/* jQuery UI custom trump сборка включает в себя:
    	- jquery.ui.core.js
    	- jquery.ui.widget.js
    	- jquery.ui.mouse.js
    	- jquery.ui.draggable.js
    	- jquery.ui.droppable.js
    	*/
    	wp_enqueue_script('jquery-ui-trump', WP_TCPL_URL . '/ui/jquery-ui-1.8.1.trump.min.js', false, '1.8.1');
    }
}


?>