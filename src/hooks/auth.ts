import React, { useState } from "react";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);

  return [isAuth, setIsAuth];
};
