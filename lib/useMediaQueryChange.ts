import { useEffectEvent } from "react";
import { useIsomorphicLayoutEffect } from "./utils";

export function useMediaQueryChange(query: string, listener: (this: MediaQueryList, event: MediaQueryListEvent) => any, options?: boolean | AddEventListenerOptions)
{
	const eventListener = useEffectEvent(listener);

	useIsomorphicLayoutEffect(() =>
	{
		const target = typeof window !== "undefined" ? window : undefined;
		const mediaMatch = target?.matchMedia(query);

		mediaMatch?.addEventListener("change", eventListener, options);
		return (() => mediaMatch?.removeEventListener("change", eventListener, options));
	}, [options, query]);
}
