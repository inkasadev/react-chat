export const getAudioDuration = (media: HTMLAudioElement) => {
	return new Promise((resolve) => {
		media.onloadedmetadata = () => {
			media.currentTime = Number.MAX_SAFE_INTEGER;

			media.ontimeupdate = () => {
				media.ontimeupdate = () => {};
				media.currentTime = 0.1;
				resolve(media.duration);
			};
		};
	});
};
