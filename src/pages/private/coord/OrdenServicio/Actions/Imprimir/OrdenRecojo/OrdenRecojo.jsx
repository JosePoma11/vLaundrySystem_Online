/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect } from "react";

const OrdenRecojo = React.forwardRef((props, ref) => {
  const { infoOrden, InfoNegocio } = props;

  // useEffect(() => {
  //   console.log(infoOrden);
  // }, [infoOrden]);

  return (
    <div className="orden-recojo" ref={ref}>
      <h1>OrdenRecojo</h1>
    </div>
  );
});

export default OrdenRecojo;
