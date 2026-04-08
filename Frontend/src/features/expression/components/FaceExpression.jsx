import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/Utils";

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const lastExpressionRef = useRef("Detecting...");
  const lastRunTimeRef = useRef(0);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    let isMounted = true;

    init({
      lastRunTimeRef,
      videoRef,
      animationRef,
      landmarkerRef,
      lastExpressionRef,
      streamRef,
      setExpression,
    });

    return () => {
      isMounted = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function handleClick() {
    const expression = detect({
      lastRunTimeRef,
      videoRef,
      animationRef,
      landmarkerRef,
      lastExpressionRef,
      setExpression,
    });
    console.log(expression);
    onClick(expression);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "400px", borderRadius: "12px" }}
      />
      <h2>{expression}</h2>
      <button onClick={handleClick}>Detect Expression</button>
    </div>
  );
}
