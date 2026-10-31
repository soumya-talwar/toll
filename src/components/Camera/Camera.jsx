import Webcam from "react-webcam";
import "./Camera.css";

function Camera({ cameraRef, onStreamSize }) {
	return (
		<Webcam
			ref={cameraRef}
			audio={false}
			onUserMedia={() => {
				const video = cameraRef.current.video;
				video.addEventListener("loadedmetadata", () => {
					video.width = video.videoWidth;
					video.height = video.videoHeight;
					onStreamSize(video.videoWidth, video.videoHeight);
				});
			}}
			videoConstraints={{
				facingMode: "user",
			}}
			style={{
				width: "100%",
				height: "100%",
				transform: "scaleX(-1)",
			}}
		/>
	);
}

export default Camera;
