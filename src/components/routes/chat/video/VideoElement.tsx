import React, { useEffect, useRef } from 'react';

interface VideoElementProps {
	mediaStream: MediaStream;
}

export default function VideoElement({ mediaStream, ...others }: VideoElementProps) {
	const elRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (elRef.current) {
			if (mediaStream) {
				elRef.current.srcObject = mediaStream;
			} else {
				elRef.current.srcObject = null;
			}
		}
	}, [mediaStream]);

	return <video ref={elRef} autoPlay={true} {...others}></video>;
}
