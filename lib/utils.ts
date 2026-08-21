import { useEffect, useLayoutEffect } from "react";

export function isBrowser()
{
	return (typeof window !== "undefined");
}

export const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;
