/**
 * Loading spinner: after the visitor presses play, the play button shows a spinner until the
 * audio really starts (a large file, a slow server or a Google Drive link can take a few seconds).
 *
 * One set of listeners covers every player on the page (blocks, shortcodes, Elementor, playlists,
 * sticky player): media events do not bubble, but they still pass the document in the capture phase.
 * Printed next to the Plyr script, so it is only on pages with a player.
 */
(function () {
	if (window.h5apLoadingSpinner || !document.addEventListener || !Element.prototype.closest) {
		return;
	}
	window.h5apLoadingSpinner = true;

	var DELAY = 300; // A file that starts within this time never shows the spinner.
	var HAVE_FUTURE_DATA = 3;
	var NETWORK_NO_SOURCE = 3;

	function isPlayerAudio(media) {
		return media && media.tagName === 'AUDIO' && media.closest('.plyr') && media.closest('[class*="h5ap"]');
	}

	function playButtons(box) {
		var found = box.querySelectorAll('[data-plyr="play"]');
		var buttons = [];
		for (var i = 0; i < found.length; i++) {
			// The radio player has its own loading icon.
			if (!found[i].querySelector('.icon--loading')) {
				buttons.push(found[i]);
			}
		}
		return buttons;
	}

	// Size and color of the icon the button shows now, so the spinner takes its place exactly.
	function iconLook(button) {
		var icons = button.querySelectorAll('svg');
		for (var i = 0; i < icons.length; i++) {
			var size = icons[i].getBoundingClientRect();
			if (size.width > 0 && size.height > 0) {
				var style = window.getComputedStyle(icons[i]);
				var color = style.color;
				if (style.fill && style.fill !== 'none' && style.fill.indexOf('url') !== 0) {
					color = style.fill;
				} else if (style.stroke && style.stroke !== 'none' && style.stroke.indexOf('url') !== 0) {
					color = style.stroke;
				}
				return { size: Math.round(Math.min(size.width, size.height)), color: color };
			}
		}
		return { size: 18, color: '' };
	}

	function show(media, box) {
		var buttons = playButtons(box);
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			if (button.querySelector('.h5ap-spinner')) {
				continue;
			}
			var look = iconLook(button);
			var spinner = document.createElement('span');
			spinner.className = 'h5ap-spinner';
			spinner.setAttribute('aria-hidden', 'true');
			spinner.style.width = look.size + 'px';
			spinner.style.height = look.size + 'px';
			spinner.style.borderWidth = Math.max(2, Math.round(look.size / 9)) + 'px';
			if (look.color) {
				spinner.style.borderTopColor = look.color;
				spinner.style.borderBottomColor = look.color;
				spinner.style.borderLeftColor = look.color;
			}
			button.classList.add('h5ap-loading');
			button.setAttribute('aria-busy', 'true');
			button.appendChild(spinner);
		}
		media.h5apSpinnerBox = box;
		box.h5apSpinnerMedia = media;
	}

	function clear(box) {
		var spinners = box.querySelectorAll('.h5ap-spinner');
		for (var i = 0; i < spinners.length; i++) {
			spinners[i].parentNode.removeChild(spinners[i]);
		}
		var buttons = box.querySelectorAll('.h5ap-loading');
		for (var j = 0; j < buttons.length; j++) {
			buttons[j].classList.remove('h5ap-loading');
			buttons[j].removeAttribute('aria-busy');
		}
		box.h5apSpinnerMedia = null;
	}

	function stop(media) {
		clearTimeout(media.h5apSpinnerTimer);
		var box = media.closest('.plyr') || media.h5apSpinnerBox;
		if (box) {
			clear(box);
		}
		media.h5apSpinnerBox = null;
	}

	function onLoading(event) {
		var media = event.target;
		if (!isPlayerAudio(media)) {
			return;
		}
		var box = media.closest('.plyr');
		// A playlist swaps in a new audio element for the next track; drop what the old one left.
		if (box.h5apSpinnerMedia && box.h5apSpinnerMedia !== media) {
			clear(box);
		}
		clearTimeout(media.h5apSpinnerTimer);
		media.h5apSpinnerTimer = setTimeout(function () {
			// Nothing is loading when the player has no file yet, so no spinner then.
			var loading = media.currentSrc && media.networkState !== NETWORK_NO_SOURCE;
			if (loading && !media.paused && media.readyState < HAVE_FUTURE_DATA && media.closest('.plyr') === box) {
				show(media, box);
			}
		}, DELAY);
	}

	function onDone(event) {
		if (isPlayerAudio(event.target)) {
			stop(event.target);
		}
	}

	// A new audio element in the same player (next playlist track) that does not start playing.
	function onNewSource(event) {
		var media = event.target;
		if (!isPlayerAudio(media)) {
			return;
		}
		var box = media.closest('.plyr');
		if (box.h5apSpinnerMedia && box.h5apSpinnerMedia !== media) {
			clear(box);
		}
	}

	function onProgress(event) {
		var media = event.target;
		if (media.h5apSpinnerBox && media.readyState >= HAVE_FUTURE_DATA) {
			stop(media);
		}
	}

	document.addEventListener('play', onLoading, true);
	document.addEventListener('waiting', onLoading, true);
	document.addEventListener('loadstart', onNewSource, true);
	['playing', 'pause', 'ended', 'error', 'abort', 'emptied'].forEach(function (type) {
		document.addEventListener(type, onDone, true);
	});
	document.addEventListener('timeupdate', onProgress, true);
})();
