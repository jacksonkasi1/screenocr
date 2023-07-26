import React from "react";

const Demo = () => {
	return (
		<div className="mt-8">
			<p>
				<b>SNIP</b> <br />
				Crop the desired area of the screen and copy it to the
				clipboard. <br /> (Shortcut to invoke - ctrl+alt+i)
			</p>
			<p className="mt-10 bg-slate-200">
				<b>OCR</b> <br />
				Extract text from the desired area of the screen and copy it to
				the clipboard. <br /> (Shortcut to invoke - ctrl+alt+o)
			</p>
			<p className="mt-4">Press Esc key - to close the crop window.</p>
			<p className="mt-4">Made with ❤️!!</p>
		</div>
	);
};

export default Demo;
