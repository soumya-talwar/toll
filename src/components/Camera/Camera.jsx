import Webcam from "react-webcam";
import "./Camera.css";

function Camera({ cameraRef }) {
	return (
		<Webcam
			ref={cameraRef}
			audio={false}
			width={900}
			height={800}
			style={{
				transform: "scaleX(-1)",
			}}
			videoConstraints={{
				width: 900,
				height: 800,
				facingMode: "user",
			}}
		/>
	);
}

export default Camera;
