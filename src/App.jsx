import * as ml5 from "ml5";
import { useState, useEffect, useRef } from "react";
import Camera from "./components/Camera/Camera";

function App() {
	const modelRef = useRef(null);
	const cameraRef = useRef(null);
	const [poses, setPoses] = useState([]);
	useEffect(() => {
		async function loadModel() {
			modelRef.current = await ml5.bodyPose({ flipped: true });
		}
		loadModel();
		const startDetection = setInterval(() => {
			if (modelRef.current && cameraRef?.current?.video?.readyState === 4) {
				modelRef.current.detect(cameraRef.current.video, (results) => {
					setPoses(results);
				});
			}
		}, 100);
		return () => startDetection && clearInterval(startDetection);
	}, []);
	return (
		<>
			<Camera cameraRef={cameraRef} />
			<button onClick={() => console.log(poses)}>See results</button>
		</>
	);
}

export default App;
