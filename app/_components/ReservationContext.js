"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();
const initialstate = { from: undefined, to: undefined };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialstate);
  const resetRange = () => {
    setRange(initialstate);
  };

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("context was call outside the provideer");

  return context;
}

export { ReservationProvider, useReservation };
