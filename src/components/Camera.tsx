import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

import useScreenDim from '../hooks/useScreenDim';

const Camera: React.ForwardRefRenderFunction<HTMLVideoElement, BoxProps> = (
  props,
  videoRef
) => {
  const dimensions = useScreenDim();
  return (
    <>
      <Box w="full" h="full" {...props}>
        <video
          ref={videoRef}
          onCanPlay={() => {
            if (typeof videoRef !== 'function') {
              videoRef.current.play();
            }
          }}
          autoPlay
          muted
          height={`${dimensions.height}px`}
          width={`${dimensions.width}px`}
          style={{
            objectFit: 'cover',
            height: '100%',
          }}
        />
      </Box>
    </>
  );
};

export default React.forwardRef<HTMLVideoElement, BoxProps>(Camera);
