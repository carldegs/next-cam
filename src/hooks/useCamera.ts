import { useCallback, useEffect, useRef, useState } from 'react';

const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>();
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  const open = useCallback(
    async (constraints: MediaStreamConstraints) => {
      try {
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => {
            track.stop();
          });
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        videoRef.current.srcObject = stream;

        setMediaStream(stream);
      } catch (err) {
        console.error(err);
      }
    },
    [mediaStream]
  );

  const close = useCallback(() => {
    videoRef.current.srcObject = undefined;
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  }, [mediaStream]);

  const capture = useCallback(async () => {
    const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);

    const capabilities = await imageCapture.getPhotoCapabilities();

    const photo = await imageCapture.takePhoto({
      imageHeight:
        capabilities.imageHeight.max >= 1200
          ? 1200
          : capabilities.imageHeight.max,
    });
    const photoUrl = URL.createObjectURL(photo);
    return photoUrl;
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream) {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream]);

  return { mediaStream, open, close, capture, videoRef };
};

export default useCamera;
