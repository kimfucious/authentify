import React from "react";
import Lottie from "react-lottie";
import animationData from "../../lotties/17160-wave-loop-loading.json";

export const LottieLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return <Lottie options={defaultOptions} height={240} width={480} />;
};
