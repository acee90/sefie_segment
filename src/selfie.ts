// import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-core';
import mpSelfieSegmentation, { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

import bg from './bg640_480.jpg';

function sleep(t: number){
    return new Promise(resolve=>setTimeout(resolve,t));
 }

async function SelfieSetup(videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) {

    // Our input frames will come from here.
    const videoElement = videoRef.current!;
    const canvasElement = canvasRef.current!;
    const canvasCtx = canvasElement?.getContext("2d")!;

    const bgImage = new Image();
    bgImage.src = bg;

    let activeEffect = 'mask';
    function onResults(results: mpSelfieSegmentation.Results): void {
        // Draw the overlays.
        canvasCtx.save();

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.drawImage(
            results.segmentationMask, 0, 0, canvasElement.width,
            canvasElement.height);

        // Only overwrite existing pixels.
        if (activeEffect === 'mask' || activeEffect === 'both') {
            canvasCtx.globalCompositeOperation = 'source-in';
            // This can be a color or a texture or whatever...
            // rgba
            canvasCtx.fillStyle = '#00FF007F';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        } else {
            canvasCtx.globalCompositeOperation = 'source-out';
            // canvasCtx.fillStyle = '#0000FF7F';
            // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(bgImage, 0, 0, canvasElement.width, canvasElement.height);
        }

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);


        canvasCtx.restore();
    }

    // const selfieSegmentation = new SelfieSegmentation({
    //     locateFile: (file) => {
    //         return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
    //     }
    // });
    const selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) => 
        {
            return file;
        }
    });
    selfieSegmentation.onResults(onResults);

    // modelSelection: general(0) or landscape(1)
    selfieSegmentation.setOptions({
        selfieMode: true,
        modelSelection: 0
    });

    const mediaStream = await navigator.mediaDevices.getUserMedia({video: {width: 1280, height: 720}});

    const {width, height} = mediaStream.getVideoTracks()[0].getSettings()
    console.log(width, height);
    canvasElement.width = width!;
    canvasElement.height = height!;
    videoElement.srcObject = mediaStream;

    activeEffect = 'background';


    selfieSegmentation.initialize().then(() => {
        setInterval(async () => {
            await selfieSegmentation.send({image: videoElement});
        }, 30);
    })
    // 시간이 좀 필요한듯 함.
    // selfieSegmentation이 initialize 되는데까지 인지..
    // 어떤시간인지는 잘 모르겠다.

}

export default SelfieSetup;