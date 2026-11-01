export default function calculateCounts(
	deliveryCount,
	stepCount,
	gymAttendance,
) {
	const squatsBase = 10;
	const pushupsBase = 5;
	const stepThreshold = 5000;
	const stepRemainderDivider = 1000;
	const stepSubtraction =
		stepCount > stepThreshold
			? (stepCount - stepThreshold) / stepRemainderDivider
			: 0;
	const gymSubtraction = gymAttendance ? 5 : 0;
	console.log("Variables: ", {
		stepSubtraction,
		deliveryCount,
		gymSubtraction,
	});
	return {
		squats: Math.max(
			0,
			squatsBase + deliveryCount - stepSubtraction - gymSubtraction,
		),
		pushups: Math.max(
			0,
			pushupsBase + deliveryCount - stepSubtraction - gymSubtraction,
		),
	};
}
