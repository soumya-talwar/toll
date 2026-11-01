import * as ml5 from "ml5";
import { useState, useEffect, useRef } from "react";
import Camera from "./components/Camera/Camera";
import Canvas from "./components/Canvas/Canvas";
import useSquatDetection from "./hooks/useSquatDetection";
import usePushupDetection from "./hooks/usePushupDetection";
import calculateDimensions from "./utils/calculateDimensions";
import Johnny from "./assets/images/johnny.png";

function App() {
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
	const [squatCount, setSquatCount] = useState(null);
	const [pushupCount, setPushUpCount] = useState(null);
	const query = new URLSearchParams(window.location.search);
	const steps = Number(query.get("steps"));
	const [start, setStart] = useState(false);
	usePushupDetection(poses, setPushUpCount);
	useSquatDetection(poses, setSquatCount);
	useEffect(() => {
		async function getCounts() {
			const response = await fetch(`/api/counts/?steps=${steps}`);
			const data = await response.json();
			setSquatCount(data.squats);
			setPushUpCount(data.pushups);
		}
		getCounts();
	}, []);
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
	useEffect(() => {
		if (squatCount == 0 && pushupCount == 0) fetch("/api/unlock");
	}, [squatCount, pushupCount]);
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
							<div className="stats">
								<div className="stat">
									<h1>{squatCount}</h1>
									<p>SQUATS</p>
								</div>
								<div className="stat">
									<h1>{pushupCount}</h1>
									<p>PUSHUPS</p>
								</div>
							</div>
							<button id="start" onClick={() => setStart(true)}>
								GET GOING
							</button>
						</div>
					)}
					{start && (
						<div className="card" id="card2">
							<div className="stats">
								<div className="stat">
									<h1>{squatCount}</h1>
									<p>remaining squats</p>
								</div>
								<div className="stat">
									<h1>{pushupCount}</h1>
									<p>remaining pushups</p>
								</div>
							</div>
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
			</div>
		</>
	);
}

export default App;
