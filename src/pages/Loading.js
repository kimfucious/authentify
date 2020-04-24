import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { swth } from "../data";
import { LottieLoader } from "../components/shared/LottieLoader";

export const Loading = () => {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const { username } = useSelector((state) => state.auth);
  const [animation, setAnimation] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const subtitles = [
    "This can sometimes take a while",
    "It's taking longer than usual",
    "We may have a problem here"
  ].concat(swth);

  useEffect(() => {
    if (username) {
      console.log(
        "Loading page sees user data in state.  Redirecting to home."
      );
      history.replace("/home");
    }
  }, [history, username]);

  useInterval(() => {
    if (!username) {
      setAnimation("fadeInUp");
      setSubtitle(subtitles[count]);
      setCount(count + 1);
    }
  }, 4000);

  // TODO:  ask Dan about this.
  useInterval(() => {
    if (!username) {
      setAnimation("");
    }
  }, 5000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 animated fadeIn">
      <LottieLoader />
      <div className="display-3 mt-0 text-light">Loading</div>
      {subtitle ? (
        <div className={`lead mt-3 text-light animated ${animation}`}>
          {subtitle}
        </div>
      ) : (
        <div className="lead mt-3 text-dark ">You can't see me!</div>
      )}
    </div>
  );
};
