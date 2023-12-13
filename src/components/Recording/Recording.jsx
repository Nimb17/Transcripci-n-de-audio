import React, { useState, useRef } from 'react';

function Recording() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioUrlRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        const url = URL.createObjectURL(e.data);
        audioUrlRef.current = url;
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error al iniciar la grabación:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Detener Grabación' : 'Iniciar Grabación'}
      </button>
      {audioUrlRef.current && <audio src={audioUrlRef.current} controls />}
    </div>
  );
}

export default Recording;
