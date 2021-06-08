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

  const createInitiator = (stream, participants) => {
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
      socketRef.current.emit('send-offer', {
        signal,
        roomID,
        toUser: participants[0],
      })
    })

    peer.on('stream', (stream) => {
      customerVideoRef.current.srcObject = stream
      customerVideoRef.current.play()
    })

    return peer
  }

  const addAnswerPeer = (stream, offer, offeredUser) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      wrtc,
      stream,
    })

    peer.signal(offer)
    peer.on('connect', () => {
      setConnectionSate(true)
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('send-answer', {
        signal,
        roomID,
        offeredUser,
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
          socketRef.current = io(process.env.SOCKET_URL)

          socketRef.current.emit('join-room', {
            roomID,
          })

          socketRef.current.on('joined-room', ({ sdp, participants }) => {
            peerRef.current = createInitiator(stream, participants)
          })

          socketRef.current.on('fetch-offer', ({ signal, offeredUser }) => {
            console.log('fetching offer')
            peerRef.current = addAnswerPeer(stream, signal, offeredUser)
          })

          socketRef.current.on('fetch-answer', ({ signal }) => {
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
