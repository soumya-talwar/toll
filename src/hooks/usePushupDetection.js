import { useEffect, useRef } from "react";
import calculateAngle from "../utils/calculateAngle";

export default function usePushupDetection(poses, setPushupCount) {
	const pushupStateRef = useRef("straight");
	useEffect(() => {
		let confidences = {
			left_shoulder: poses[0]?.left_shoulder?.confidence,
			right_shoulder: poses[0]?.right_shoulder?.confidence,
			left_elbow: poses[0]?.left_elbow?.confidence,
			right_elbow: poses[0]?.right_elbow?.confidence,
			left_wrist: poses[0]?.left_wrist?.confidence,
			right_wrist: poses[0]?.right_wrist?.confidence,
			left_hip: poses[0]?.left_hip?.confidence,
			right_hip: poses[0]?.right_hip?.confidence,
			left_knee: poses[0]?.left_knee?.confidence,
			right_knee: poses[0]?.right_knee?.confidence,
			left_ankle: poses[0]?.left_ankle?.confidence,
			right_ankle: poses[0]?.right_ankle?.confidence,
		};
		let LEFT_ELBOW_SHOULDER = 0;
		let RIGHT_ELBOW_SHOULDER = 0;
		let LEFT_ELBOW_WRIST = 0;
		let RIGHT_ELBOW_WRIST = 0;
		let LEFT_ELBOW_ANGLE = 0;
		let RIGHT_ELBOW_ANGLE = 0;
		let LEFT_KNEE_HIP = 0;
		let RIGHT_KNEE_HIP = 0;
		let LEFT_KNEE_ANKLE = 0;
		let RIGHT_KNEE_ANKLE = 0;
		let LEFT_KNEE_ANGLE = 0;
		let RIGHT_KNEE_ANGLE = 0;
		if (Object.values(confidences).every((confidence) => confidence > 0.1)) {
			LEFT_ELBOW_SHOULDER = {
				x: poses[0].left_shoulder.x - poses[0].left_elbow.x,
				y: poses[0].left_shoulder.y - poses[0].left_elbow.y,
			};
			RIGHT_ELBOW_SHOULDER = {
				x: poses[0].right_shoulder.x - poses[0].right_elbow.x,
				y: poses[0].right_shoulder.y - poses[0].right_elbow.y,
			};
			LEFT_ELBOW_WRIST = {
				x: poses[0].left_wrist.x - poses[0].left_elbow.x,
				y: poses[0].left_wrist.y - poses[0].left_elbow.y,
			};
			RIGHT_ELBOW_WRIST = {
				x: poses[0].right_wrist.x - poses[0].right_elbow.x,
				y: poses[0].right_wrist.y - poses[0].right_elbow.y,
			};
			LEFT_KNEE_HIP = {
				x: poses[0].left_hip.x - poses[0].left_knee.x,
				y: poses[0].left_hip.y - poses[0].left_knee.y,
			};
			RIGHT_KNEE_HIP = {
				x: poses[0].right_hip.x - poses[0].right_knee.x,
				y: poses[0].right_hip.y - poses[0].right_knee.y,
			};
			LEFT_KNEE_ANKLE = {
				x: poses[0].left_ankle.x - poses[0].left_knee.x,
				y: poses[0].left_ankle.y - poses[0].left_knee.y,
			};
			RIGHT_KNEE_ANKLE = {
				x: poses[0].right_ankle.x - poses[0].right_knee.x,
				y: poses[0].right_ankle.y - poses[0].right_knee.y,
			};
		}
		if (LEFT_ELBOW_SHOULDER && LEFT_ELBOW_WRIST)
			LEFT_ELBOW_ANGLE = calculateAngle(LEFT_ELBOW_SHOULDER, LEFT_ELBOW_WRIST);
		if (RIGHT_ELBOW_SHOULDER && RIGHT_ELBOW_WRIST)
			RIGHT_ELBOW_ANGLE = calculateAngle(
				RIGHT_ELBOW_SHOULDER,
				RIGHT_ELBOW_WRIST,
			);
		if (LEFT_KNEE_HIP && LEFT_KNEE_ANKLE)
			LEFT_KNEE_ANGLE = calculateAngle(LEFT_KNEE_HIP, LEFT_KNEE_ANKLE);
		if (RIGHT_KNEE_HIP && RIGHT_KNEE_ANKLE)
			RIGHT_KNEE_ANGLE = calculateAngle(RIGHT_KNEE_HIP, RIGHT_KNEE_ANKLE);
		if (
			LEFT_ELBOW_ANGLE &&
			RIGHT_ELBOW_ANGLE &&
			LEFT_KNEE_ANGLE &&
			RIGHT_KNEE_ANGLE
		) {
			if (
				LEFT_ELBOW_ANGLE < 120 &&
				RIGHT_ELBOW_ANGLE < 120 &&
				LEFT_KNEE_ANGLE < 160 &&
				RIGHT_KNEE_ANGLE < 160 &&
				pushupStateRef.current == "straight"
			) {
				pushupStateRef.current = "bent";
			} else if (
				LEFT_ELBOW_ANGLE > 150 &&
				RIGHT_ELBOW_ANGLE > 150 &&
				LEFT_KNEE_ANGLE < 160 &&
				RIGHT_KNEE_ANGLE < 160 &&
				pushupStateRef.current == "bent"
			) {
				pushupStateRef.current = "straight";
				setPushupCount((prev) => prev - 1);
			}
		}
	}, [poses]);
}
