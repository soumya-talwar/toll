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
		};
		let LEFT_ELBOW_SHOULDER = 0;
		let RIGHT_ELBOW_SHOULDER = 0;
		let LEFT_ELBOW_WRIST = 0;
		let RIGHT_ELBOW_WRIST = 0;
		let LEFT_ELBOW_ANGLE = 0;
		let RIGHT_ELBOW_ANGLE = 0;
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
		}
		if (LEFT_ELBOW_SHOULDER && LEFT_ELBOW_WRIST)
			LEFT_ELBOW_ANGLE = calculateAngle(LEFT_ELBOW_SHOULDER, LEFT_ELBOW_WRIST);
		if (RIGHT_ELBOW_SHOULDER && RIGHT_ELBOW_WRIST)
			RIGHT_ELBOW_ANGLE = calculateAngle(
				RIGHT_ELBOW_SHOULDER,
				RIGHT_ELBOW_WRIST,
			);
		if (LEFT_ELBOW_ANGLE && RIGHT_ELBOW_ANGLE) {
			if (
				LEFT_ELBOW_ANGLE < 120 &&
				RIGHT_ELBOW_ANGLE < 120 &&
				pushupStateRef.current == "straight"
			) {
				pushupStateRef.current = "bent";
			} else if (
				LEFT_ELBOW_ANGLE > 150 &&
				RIGHT_ELBOW_ANGLE > 150 &&
				pushupStateRef.current == "bent"
			) {
				pushupStateRef.current = "straight";
				setPushupCount((prev) => (prev ? prev - 1 : 0));
			}
		}
	}, [poses]);
}
