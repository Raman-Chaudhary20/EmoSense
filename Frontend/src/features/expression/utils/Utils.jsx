import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";


// let isMounted = true

const waitForVideo = async (videoRef) => {
  return new Promise((resolve) => {
    const check = () => {
      if (videoRef.current) {
        resolve(videoRef.current);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
};

export const init = async (refs) => {
  const {
    lastRunTimeRef,
    landmarkerRef,
    videoRef,
    streamRef,
    animationRef,
    lastExpressionRef,
    setExpression,
  } = refs;

  const video = await waitForVideo(videoRef)
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });

  streamRef.current = stream;

  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  await video.play().catch(() => {});

  detect(refs);
};

export const detect = (refs) => {
  const {
    lastRunTimeRef,
    videoRef,
    animationRef,
    landmarkerRef,
    lastExpressionRef,
    setExpression,
  } = refs;

  if (!videoRef.current || !landmarkerRef.current) {
    animationRef.current = requestAnimationFrame(() => detect(refs));
    return;
  }

  const now = performance.now();

  if (now - lastRunTimeRef.current < 100) {
    animationRef.current = requestAnimationFrame(() => detect(refs));
    return;
  }

  lastRunTimeRef.current = now;

  const video = videoRef.current;
  const landmarker = landmarkerRef.current;

  if (video.readyState < 2) {
    animationRef.current = requestAnimationFrame(() => detect(refs));
    return;
  }

  const results = landmarker.detectForVideo(video, now);

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    let currentExpression = "Neutral";

    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "Happy 😄";
    } else if (jawOpen > 0.6 && browUp > 0.5) {
      currentExpression = "Surprised 😲";
    } else if (frownLeft > 0.5 && frownRight > 0.5) {
      currentExpression = "Sad 😢";
    }

    if (currentExpression !== lastExpressionRef.current) {
      lastExpressionRef.current = currentExpression;
      setExpression(currentExpression);
    }
  }

  animationRef.current = requestAnimationFrame(() => detect(refs));
};