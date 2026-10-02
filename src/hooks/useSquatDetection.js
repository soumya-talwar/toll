import calculateAngle from "../utils/calculateAngle";

export default function useSquatDetection(poses, squatStateRef, setSquats) {
	let LEFT_ANGLE = 0;
	let RIGHT_ANGLE = 0;
	const LEFT_KNEE_HIP = {
		x: poses[0]?.left_hip?.x - poses[0]?.left_knee?.x,
		y: poses[0]?.left_hip?.y - poses[0]?.left_knee?.y,
	};
	const RIGHT_KNEE_HIP = {
		x: poses[0]?.right_hip?.x - poses[0]?.right_knee?.x,
		y: poses[0]?.right_hip?.y - poses[0]?.right_knee?.y,
	};
	const LEFT_KNEE_ANKLE = {
		x: poses[0]?.left_ankle?.x - poses[0]?.left_knee?.x,
		y: poses[0]?.left_ankle?.y - poses[0]?.left_knee?.y,
	};
	const RIGHT_KNEE_ANKLE = {
		x: poses[0]?.right_ankle?.x - poses[0]?.right_knee?.x,
		y: poses[0]?.right_ankle?.y - poses[0]?.right_knee?.y,
	};
	if (LEFT_KNEE_HIP && LEFT_KNEE_ANKLE)
		LEFT_ANGLE = calculateAngle(LEFT_KNEE_HIP, LEFT_KNEE_ANKLE);
	if (RIGHT_KNEE_HIP && RIGHT_KNEE_ANKLE)
		RIGHT_ANGLE = calculateAngle(RIGHT_KNEE_HIP, RIGHT_KNEE_ANKLE);
	if (LEFT_ANGLE && RIGHT_ANGLE) {
		if (
			LEFT_ANGLE < 100 &&
			RIGHT_ANGLE < 100 &&
			squatStateRef.current == "standing"
		) {
			squatStateRef.current = "squatting";
		} else if (
			LEFT_ANGLE > 100 &&
			RIGHT_ANGLE > 100 &&
			squatStateRef.current == "squatting"
		) {
			squatStateRef.current = "standing";
			setSquats((prev) => prev + 1);
		}
	}
}
