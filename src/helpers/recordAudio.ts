import { v4 as uuid } from "uuid";

const recordAudio = () => {
	return new Promise(async (resolve) => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(stream);
		let audioChunks: any = [];

		mediaRecorder.addEventListener("dataavailable", (event: any) => {
			audioChunks.push(event.data);
		});

		const start = () => {
			audioChunks = [];
			mediaRecorder.start();
		};

		const stop = () =>
			new Promise((resolve) => {
				mediaRecorder.addEventListener("stop", () => {
					const audioName = uuid();
					// const audioBlob = new Blob(audioChunks);
					const audioFile = new File(audioChunks, audioName, {
						type: "audio/mpeg",
					});
					const audioUrl = URL.createObjectURL(audioFile);
					const audio = new Audio(audioUrl);
					const play = () => audio.play();
					resolve({ audioFile, audioUrl, play, audioName });
				});

				mediaRecorder.stop();
			});

		resolve({ start, stop });
	});
};

export default recordAudio;
