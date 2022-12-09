import React, { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

const ProgressBar = () => {
  useEffect(() => {
    nprogress.start();

    return () => {
      nprogress.done();
    };
  }, []);

  return <></>;
};

export default ProgressBar;
