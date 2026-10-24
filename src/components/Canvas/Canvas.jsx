import { useEffect, useRef } from "react";
import "./Canvas.css";

function Canvas({ canvasRef, loaded, poses, connections }) {
	const markersRef = useRef([]);
	const targetsRef = useRef([]);
	const LERP = 0.3;
	useEffect(() => {
		if (loaded && poses.length > 0) {
			targetsRef.current = poses[0].keypoints;
			if (markersRef.current.length == 0) {
				markersRef.current = structuredClone(targetsRef.current);
				requestAnimationFrame(animate);
			}
		}
	}, [loaded, poses]);
	function animate() {
		const context = canvasRef.current.getContext("2d");
		context.reset();
		for (let i = 0; i < markersRef.current.length; i++) {
			let marker = markersRef.current[i];
			let target = targetsRef.current[i];
			marker.x = marker.x + (target.x - marker.x) * LERP;
			marker.y = marker.y + (target.y - marker.y) * LERP;
			if (target.confidence > 0.1) {
				context.beginPath();
				context.arc(marker.x, marker.y, 5, 0, 2 * Math.PI);
				context.fillStyle = "white";
				context.fill();
			}
		}
		connections.forEach((connection) => {
			let markerA = markersRef.current[connection[0]];
			let markerB = markersRef.current[connection[1]];
			if (
				targetsRef.current[connection[0]].confidence > 0.1 &&
				targetsRef.current[connection[1]].confidence > 0.1
			) {
				context.beginPath();
				context.moveTo(markerA.x, markerA.y);
				context.lineTo(markerB.x, markerB.y);
				context.strokeStyle = "white";
				context.lineWidth = 2;
				context.stroke();
			}
		});
		requestAnimationFrame(animate);
	}
	return <canvas ref={canvasRef} width={900} height={800}></canvas>;
}

export default Canvas;
