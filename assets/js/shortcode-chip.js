/* Copies the shortcode when a .h5ap-sc chip (or its button) is clicked. */
(function () {
	'use strict';

	function copyText(text) {
		if (navigator.clipboard && window.isSecureContext) {
			return navigator.clipboard.writeText(text);
		}
		// Older browsers and plain-http admin screens.
		return new Promise(function (resolve, reject) {
			var area = document.createElement('textarea');
			area.value = text;
			area.setAttribute('readonly', '');
			area.style.position = 'absolute';
			area.style.left = '-9999px';
			document.body.appendChild(area);
			area.select();
			try {
				document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
			} catch (error) {
				reject(error);
			} finally {
				area.parentNode.removeChild(area);
			}
		});
	}

	document.addEventListener('click', function (event) {
		var chip = event.target.closest ? event.target.closest('.h5ap-sc') : null;
		if (!chip) {
			return;
		}
		event.preventDefault();
		var code = chip.getAttribute('data-code') || '';
		var status = chip.querySelector('.h5ap-sc__status');

		copyText(code).then(function () {
			chip.classList.add('is-copied');
			if (status) {
				status.textContent = status.getAttribute('data-copied') || '';
			}
			clearTimeout(chip.h5apTimer);
			chip.h5apTimer = setTimeout(function () {
				chip.classList.remove('is-copied');
				if (status) {
					status.textContent = '';
				}
			}, 1600);
		}).catch(function () {
			// Copy blocked: select the text so it can be copied by hand.
			var codeEl = chip.querySelector('.h5ap-sc__code');
			if (codeEl && window.getSelection) {
				var range = document.createRange();
				range.selectNodeContents(codeEl);
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
			}
		});
	});
})();
