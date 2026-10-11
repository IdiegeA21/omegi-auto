"use client";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useGo } from "./transitionContext";

/** next/link that plays the page transition for plain internal clicks. Everything else behaves like a normal link. Small on purpose: it does not pull in GSAP. */
export function TransitionLink({ href, onClick, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const go = useGo();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!href.startsWith("/") || href.startsWith("/#")) return;
    if (rest.target && rest.target !== "_self") return;
    if (!go) return; // no provider (e.g. the ad layout): behave like a normal link
    e.preventDefault();
    go(href);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
