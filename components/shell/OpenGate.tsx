"use client";
import { useEffect } from "react";
import { gate } from "@/lib/motion/gate";

/** For layouts with no preloader or page transition: the stage is lit from the start. */
export default function OpenGate() {
  useEffect(() => { gate.open(); }, []);
  return null;
}
