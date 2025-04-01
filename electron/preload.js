const { contextBridge, ipcRenderer } = require('electron')

// Exemplo: Expondo uma API para registrar mensagens no console do main process
contextBridge.exposeInMainWorld('electronAPI', {
  // Você pode adicionar funções que utilizem o ipcRenderer para se comunicar com o main
  log: (message) => ipcRenderer.send('log-message', message)
})
