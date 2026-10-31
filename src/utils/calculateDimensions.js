export default function calculateDimensions(
	streamWidth,
	streamHeight,
	availWidth,
	availHeight,
) {
	const scale = Math.min(availWidth / streamWidth, availHeight / streamHeight);
	return {
		width: Math.floor(streamWidth * scale),
		height: Math.floor(streamHeight * scale),
	};
}
