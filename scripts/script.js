let balloon = document.getElementById('balloon');
let popScreen = document.getElementById('pop-screen');
let popText = document.getElementById('pop-text');
let pressure = 0; // La presión se acumulará con cada soplido
let maxPressure = 2000; // Presión máxima antes de explotar

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

            if (volume > 80) { // Ajusta este valor según el ruido ambiente
                pressure += 10; // Incrementa la presión con cada soplido
                inflateBalloon();

                if (pressure >= maxPressure) { // Explota cuando alcanza la presión máxima
                    explodeBalloon();
                }
            }

            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    })
    .catch(error => console.log('Error al acceder al micrófono:', error));

function inflateBalloon() {
    // Calcula el tamaño del globo según la presión acumulada
    let newSize = 100 + (pressure * 2); // Tamaño base + incremento en función de la presión
    balloon.style.width = newSize + 'px';
    balloon.style.height = newSize + 'px';
}

function explodeBalloon() {
    balloon.style.display = 'none'; // Oculta el globo
    popScreen.style.display = 'flex'; // Muestra la pantalla de explosión
}

// Agrega un evento de clic para ocultar la pantalla "POP" al hacer clic y reiniciar
popScreen.addEventListener('click', () => {
    popScreen.style.display = 'none';
    resetBalloon();
});

function resetBalloon() {
    pressure = 0; // Reinicia la presión
    balloon.style.width = '100px'; // Tamaño inicial
    balloon.style.height = '100px';
    balloon.style.display = 'block'; // Muestra el globo nuevamente
}
