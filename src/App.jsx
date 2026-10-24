import * as ml5 from "ml5";
import { useState, useEffect, useRef } from "react";
import Camera from "./components/Camera/Camera";
import Canvas from "./components/Canvas/Canvas";
import useSquatDetection from "./hooks/useSquatDetection";
import Johnny from "./assets/images/Johnny.png";

function App() {
	const QUOTA = 10000;
	const SQUAT = 200;
	const query = new URLSearchParams(window.location.search);
	const STEPS = Number(query.get("steps"));
	const cameraRef = useRef(null);
	const modelRef = useRef(null);
	const canvasRef = useRef(null);
	const [loaded, setLoaded] = useState(false);
	const [poses, setPoses] = useState([]);
	const [connections, setConnections] = useState([]);
	const [remaining, setRemaining] = useState({
		steps: QUOTA - STEPS,
		squats: Math.round((QUOTA - STEPS) / SQUAT),
	});
	const [start, setStart] = useState(false);
	const squats = useSquatDetection(poses, SQUAT, setRemaining);
	useEffect(() => {
		async function loadModel() {
			modelRef.current = await ml5.bodyPose({ flipped: true }, () => {
				console.log("loaded!");
				setLoaded(true);
			});
			setConnections(modelRef.current.getSkeleton());
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
			<div id="background">
				{!start && (
					<div id="johnny">
						<img src={Johnny} />
					</div>
				)}
				<div id="container">
					{!start && (
						<div className="card">
							<div id="stats">
								<h1 id="steps">{STEPS}</h1>
								<p id="total">/ 10000</p>
							</div>
							<p id="description">steps walked today</p>
							<button id="start" onClick={() => setStart(true)}>
								START SQUATTING
							</button>
						</div>
					)}
					{start && (
						<div class="card">
							<p id="description2">remaining squats</p>
							<h1 id="remaining">{remaining.squats}</h1>
						</div>
					)}
				</div>
				{start && (
					<div id="camera-container">
						<Camera cameraRef={cameraRef} />
					</div>
				)}
				{start && (
					<div id="canvas-container">
						<Canvas
							canvasRef={canvasRef}
							loaded={loaded}
							poses={poses}
							connections={connections}
						/>
					</div>
				)}
				{/* <h1 className="stats">REMAINING STEPS: {remaining.steps}</h1>
				<h1 className="stats">REMAINING SQUATS: {remaining.squats}</h1> */}
			</div>
		</>
	);
}

export default App;
