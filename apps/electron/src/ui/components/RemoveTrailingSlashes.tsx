import React, { type FC, type ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

//Small component that ensures there are no trailing slashes,
// currently needed to make sure `Home` screen works more consistently
//TODO if this component is not used anywhere else in the future, it should
// be integrated into Said `Home` screen only to prevent undefined behaviour
export const RemoveTrailingSlashes: FC<{ children: ReactElement }> = ({ children }) => {
  const location = useLocation();

  // If the last character of the url is '/'
  if (/\/.*\/$/.exec(location.pathname)) {
    return (
      <Navigate
        replace
        {...children}
        to={{
          pathname: location.pathname.replace(/\/+$/, ""),
          search: location.search,
        }}
      />
    );
  }
  return children;
};
