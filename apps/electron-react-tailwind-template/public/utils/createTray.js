const { app, Tray, Menu, shell } = require("electron");
const { showNotification } = require("./showNotification");
const config = require("./config");

exports.createTray = () => {
	const t = new Tray(config.icon);

	t.setToolTip(config.appName);
	t.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Show App",
				click: () => {
					if (!config.mainWindow.isVisible())
						config.mainWindow.show();
				},
			},
			{
				label: "Creator",
				submenu: [
					{
						label: "GitHub @jacksonkasi",
						click: () => {
							shell.openExternal("https://github.com/jacksonkasi1");
						},
					},
					{
						label: "E-Mail jacksonkasipeacock@gmail.com",
						click: () => {
							shell.openExternal("mailto:jacksonkasipeacock@gmail.com");
						},
					},
					{
						label: "Website",
						click: () => {
							shell.openExternal("https://github.com/jacksonkasi1");
						},
					},
				],
			},
			{
				label: "Send Notification",
				click: () =>
					showNotification(
						"This Notification Comes From Tray",
						"Hello, world!",
					),
			},
			{
				label: "Quit",
				click: () => {
					config.isQuiting = true;

					app.quit();
				},
			},
		]),
	);

	return t;
};
