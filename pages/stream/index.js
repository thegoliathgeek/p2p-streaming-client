import { useRef } from "react";
import VideoComponent from "../../components/video-component";

const StreamComponent = () => {
  const videoRef = useRef(null);
  return (
    <div>
      <VideoComponent />
    </div>
  );
};

export default StreamComponent;
