const { contextBridge, desktopCapturer } = require('electron');

contextBridge.exposeInMainWorld('electronAPIs', {
  getDesktopCapturerSources: async (options) => {
    return await desktopCapturer.getSources(options);
  },
});