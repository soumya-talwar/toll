import * as ml5 from "ml5";
import { useState, useEffect, useRef } from "react";
import Camera from "./components/Camera/Camera";
import Canvas from "./components/Canvas/Canvas";

function App() {
	const cameraRef = useRef(null);
	const modelRef = useRef(null);
	const canvasRef = useRef(null);
	const [loaded, setLoaded] = useState(false);
	const [poses, setPoses] = useState([]);
	useEffect(() => {
		async function loadModel() {
			modelRef.current = await ml5.bodyPose({ flipped: true }, () => {
				setLoaded(true);
				console.log("loaded!");
			});
		}
		loadModel();
		const startDetection = setInterval(() => {
			if (modelRef.current && cameraRef?.current?.video?.readyState === 4) {
				modelRef.current.detect(cameraRef.current.video, (results) => {
					setPoses(results);
				});
			}
		}, 100);
		return () => {
			if (startDetection) clearInterval(startDetection);
		};
	}, []);
	return (
		<>
			<Camera cameraRef={cameraRef} />
			<Canvas canvasRef={canvasRef} loaded={loaded} poses={poses} />
			<button onClick={() => console.log(poses)}>See results</button>
		</>
	);
}

export default App;
