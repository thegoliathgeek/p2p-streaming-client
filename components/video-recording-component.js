import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";

const VideoRecordingComponent = ({
  onStartCallback,
  onStopCallback,
  reference,
}) => {
  const videoRef = useRef(null);
  const [cameraOff, setCameraOff] = useState(false);
  const uploadBlob = useMutation(
    (data) =>
      axios({
        url: data.url,
        method: "post",
        data: data.blob,
      }),
    {
      onSuccess(d) {},
      onError(e) {},
    }
  );
  let videoRecorder = null;

  const toggleCameraState = () => {
    if (!cameraOff) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setCameraOff(!cameraOff);
  };

  const onRecordingPause = () => {
    videoRecorder.requestData();
  };

  const onVideoDataAvailable = (e) => {
    const { data } = e;
    const formData = new FormData();
    formData.append("video", data);
    uploadBlob.mutate({
      url: process.env.UPLOAD_URL,
      blob: formData,
    });
  };

  const stopRecording = () => {
    console.log("pauses");
    videoRecorder.pause();
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
          videoRecorder.onstart = onStartCallback;
          videoRecorder.onpause = onRecordingPause;
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
