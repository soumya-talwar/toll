import { useState, useEffect, useRef } from "react";
import calculateAngle from "../utils/calculateAngle";

export default function useSquatDetection(poses, setSquatCount) {
	const squatStateRef = useRef("standing");
	useEffect(() => {
		let confidences = {
			left_hip: poses[0]?.left_hip?.confidence,
			right_hip: poses[0]?.right_hip?.confidence,
			left_knee: poses[0]?.left_knee?.confidence,
			right_knee: poses[0]?.right_knee?.confidence,
			left_ankle: poses[0]?.left_ankle?.confidence,
			right_ankle: poses[0]?.right_ankle?.confidence,
		};
		let LEFT_KNEE_HIP = 0;
		let RIGHT_KNEE_HIP = 0;
		let LEFT_KNEE_ANKLE = 0;
		let RIGHT_KNEE_ANKLE = 0;
		let LEFT_ANGLE = 0;
		let RIGHT_ANGLE = 0;
		if (Object.values(confidences).every((confidence) => confidence > 0.1)) {
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
		if (LEFT_KNEE_HIP && LEFT_KNEE_ANKLE)
			LEFT_ANGLE = calculateAngle(LEFT_KNEE_HIP, LEFT_KNEE_ANKLE);
		if (RIGHT_KNEE_HIP && RIGHT_KNEE_ANKLE)
			RIGHT_ANGLE = calculateAngle(RIGHT_KNEE_HIP, RIGHT_KNEE_ANKLE);
		if (LEFT_ANGLE && RIGHT_ANGLE) {
			if (
				LEFT_ANGLE < 90 &&
				RIGHT_ANGLE < 90 &&
				squatStateRef.current == "standing"
			) {
				squatStateRef.current = "squatting";
			} else if (
				LEFT_ANGLE > 120 &&
				RIGHT_ANGLE > 120 &&
				squatStateRef.current == "squatting"
			) {
				squatStateRef.current = "standing";
				setSquatCount((prev) => prev - 1);
			}
		}
	}, [poses]);
}
