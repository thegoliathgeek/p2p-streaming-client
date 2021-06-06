import VideoCustomerComponent from '../../components/video-customer-component'
import { useRouter } from 'next/router'
const CustomerComponent = () => {
  const router = useRouter()
  const { room } = router.query
  return (
    <VideoCustomerComponent
      roomID={room ? room : 'f33ea2b0-6788-4b5c-ade5-373043aabbdb'}
    ></VideoCustomerComponent>
  )
}

export default CustomerComponent
