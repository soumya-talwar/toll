import { useEffect, useRef } from "react";
import "./Canvas.css";

function Canvas({ canvasRef, poses }) {
	useEffect(() => {
		const context = canvasRef.current.getContext("2d");
		context.reset();
		poses[0]?.keypoints.forEach((marker) => {
			if (marker.confidence > 0.1) {
				context.beginPath();
				context.arc(marker.x, marker.y, 5, 0, 2 * Math.PI);
				context.fillStyle = "white";
				context.fill();
			}
		});
	}, [poses]);
	return <canvas ref={canvasRef} width={800} height={800}></canvas>;
}

export default Canvas;
