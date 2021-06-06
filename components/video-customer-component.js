import { useEffect, useRef, useState } from 'react'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'
import io from 'socket.io-client'

const VideoCustomerComponent = () => {
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
        roomID: 'f33ea2b0-6788-4b5c-ade5-373043aabbdb',
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
            roomID: 'f33ea2b0-6788-4b5c-ade5-373043aabbdb',
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <video ref={videoRef}></video>
      <video ref={adminVideoRef}></video>
    </div>
  )
}

export default VideoCustomerComponent
