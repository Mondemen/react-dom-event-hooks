import { useCallback, useEffectEvent, useMemo, useRef, type RefCallback } from "react";
import { useIsomorphicLayoutEffect } from "../utils";
import { type ElementRefObject } from "./useElementRef";

export type UseElementEventListenerCallback<K extends keyof HTMLElementEventMap> = (this: HTMLElement, event: HTMLElementEventMap[K], ref: HTMLElement) => any;
export function useElementEventListener<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(type: K, listener: UseElementEventListenerCallback<K>, options?: boolean | AddEventListenerOptions)
{
	const eventListener = useEffectEvent(function (this: HTMLElement, event: HTMLElementEventMap[K])
	{
		if (ref.current)
			listener.call(this, event, ref.current);
	});
	const ref = useRef<HTMLElement>(null);
	const saveRef = useCallback<RefCallback<HTMLElement>>((newRef) =>
	{
		ref.current = newRef;
		return (() => {ref.current = null});
	}, []);

	useIsomorphicLayoutEffect(() =>
	{
		ref.current?.addEventListener(type, eventListener, options);
		return (() => ref.current?.removeEventListener(type, eventListener, options));
	}, [options, type]);

	return (useMemo<ElementRefObject<HTMLElement>>(() =>
	({
		saveRef,
		ref
	}), [saveRef]));
}
