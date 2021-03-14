const { ipcRenderer } = require('electron');

document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value
    const senha = document.getElementById('password').value    
    await ipcRenderer.invoke('login', { login, senha });
});