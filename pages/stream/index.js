import { useRef } from 'react'
import VideoRecordingComponent from '../../components/video-recording-component'

const StreamComponent = () => {
  const videoRef = useRef(null)
  return (
    <div>
      <VideoRecordingComponent />
    </div>
  )
}

export default StreamComponent
