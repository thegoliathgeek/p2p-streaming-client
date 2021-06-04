import { useRef } from "react";
import VideoComponent from "../../components/video-component";

const StreamComponent = () => {
  const videoRef = useRef(null);
  console.log(process.env.UPLOAD_URL);
  return (
    <div>
      <VideoComponent />
    </div>
  );
};

export default StreamComponent;
