// App.js
import React, { useEffect, useRef } from "react";
// import { mainWindow } from "../../public/utils/config";
const { BrowserWindow, ipcRenderer, desktopCapturer } =
	window.require("electron");

// import { remote, ipcRenderer, shell } from 'electron';

function App() {
	let imgCropWindow;

	const createScreenshotWindow = (requestType) => {
		takeScreenshot((imageURL) => {
			const request = {
				imageURL,
				type: requestType,
			};

			imgCropWindow = new BrowserWindow({
				frame: false,
				fullscreen: true,
				show: false,
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
					enableRemoteModule: true,
				},
			});
			imgCropWindow.loadFile("mask.html").then(() => {
				imgCropWindow.webContents.send("request-object", request);
			});

			imgCropWindow.once("ready-to-show", () => {
				imgCropWindow.show();
			});
		}, "image/png");
	};

	const takeScreenshot = async (callback, imageFormat = "image/jpeg") => {
		try {
			// const sources = await desktopCapturer.getSources({
			//   types: ['window', 'screen']
			// });

			const sources = desktopCapturer
				.getSources({ types: ["window", "screen"] })
				.then(async (sources) => {
					for (const source of sources) {
						if (source.name === "Electron") {
							// mainWindow.webContents.send(
							// 	"SET_SOURCE",
							// 	source.id,
							// );
							return;
						}
					}
				});

			const mainScreenSource = sources.find(
				(source) =>
					source.name === "Entire Screen" ||
					source.name === "Screen 1" ||
					source.name === "Screen 2" ||
					source.name.toLowerCase().includes("screen"),
			);

			if (!mainScreenSource) {
				throw new Error("Main screen source not found.");
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: "desktop",
						chromeMediaSourceId: mainScreenSource.id,
						minWidth: 1280,
						maxWidth: 4000,
						minHeight: 720,
						maxHeight: 4000,
					},
				},
			});

			const video = document.createElement("video");
			video.style.cssText =
				"position:absolute;top:-10000px;left:-10000px;";
			video.srcObject = stream;
			document.body.appendChild(video);

			video.onloadedmetadata = () => {
				video.style.height = video.videoHeight + "px";
				video.style.width = video.videoWidth + "px";
				video.play();

				const canvas = document.createElement("canvas");
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				callback(canvas.toDataURL(imageFormat));

				video.remove();
				stream.getTracks()[0].stop();
			};
		} catch (error) {
			console.error(error);
		}
	};

	const newMaskRef = useRef(null);
	const ocrMaskRef = useRef(null);

	const handleNewMaskClick = () => {
		createScreenshotWindow(1);
	};

	const handleOcrMaskClick = () => {
		createScreenshotWindow(2);
	};

	// ipcRenderer.on("key-shortcut", () => createScreenshotWindow(1));
	// ipcRenderer.on("key-shortcut-ocr", () => createScreenshotWindow(2));
	// ipcRenderer.on("close-crop", () => imgCropWindow.close());

	useEffect(() => {
		const handleKeyShortcut = () => createScreenshotWindow(1);
		const handleKeyShortcutOcr = () => createScreenshotWindow(2);
		const handleCloseCrop = () => imgCropWindow.close();

		ipcRenderer.on("key-shortcut", handleKeyShortcut);
		ipcRenderer.on("key-shortcut-ocr", handleKeyShortcutOcr);
		ipcRenderer.on("close-crop", handleCloseCrop);

		return () => {
			ipcRenderer.removeListener("key-shortcut", handleKeyShortcut);
			ipcRenderer.removeListener(
				"key-shortcut-ocr",
				handleKeyShortcutOcr,
			);
			ipcRenderer.removeListener("close-crop", handleCloseCrop);
		};
	}, []);

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-4xl font-bold mb-4">screenorc</h1>
			<div className="flex flex-col items-center">
				<button
					ref={newMaskRef}
					onClick={handleNewMaskClick}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
				>
					Snip
				</button>
				<button
					ref={ocrMaskRef}
					onClick={handleOcrMaskClick}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					OCR
				</button>
			</div>
			<div className="mt-8">
				<p>
					<b>SNIP</b> <br />
					Crop the desired area of the screen and copy it to the
					clipboard. <br /> (Shortcut to invoke - ctrl+alt+i)
				</p>
				<p className="mt-4">
					<b>OCR</b> <br />
					Extract text from the desired area of the screen and copy it
					to the clipboard. <br /> (Shortcut to invoke - ctrl+alt+o)
				</p>
				<p className="mt-4">
					Press Esc key - to close the crop window.
				</p>
				<p className="mt-4">Made with ❤️!!</p>
			</div>
		</div>
	);
}

export default App;
