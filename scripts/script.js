let balloon = document.getElementById('balloon');
let popText = document.getElementById('pop-text');
let blowCount = 0;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            let volume = dataArray.reduce((a, b) => a + b) / bufferLength;

            if (volume > 80) { 
                blowCount++;
                inflateBalloon();

                if (blowCount >= 3) {
                    explodeBalloon();
                }
            }

            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    })
    .catch(error => console.log('Error al acceder al micrófono:', error));

function inflateBalloon() {
    let newSize = 100 + (blowCount * 50);
    balloon.style.width = newSize + 'px';
    balloon.style.height = newSize + 'px';
}

function explodeBalloon() {
    balloon.style.display = 'none'; // Oculta el globo
    popText.style.display = 'block'; // Muestra el texto "POP"
}

// Agrega un evento de clic para ocultar el texto "POP" al hacer clic
popText.addEventListener('click', () => {
    popText.style.display = 'none';
    resetBalloon();
});

function resetBalloon() {
    blowCount = 0; // Reinicia el contador de soplidos
    balloon.style.width = '100px'; // Tamaño inicial
    balloon.style.height = '100px';
    balloon.style.display = 'block'; // Muestra el globo nuevamente
}
