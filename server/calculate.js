export default function calculateCounts(deliveryCount) {
	const squatsBase = 10;
	const pushupsBase = 5;
	return {
		squats: squatsBase + deliveryCount,
		pushups: pushupsBase + deliveryCount,
	};
}
