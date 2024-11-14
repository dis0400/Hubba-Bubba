let balloon = document.getElementById('balloon');
let popScreen = document.getElementById('pop-screen');
let popText = document.getElementById('pop-text');
let explosion = document.getElementById('explosion'); 
let pressure = 0;
let maxPressure = 9000; 

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
                pressure += 10; 
                inflateBalloon();

                if (pressure >= maxPressure) { 
                    explodeBalloon();
                }
            }

            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    })
    .catch(error => {
        console.error('Error al acceder al micrófono:', error);
        alert('No se pudo acceder al micrófono. Verifica los permisos en el navegador.');
    });


function inflateBalloon() {
    let newSize = 100 + (pressure * 3); 
    balloon.style.width = newSize + 'px';
    balloon.style.height = newSize + 'px';
    if (newSize >= 365) { 
        explodeBalloon();
    }
}

function explodeBalloon() {
    balloon.style.display = 'none'; 
    explosion.style.display = 'flex'; 

    // Añade la clase para el efecto de crecimiento y deslizamiento después de que sea visible
    setTimeout(() => {
        explosion.classList.add('grow-and-slide');
        console.log("Clase .grow-and-slide aplicada"); 
    }, 500);

    // Después de 2.5 segundos, oculta la explosión y muestra la pantalla rosa con "POP"
    setTimeout(() => {
        explosion.style.display = 'none'; 
        //popScreen.style.display = 'flex';
    }, 2500);
}

popScreen.addEventListener('click', () => {
    explosion.style.display = 'none';
    resetBalloon();
});

function resetBalloon() {
    pressure = 0; 
    balloon.style.width = '100px';
    balloon.style.height = '100px';
    balloon.style.display = 'block'; 
    explosion.style.display = 'none'; 
    explosion.classList.remove('grow-and-slide');
    popScreen.style.display = 'none'; 
}
