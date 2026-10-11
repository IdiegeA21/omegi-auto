"use client";
import { createContext, useContext } from "react";

/** Set by TransitionProvider. null where there is no provider (e.g. the ad layout), so links fall back to normal navigation. */
export const TransitionCtx = createContext<((href: string) => void) | null>(null);
export const useGo = () => useContext(TransitionCtx);
