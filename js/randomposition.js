/*
* Program: randomposition.js
* Purpose: show input in random position
* Author: Steve Wu
* Last Updated: 2014-06-11
* Main function: create div with random font and style,
* 		check to avoid div overlaps,
* 		stop loop if can not find correct space for new div after tried 100 times.

*/

// use for id for new divs
var i = 0;
var divid;

//for save created divs positions
var alldivpositions = [];

// for stop loop if no enough space
var count = 0;

$(document).ready(function() {

	$('#userinput').focus();
	$('#userinput').keyup(function(e) {
		// listen for enter be pressed. Keycode==13
		if (e.keyCode == 13) {

			// create new div
			makeDiv();
			count = 0;

			// empty inpt
			$('#userinput').val('');
		}
	});
});

// create new div, put it below input box.
// create random font size, color and style
function makeDiv() {
	var divsize = ((Math.random() * 100) + 300).toFixed();
	// random color
	var color = '#' + Math.round(0xffffff * Math.random()).toString(16);
	// random font size
	var fontsize = ((Math.random() * 150) + 6).toFixed();
	//random start point for new div
	var posx = (Math.random() * 100).toFixed();
	var posy = (Math.random() * 100).toFixed();
	// random font
	var font = ['arial', 'arial black', 'futura', 'impact', 'rockwell', 'times new roman'];
	var randomfont = ((Math.random() * 100).toFixed()) % 6;
	// random font style
	var fontstyle = ['normal', 'italic', 'oblique'];
	var randomstyle = ((Math.random() * 10).toFixed()) % 3;
	// get input value
	var str = $('#userinput').val();
	// prepare for div id
	i++;
	divid = 'div' + i;

	// create new div
	$newdiv = $('<div/>', {
		id : divid,
		text : str
	});
	// new div add css
	$newdiv.css({
		'color' : color,
		'font-family' : font[randomfont],
		'font-size' : fontsize + 'px',
		'font-style' : fontstyle[randomstyle],
		'position' : 'absolute',
		'left' : posx + '%',
		'top' : posy + '%',
		'display' : 'none'
	});
	//add new div to page
	$newdiv.appendTo('#fornewdiv').fadeIn(100).delay(300);

	//get new div position
	var positions = document.getElementById(divid).getBoundingClientRect();
	// save all positions in array
	alldivpositions.push(positions);

	// check to avoid overlap
	noOverlap();
}

// if overlap, remove the div, create new one
function noOverlap() {

	// get position of last new div
	var nleft = alldivpositions[i - 1].left;
	var nright = alldivpositions[i - 1].right;
	var ntop = alldivpositions[i - 1].top;
	var nbottom = alldivpositions[i - 1].bottom;

	// position of new divs parent div
	var pleft = document.getElementById("fornewdiv").getBoundingClientRect().left;
	var pright = document.getElementById("fornewdiv").getBoundingClientRect().right;
	var ptop = document.getElementById("fornewdiv").getBoundingClientRect().top;
	// var pbottom=document.getElementById("fornewdiv").getBoundingClientRect().bottom;

	if (i == 1) {
		if (ntop <= ptop || nleft <= pleft || nright >= pright) {
			document.getElementById(divid).remove();
			i--;
			// remove position record from array
			alldivpositions.splice(i, 1);

			makeDiv();
			return false;
		}
	} else {
		for ( j = 0; j < alldivpositions.length - 1; j++) {

			// positions of div already created
			var oleft = alldivpositions[j].left;
			var oright = alldivpositions[j].right;
			var otop = alldivpositions[j].top;
			var obottom = alldivpositions[j].bottom;

			if (
			// new div with corner in old divs
			((oleft <= nleft && nleft <= oright) && ((otop <= ntop && ntop <= obottom) || (otop <= nbottom && nbottom <= obottom))) || ((oleft <= nright && nright <= oright) && ((otop <= ntop && ntop <= obottom) || (otop <= nbottom && nbottom <= obottom)))
			// old divs with corner in new div
			|| ((nleft <= oleft && oleft <= nright) && ((ntop <= otop && otop <= nbottom) || (nbottom <= otop && otop <= nbottom))) || ((nleft <= oright && oright <= nright) && ((ntop <= otop && otop <= nbottom) || (ntop <= obottom && obottom <= nbottom)))
			// newdiv corner out of parent div
			|| (ntop <= ptop || nleft <= pleft || nright >= pright)
			// new div crossing old div or old div crossing new div
			|| ((nleft >= oleft && nright <= oright) && (ntop <= otop && nbottom >= obottom)) || ((nleft <= oleft && nright >= oright) && (ntop >= otop && nbottom <= obottom))) {
				document.getElementById(divid).remove();
				i--;
				// remove position record from array
				alldivpositions.splice(i, 1);

				// stop make div after tried 100 time
				count++;
				if (count >= 100) {
					alert("No enough free space, try input again or stop");
					break;
				}
				makeDiv();
				break;
			}
		}
	}
}

