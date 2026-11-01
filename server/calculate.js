export default function calculateCounts(deliveryCount, stepCount) {
	const squatsBase = 10;
	const pushupsBase = 5;
	const stepThreshold = 5000;
	const stepRemainderDivider = 1000;
	const stepSubtraction =
		stepCount > stepThreshold
			? (stepCount - stepThreshold) / stepRemainderDivider
			: 0;
	return {
		squats: squatsBase + deliveryCount - stepSubtraction,
		pushups: pushupsBase + deliveryCount - stepSubtraction,
	};
}
