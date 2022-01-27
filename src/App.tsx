import React, { useEffect, useRef } from "react";
import "./App.css";

import "./selfie.scss";

import SelfieSetup from './selfie';

function App() {
	/**
	 * @fileoverview Demonstrates a minimal use case for MediaPipe face tracking.
	 */

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
		if (videoRef.current && canvasRef.current)
			SelfieSetup(videoRef, canvasRef);
	}, []);

	return (
		<div className="App">
			<div className="container">
				<video
					ref={videoRef}
					autoPlay
					// style={{ float: "left", width: "40%" }}
					hidden
					width="720px"
					height="480px"
				></video>
				<canvas
					ref={canvasRef}
					// width="720px"
					// height="480px"
				></canvas>
			</div>
			<div ref={controlsRef} className="control-panel"></div>
		</div>
	);
}

export default App;
