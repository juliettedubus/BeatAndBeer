// BEATANDBEAR scripts

/**
 * detection des liens internes
 */
var rootUrl = "http://localhost:8888/HEAR-2016-BeatAndBeer/";

$.expr[':'].internal = function (obj, index, meta, stack) {
    // Prepare
    var
    $this = $(obj),
    url = $this.attr('href') || '',
    isInternalLink;
    // Check link
    isInternalLink = url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1 || obj.hostname == location.hostname;
    // Ignore or Keep
    return isInternalLink;
};

/**
 * analyse d'une URL
 * @return {[type]} [description]
 */
var parseUrl = (function () {
    var a = document.createElement('a');
    return function (url) {
        a.href = url;
        return {
            host: a.host,
            hostname: a.hostname,
            pathname: a.pathname,
            port: a.port,
            protocol: a.protocol,
            search: a.search,
            hash: a.hash
        };
    }
})();

$(document).ready(function(){

	console.log("BeatAndBeer");



	// SCRIPT DES BOUTONS
	$( "#menu_accueil" ).click(function() {
		$( "#menu" ).slideToggle( 500 );
	});
	$( "#play_accueil" ).click(function() {
		$( "#player" ).slideToggle( 500 );
	});


	$( "#menu_accueil_infos" ).click(function() { $( "#menu" ).slideToggle( 500 ); });
	$( "#play_accueil" ).click(function() { $( "#player" ).slideToggle( 500 ); });


	$( "#lien_programme_infos" ).click(function() {
		$('#grandtexte').scrollTo('#programme',2000 );
	});

	$( "#lien_infospratiques_infos" ).click(function() {
		$('#grandtexte').scrollTo('#infospratiques',2000);
	});

	$( "#lien_leprojet_infos" ).click(function() {
		$('#grandtexte').scrollTo('#leprojet',2000 );
	});

	$( "#lien_partenaires_infos" ).click(function() {
		$('#grandtexte').scrollTo('#partenaires',2000 );
	});

	$( "#lien_contact_infos" ).click(function() {
		$('#grandtexte').scrollTo('#contact',2000 );
	});


	/* tracklist! tracklist! tracklist! tracklist! tracklist! tracklist! */
	var audio;
	var tracklist;
	var tracks;
	var current;

	init();




	/**
	 * ACTIVATION DE history.js
	 * @param  {[type]} window    [description]
	 * @param  {[type]} undefined [description]
	 * @return {[type]}           [description]
	 */
	(function(window,undefined){

		var State = History.getState();
		// var rootUrl = $('meta[name=identifier-url]').attr('content');

		if ( !History.enabled ) {
			//console.log( 'History.js is disabled for this browser.');
			return false;
		}else{
			//console.log('History.js is OK.');
		}

		//History.log('initial:', State.data, State.title, State.url);

		// console.log('meta : identifier-url');
		// console.log(parseUrl(rootUrl));
		// console.log('history : getState');
		// console.log(parseUrl(State.url));

		// on ajoute une classe active si un lien correspond à l'URL de la page
		$('a').each(function(){
			if($(this).attr('href') == State.url){
				$(this).addClass('active');
			}
		});



		// Bind to StateChange Event
		History.Adapter.bind(window,'statechange',function(){
			var State = History.getState();

			console.log('--------------------------');
			console.log('State : ');
			console.log(State);
			// switch(State.data.shopp){
			// 	case 'a' :
			// 		console.log('c’est un lien AJAX' );
			// 		//AJAXboutique( State.data.url );
			// 		AJAXboutique( State.url );
			// 	break;
			// 	case 'form' :
			// 		console.log('c’est un formulaire' );
			// 	break;
			// 	case 'close' : default :
			// 		console.log('on ferme fancybox' );
			// 		//$.fancybox.close();
			// 	break;
			// }

			History.log('click:',State.data, State.title, State.url);

		});

	})(window);


	contentReady();
})


function contentReady(){
	$('a:internal').addClass('internal');

	var vid = document.getElementById("bgvid");
	vid.volume = 0;

	$('a.internal').click(function(event){

		History.pushState(
			{
				'url'   : $(this).attr('href')
			}/*,
			$('title').data('titre')+$(this).data('titre'),
			$(this).attr('href')*/
		);


		$.ajax({
			url: $(this).attr('href'),
			dataType: "html",
			success: function(data){
				console.log("success");


				var temp = $('<div/>');

				temp.append(data);
				// console.log("AJAX", temp.find("#ajax").html() );

				$('#ajax').html( temp.find("#ajax").html() );

				contentReady();
			}
		})

		event.preventDefault();
	});
}

 /* tracklist! tracklist! tracklist! tracklist! tracklist! tracklist! */


function init(){
    current = 0;
    audio = $('audio');
    tracklist = $('#tracklist');
    tracks = tracklist.find('li a');
    len = tracks.length - 1;
    audio[0].volume = .10;
    audio[0].play();
    tracklist.find('a').click(function(e){
        e.preventDefault();
        link = $(this);
        current = link.parent().index();
        run(link, audio[0]);
    });
    audio[0].addEventListener('ended',function(e){
        current++;
        if(current == len){
            current = 0;
            link = tracklist.find('a')[0];
        }else{
            link = tracklist.find('a')[current];
        }
        run($(link),audio[0]);
    });
}

function run(link, player){
    player.src = link.attr('href');
    par = link.parent();
    par.addClass('active').siblings().removeClass('active');
    audio[0].load();
    audio[0].play();
}
