export const pad = (value: number) => {
	return String(value).length < 2 ? `0${value}` : value;
};
