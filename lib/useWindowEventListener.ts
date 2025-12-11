import { useEffect } from "react";

export function useWindowEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions)
{
	useEffect(() =>
	{
		const target = typeof window !== "undefined" ? window : undefined;

		target?.addEventListener(type, listener, options);
		return (() => target?.removeEventListener(type, listener, options));
	}, [listener, options, type]);
}
