import { useEffect, useRef, useState } from "react";

const VideoComponent = ({ callback, reference }) => {
  const videoRef = useRef(null);
  const [cameraOff, setCameraOff] = useState(false);
  let videoRecorder = null;

  const toggleCameraState = () => {
    if (!cameraOff) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setCameraOff(!cameraOff);
  };

  const onVideoDataAvailable = (data) => {};

  const onStart = () => {};

  const stopRecording = () => {
    videoRecorder.stop();
  };

  const startRecording = (time = 3000) => {
    videoRecorder.start();
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          videoRecorder = new MediaRecorder(stream);
          videoRecorder.ondataavailable = onVideoDataAvailable;
          videoRecorder.onstart = onStart;
          videoRef.current.srcObject = videoRecorder.stream;
          videoRef.current.play();
        })
        .catch((err) => {});
    }
  }, []);
  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <button onClick={toggleCameraState}>Off</button>
      <video ref={videoRef}></video>
    </div>
  );
};

export default VideoComponent;
