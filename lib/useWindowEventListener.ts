import { useEffectEvent } from "react";
import { useIsomorphicLayoutEffect } from "./utils";

export function useWindowEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions)
{
	const eventListener = useEffectEvent(listener);

	useIsomorphicLayoutEffect(() =>
	{
		const target = typeof window !== "undefined" ? window : undefined;

		target?.addEventListener(type, eventListener, options);
		return (() => target?.removeEventListener(type, eventListener, options));
	}, [options, type]);
}
