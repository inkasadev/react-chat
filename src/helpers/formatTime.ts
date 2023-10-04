export const formatTime = (time: number) => {
	let minutes = Math.floor(time / 60).toString();
	let seconds = Math.floor(time - parseInt(minutes) * 60).toString();

	if (parseInt(minutes) < 10) {
		minutes = `0${minutes}`;
	}

	if (parseInt(seconds) < 10) {
		seconds = `0${seconds}`;
	}

	return `${minutes}:${seconds}`;
};
