import * as ml5 from "ml5";
import { useState, useEffect, useRef } from "react";
import Camera from "./components/Camera/Camera";
import Canvas from "./components/Canvas/Canvas";
import useSquatDetection from "./hooks/useSquatDetection";
import usePushupDetection from "./hooks/usePushupDetection";
import calculateDimensions from "./utils/calculateDimensions";
import Johnny from "./assets/images/Johnny.png";

function App() {
	const QUOTA = 10000;
	const SQUAT = 200;
	const PUSHUP = 200;
	const query = new URLSearchParams(window.location.search);
	const STEPS = Number(query.get("steps"));
	const cameraRef = useRef(null);
	const modelRef = useRef(null);
	const canvasRef = useRef(null);
	const [loaded, setLoaded] = useState(false);
	const [poses, setPoses] = useState([]);
	const [connections, setConnections] = useState([]);
	const [viewportSize, setViewportSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [streamSize, setStreamSize] = useState(null);
	const displaySize = streamSize
		? calculateDimensions(
				streamSize.width,
				streamSize.height,
				viewportSize.width,
				viewportSize.height,
			)
		: null;
	// const [remaining, setRemaining] = useState({
	// 	steps: QUOTA - STEPS,
	// 	squats: Math.round((QUOTA - STEPS) / SQUAT),
	// });
	const [remaining, setRemaining] = useState({
		steps: QUOTA - STEPS,
		pushups: Math.round((QUOTA - STEPS) / PUSHUP),
	});
	const [start, setStart] = useState(false);
	// const squats = useSquatDetection(poses, SQUAT, setRemaining);
	const pushups = usePushupDetection(poses, PUSHUP, setRemaining);
	useEffect(() => {
		function handleResize() {
			setViewportSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
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
								START PUSHUPS
							</button>
						</div>
					)}
					{start && (
						<div className="card">
							<p id="description2">remaining pushups</p>
							<h1 id="remaining">{remaining.pushups}</h1>
						</div>
					)}
				</div>
				{start && (
					<div id="webcam-container">
						<div
							id="webcam"
							style={{
								width: displaySize ? displaySize.width : "100%",
								height: displaySize ? displaySize.height : "100%",
								visibility: displaySize ? "visible" : "hidden",
							}}>
							<Camera
								cameraRef={cameraRef}
								onStreamSize={(width, height) =>
									setStreamSize({ width, height })
								}
							/>
							{streamSize && (
								<Canvas
									canvasRef={canvasRef}
									loaded={loaded}
									streamSize={streamSize}
									poses={poses}
									connections={connections}
								/>
							)}
						</div>
					</div>
				)}
				{/* <h1 className="stats">REMAINING STEPS: {remaining.steps}</h1>
				<h1 className="stats">REMAINING SQUATS: {remaining.squats}</h1> */}
			</div>
		</>
	);
}

export default App;
