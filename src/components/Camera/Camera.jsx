import Webcam from "react-webcam";
import "./Camera.css";

function Camera({ cameraRef }) {
	return (
		<Webcam
			ref={cameraRef}
			audio={false}
			width={300}
			height={500}
			style={{
				transform: "scaleX(-1)",
			}}
			videoConstraints={{
				width: 300,
				height: 500,
				facingMode: "user",
			}}
		/>
	);
}

export default Camera;
