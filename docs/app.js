let pwaPrompt;
const prompt = document.querySelector('#pwa-install-prompt');
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaPrompt = e;
    prompt.classList.add('show');
})

prompt.addEventListener('click', function(event) {
    if (event.target.dataset.id === 'pwa-install-y' && pwaPrompt) {
        pwaPrompt.prompt();
        pwaPrompt.userChoice.then(() => {
            prompt.classList.remove('show');
            pwaPrompt = null;
        });
    } else {
        prompt.classList.remove('show');
    }
});
