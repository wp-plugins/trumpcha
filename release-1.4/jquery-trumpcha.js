(function($){
 $.fn.trumpcha = function() {
/*
 * @author Cane
 * @version 1.1
 * @description unique CAPTCHA plugin
 * @url http://cane.0fees.net/
 */
/* масти
 * ♠ - &spades; - &#9824; - black spade suit
 * ♥ - &hearts; - &#9829; - black heart suit
 * ♦ - &diams;  - &#9830; - black diamond suit
 * ♣ - &clubs;  - &#9827; - black club suit
*/
  $(this).each( function() {
    // капчу будем добавлять в форму ( #commentform)
    var form = this;
    // добавляем html капчи
    $(form).append('<div id="trumpcha"><p>Скиньте козырь в дом.</p></div>');
    $('#trumpcha').append('<ul id="deck" class="deck contour"></ul>');
    $('#trumpcha').append('<div id="house" class="contour"><h4><span class="ui-icon ui-icon-home">Дом</span> дом</h4></div>');
    $('#deck').append('<li class="red heart"><span class="card">&hearts;</span><a href="#off" title="Скинуть масть в Дом" alt="&rarr;" class="ui-icon ui-icon-refresh">&rarr;</a></li>');
    $('#deck').append('<li class="black spade"><span class="card">&spades;</span><a href="#off" title="Скинуть масть в Дом" alt="&rarr;" class="ui-icon ui-icon-refresh">&rarr;</a></li>');
    $('#deck').append('<li class="red diamond"><span class="card">&diams;</span><a href="#off" title="Скинуть масть в Дом" alt="&rarr;" class="ui-icon ui-icon-refresh">&rarr;</a></li>');
    $('#deck').append('<li class="black club" id="drop"><span class="card">&clubs;</span><a href="#off" title="Скинуть масть в Дом" alt="&rarr;" class="ui-icon ui-icon-refresh">&rarr;</a></li>');
    // козырную масть определяем по рэндому
    //var r = Math.floor(Math.random()*3);
    // на сервере
    var r = $.ajax({ url: resp, async: false }).responseText;
    //alert(r);
    //$('#house h4').append(r);
   	//var suits = Array("черви", "пики", "бубны", "трефы");
    // масть
    var $suite = $('#deck > li');
    // заглавие каптчи
    var $capt = $('#trumpcha > p');
    // колода (флот)
    var $deck = $('#deck'); 
    // дом
    var $house = $('#house');
       
    switch (r) {
                  case '0': 
                    // козырная масть червы
                    $suite = $('#deck > li.heart');
                    $capt.prepend('Козырь <acronym title=\"&hearts; - черви (червы, жиры)\">черва</acronym>. ');
                    break;
                  case '1':
                    // козырная масть пика
                    $suite = $('#deck > li.spade');
                    $capt.prepend('Козырь <acronym title=\"&spades; - пики (вины, вини)\">пика</acronym>. ');
                    break;
                  case '2':
                    // козырная масть бубна
                    $suite = $('#deck > li.diamond');
                    $capt.prepend('Козырь <acronym title=\"&diams; - бубны (бубни, буби, звонки)\">бубна</acronym>. ');
                    break;
                  case '3':
                    // козырная масть трефа
                    $suite = $('#deck > li.club');
                    $capt.prepend('Козырь <acronym title=\"&clubs; - трефы (крести, кресты, желуди)\">трефа</acronym>. ');
                  break;
               }
    // задаем казырную масть
    $suite.addClass('trump');     
    
    // масти из колоды можно переносить мышью
	$('li',$deck).draggable({
		cancel: '',// clicking an icon won't initiate dragging
		revert: 'invalid', // если зацепленная карта отпущена, то она возвращается на место
		helper: 'clone', // при перетаскивании оригинал карты остается на месте
		cursor: 'move'
	});
	
	// Дом может принимать только казырную масть
	$house.droppable({
		accept: 'li.trump',
		activeClass: 'house-highlight',
		drop: function(ev, ui) {
            foldSuit(ui.draggable);           				
		}				
	});
    	
	// делаем иконки на мастях кликабельными
	$('ul#deck > li').click(function(ev) {
		var $item = $(this);
		var $target = $(ev.target);
		if ($target.is('a.ui-icon-refresh')) {
		    // кликнули на иконке казырной масти
		    if ($item.hasClass('trump')) {
      		   foldSuit($item);
	  		   //$('li',$deck).draggable('destroy');	
    		}
            else {
			   $capt.html('Данная масть не козырь!');
            }
		}
		// возвращяем обязательно false, чтобы не отрабатывал переход по ссылке
		return false;
	}); 

	// заменяем иконку на карте в доме
    var house_icon = '<a title="Козырная масть в доме" class="ui-icon ui-icon-link">&rarr;</a>';
	// скинуть масть в дом	
    function foldSuit($item) {
		$item.fadeOut(function() {
            var $list = $('<ul class="house" />').appendTo($house);
			$item.find('a.ui-icon-refresh').remove();
			$item.append(house_icon).appendTo($list).fadeIn();
			$item.draggable('destroy');
			$capt.html('Козырь в доме!').addClass('state-captcha');
			$house.toggleClass('house-full'); 
			$(form).append('<input type="hidden" style="display: none;" name="captcha_token" id="captcha-token" value="' + r + '" />');			
		});
	}
    
    // проверяем наличие trampch'y пере отправкой
    $(form).submit(function() {
        var n = jQuery("#captcha-token").size();
        if (n > 0) {
          //alert("Каптча есть!");
          return true;
        }
        else {
          //$capt.html('<span class="ui-icon ui-icon-alert" />Скиньте козырь в дом.').addClass('ui-state-error-text');
          $capt.html('Скиньте козырь в дом.').addClass('state-error');
          return false;
        }
    })	

  });
 };     
})(jQuery);