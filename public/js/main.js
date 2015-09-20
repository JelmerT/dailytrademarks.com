var $container = $('.main-container');
var start = 0;
var amount = 50;

$container.isotope({
  itemSelector: '.img_tile',
    masonry: {
      isFitWidth: true
    }
});

$.extend($.lazyLoadXT, {
  edgeY:  700,
  srcAttr: 'data-src'
});

$(document).ready(function() {

	$('#marker').on('lazyshow', function () {
		$.getJSON( '/trademark', {
			amount: amount,
		    start: start
		}).done(function( data ) {
		    $.each( data, function( i, item ) {
		    	//TODO check for correct answer
		    	var image = item.serial+'-'+item.image[0];
				var elem = $('<div class="img_tile" serial="'+item.serial+'" style="width:190px;height:190px;"><span class="helper"></span><img data-src="images/'+image+'" style="max-height: 190px; max-width: 190px;" /></div>');
				// <div class="img_tile_overlay">'+item.serial+'</div>
				$container.prepend(elem);
				$container.isotope( 'appended',elem);
				$container.isotope('layout');
		    });
			start += amount;
            $(window).lazyLoadXT();
            $('#marker').lazyLoadXT({visibleOnly: false, checkDuplicates: false});
		});
    }).lazyLoadXT({visibleOnly: false});

	$container.on('click','div.img_tile',function(data){
		var serial = data.currentTarget.attributes.serial.value;
		$.magnificPopup.open({
			items: {
				src:"/trademark/popup/"+serial,
	  			type: 'ajax'
			},
			ajax: {
			  cursor: 'mfp-ajax-cur',
			  tError: '<a href="%url%">The content</a> could not be loaded.'
			},
			callbacks: {
				  ajaxContentAdded: function() {
				    $('.fotorama').fotorama();
				  }
				}
	
		});
	});


});