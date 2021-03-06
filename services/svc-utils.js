app.service('utils', function () {
	this.getDaysDifference = (date) => {
		const today = Date.now();
		const newDate = new Date(date);
		const diffTime = Math.abs(newDate - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	};

	this.debounce = function (func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			}, wait);
			if (callNow) func.apply(context, args);
		};
	}
});
