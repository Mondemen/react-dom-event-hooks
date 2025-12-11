import { useEffect } from "react";

export function useMediaQueryChange(query: string, listener: (this: MediaQueryList, event: MediaQueryListEvent) => any, options?: boolean | AddEventListenerOptions)
{
	useEffect(() =>
	{
		const target = typeof window !== "undefined" ? window : undefined;
		const mediaMatch = target?.matchMedia(query);

		mediaMatch?.addEventListener("change", listener, options);
		return (() => mediaMatch?.removeEventListener("change", listener, options));
	}, [listener, options, query]);
}
