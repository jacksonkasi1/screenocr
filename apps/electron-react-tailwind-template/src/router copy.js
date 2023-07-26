import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";

// import IndexPage from "./pages/index";
import TestPage from "./pages/popup";
import DemoPage from "./pages/demo";

import OrcPage from "./pages/ocr";

export const Router = () => {
	return (
		<HashRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<TestPage />} />
					<Route path="/demo" element={<DemoPage />} />
					<Route path="/ocr" element={<OrcPage />} />
				</Routes>
			</Layout>
		</HashRouter>
	);
};
