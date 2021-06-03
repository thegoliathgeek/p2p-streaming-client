import { useEffect, useRef } from "react";

const VideoComponent = ({ callback, reference }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {});
    }
  }, []);
  return <video ref={videoRef}></video>;
};

export default VideoComponent;
