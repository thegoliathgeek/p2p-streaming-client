import VideoAgentComponent from '../../components/video-agent-component'
import { useRouter } from 'next/router'
const AgentComponent = () => {
  const router = useRouter()
  const { room } = router.query

  return (
    <VideoAgentComponent
      roomID={room ? room : 'f33ea2b0-6788-4b5c-ade5-373043aabbdb'}
    ></VideoAgentComponent>
  )
}

export default AgentComponent
