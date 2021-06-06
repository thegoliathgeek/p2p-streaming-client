import { useEffect, useRef, useState } from 'react'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'
import io from 'socket.io-client'
import { Center } from '@chakra-ui/layout'
import { VStack } from '@chakra-ui/layout'
import { Badge } from '@chakra-ui/layout'
import { HStack } from '@chakra-ui/layout'

const VideoCustomerComponent = ({ roomID }) => {
  const videoRef = useRef(null)
  const adminVideoRef = useRef(null)
  const socketRef = useRef(null)
  const peerRef = useRef(null)
  const [connectionState, setConnectionSate] = useState(false)

  const createPeer = (stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      wrtc,
      stream,
    })

    peer.on('connect', () => {
      setConnectionSate(true)
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('send-client-signal', {
        signal,
        roomID,
      })
    })

    peer.on('stream', (stream) => {
      adminVideoRef.current.srcObject = stream
      adminVideoRef.current.play()
    })

    peer.on('data', (stream) => {
      console.log(stream)
    })

    return peer
  }

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          socketRef.current = io(process.env.SOCKET_URL)

          socketRef.current.emit('join-room', {
            roomID,
          })

          socketRef.current.on('joined-room', ({ sdp, roomID }) => {
            peerRef.current = createPeer(stream)
            peerRef.current.signal(sdp)
          })

          socketRef.current.on('receive-signal', ({ signal }) => {
            peerRef.current.signal(signal)
          })

          videoRef.current.srcObject = stream

          videoRef.current.play()
        })
    }
  }, [])
  return (
    <Center>
      <VStack spacing={8}>
        {connectionState ? (
          <Badge color='green'>Agent Connected</Badge>
        ) : (
          <Badge color='red'>Agent Not Connected</Badge>
        )}
        <HStack spacing={16}>
          <video width='500px' height='500px' ref={videoRef}></video>
          <video width='500px' height='500px' ref={adminVideoRef}></video>
        </HStack>
      </VStack>
    </Center>
  )
}

export default VideoCustomerComponent
