import { useEffect, useRef, useState } from 'react'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'
import io from 'socket.io-client'

const VideoAgentComponent = () => {
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
          roomID: 'f33ea2b0-6788-4b5c-ade5-373043aabbdb',
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
            roomID: 'f33ea2b0-6788-4b5c-ade5-373043aabbdb',
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <video ref={videoRef}></video>
      <video ref={customerVideoRef}></video>
    </div>
  )
}

export default VideoAgentComponent
