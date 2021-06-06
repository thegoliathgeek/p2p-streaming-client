import { useEffect, useRef, useState } from 'react'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'
import io from 'socket.io-client'
import { Badge, Center, HStack, VStack } from '@chakra-ui/react'

const VideoAgentComponent = ({ roomID }) => {
  const videoRef = useRef(null)
  const socketRef = useRef(null)
  const customerVideoRef = useRef(null)
  const peerRef = useRef(null)
  const [connectionState, setConnectionSate] = useState(false)

  const createPeer = (stream) => {
    const socket = socketRef.current
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      wrtc,
      stream,
    })

    peer.on('connect', () => {
      setConnectionSate(true)
    })

    peer.on('signal', (signal) => {
      if (signal.sdp)
        socket.emit('send-initiator-signal', {
          signal,
          roomID,
        })
    })

    peer.on('stream', (stream) => {
      customerVideoRef.current.srcObject = stream
      customerVideoRef.current.play()
    })

    return peer
  }

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          //
          socketRef.current = io(process.env.SOCKET_URL)
          socketRef.current.emit('join-room', {
            roomID,
          })

          socketRef.current.on('joined-room', () => {
            peerRef.current = createPeer(stream)
          })

          socketRef.current.on(
            'receive-initiator-signal',
            ({ signal, roomID }) => {
              peerRef.current.signal(signal)
            }
          )

          videoRef.current.srcObject = stream

          videoRef.current.play()
        })
    }
  }, [connectionState])
  return (
    <Center>
      <VStack spacing={8}>
        {connectionState ? (
          <Badge color='green'>Client Connected</Badge>
        ) : (
          <Badge color='red'>Client Not Connected</Badge>
        )}
        <HStack spacing={16}>
          <video width='500px' height='500px' ref={videoRef}></video>
          <video width='500px' height='500px' ref={customerVideoRef}></video>
        </HStack>
      </VStack>
    </Center>
  )
}

export default VideoAgentComponent
