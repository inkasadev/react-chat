import cs from "classnames";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";

interface IAudioPlayerProps {
	roomId: string;
	audioUrl: string;
	isUser: boolean;
	audioId: string;
	id: string;
	setAudioId: React.Dispatch<React.SetStateAction<string>>;
	className?: string;
}

export const AudioPlayer = ({
	audioUrl,
	audioId,
	id,
	setAudioId,
	className,
}: IAudioPlayerProps) => {
	const [isPlaying, setPlaying] = useState(false);
	const [isMediaLoaded, setMediaLoaded] = useState(false);
	const [isLoaded, setLoaded] = useState(false);
	const [isMetadataLoaded, setMetadataLoaded] = useState(false);
	const [sliderValue, setSliderValue] = useState(0);
	const [duration, setDuration] = useState("");

	const totalDurationRef = useRef("");
	const audioRef = useRef(new Audio(audioUrl));
	const intervalRef = useRef<NodeJS.Timeout>();
	const isUploadingRef = useRef(audioUrl === "uploading");

	const getAudioDuration = (media: HTMLAudioElement) => {
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

	const formatTime = (time: number) => {
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

	const playAudio = () => {
		setPlaying(true);
		audioRef.current.play();

		if (audioId !== id) {
			setAudioId(id);
		}

		intervalRef.current = setInterval(updateSlider, 100);
	};

	const stopAudio = () => {
		audioRef.current.pause();

		clearInterval(intervalRef.current);

		setPlaying(false);
		setDuration(totalDurationRef.current);
	};

	const updateSlider = () => {
		let sliderPosition = 0;

		const { currentTime, duration } = audioRef.current;
		if (typeof duration === "number") {
			sliderPosition = currentTime * (100 / duration);
			setSliderValue(sliderPosition);
			const time = formatTime(currentTime);
			setDuration(time);
		}
	};

	const moveAudio = (e: any) => {
		if (!isMediaLoaded) return;

		const value = e.target.value;
		const { duration } = audioRef.current;

		const seekTo = duration * (value / 100);
		audioRef.current.currentTime = seekTo;
		setSliderValue(value);
	};

	useEffect(() => {
		if (isUploadingRef.current && audioUrl !== "uploading") {
			audioRef.current = new Audio(audioUrl);
			audioRef.current.load();
			setLoaded(true);
			return;
		}

		if (!isUploadingRef.current) {
			setLoaded(true);
		}
	}, [audioUrl]);

	useEffect(() => {
		if (!isLoaded) return;

		getAudioDuration(audioRef.current).then(() => {
			setMetadataLoaded(true);
		});
	}, [isLoaded]);

	useEffect(() => {
		if (!isMetadataLoaded) return;

		audioRef.current.addEventListener("canplaythrough", () => {
			if (!totalDurationRef.current) {
				setMediaLoaded(true);

				const time = formatTime(audioRef.current.duration);
				totalDurationRef.current = time;
				setDuration(totalDurationRef.current);
			}
		});

		audioRef.current.addEventListener("ended", () => {
			clearInterval(intervalRef.current);
			setDuration(totalDurationRef.current);
			setSliderValue(0);
			setPlaying(false);
		});
	}, [isMetadataLoaded]);

	useEffect(() => {
		if (audioId === id) return;

		audioRef.current.pause();
		clearInterval(intervalRef.current);
		setPlaying(false);
	}, [audioId, id]);

	return (
		<div className={cs(styles.audioPlayer, className)}>
			{!isMediaLoaded ? (
				<CircularProgress className={styles.icon} />
			) : isPlaying ? (
				<PauseRounded
					className={cs(styles.icon, styles.pause)}
					onClick={stopAudio}
				/>
			) : !isPlaying ? (
				<PlayArrowRounded className={styles.icon} onClick={playAudio} />
			) : null}

			<div className={styles.sliderContainer}>
				<span
					style={{ width: `${sliderValue}%` }}
					className={styles.sliderPlayed}
				/>
				<input
					type="range"
					min="1"
					max="100"
					value={sliderValue}
					onChange={moveAudio}
					className={styles.slider}
				/>
			</div>
			<span className={cs(styles.timestamp, styles.time)}>{duration}</span>
		</div>
	);
};
