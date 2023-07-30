let audioContext;
let analyser;
let bufferLength;
let dataArray;
let isAnalyzing = false;

function initializeAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048; // Adjust this value to set the FFT size
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

function startAudioAnalysis() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      let audioSource = audioContext.createMediaStreamSource(stream);
      audioSource.connect(analyser);
      isAnalyzing = true;
      analyzeAudio();
    })
    .catch(function(err) {
      console.error("Error accessing microphone:", err);
    });
}

function stopAudioAnalysis() {
  isAnalyzing = false;
}

function analyzeAudio() {
  if (!isAnalyzing) return;

  analyser.getByteTimeDomainData(dataArray);

  // Perform frequency analysis on the dataArray
  // ...

  // Example: Find the dominant frequency
  let maxAmplitude = 0;
  let maxFrequency = 0;

  for (let i = 0; i < bufferLength; i++) {
    let amplitude = dataArray[i]; 
    
    if (amplitude > maxAmplitude) {
      maxAmplitude = amplitude;
      maxFrequency = i * audioContext.sampleRate / bufferLength;
    }
  }

  // Display the dominant frequency
  document.getElementById("frequencyDisplay").textContent = "Frequency: " + Math.round(maxFrequency) + " Hz";

  requestAnimationFrame(analyzeAudio);
}

window.addEventListener("load", function() {
  initializeAudio();

  document.getElementById("startButton").addEventListener("click", function() {
    startAudioAnalysis();
  });

  document.getElementById("stopButton").addEventListener("click", function() {
    stopAudioAnalysis();
  });
});
