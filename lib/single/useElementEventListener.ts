import { useCallback, useEffect } from "react";
import { useElementRef, type ElementRefCallback } from "./useElementRef";

export type UseElementEventListenerCallback<K extends keyof HTMLElementEventMap> = (this: HTMLElement, event: HTMLElementEventMap[K], ref: HTMLElement) => any;
export function useElementEventListener<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(type: K, listener: UseElementEventListenerCallback<K>, options?: boolean | AddEventListenerOptions)
{
	const ref = useElementRef(useCallback<ElementRefCallback<HTMLElement>>(ref =>
	{
		// eslint-disable-next-line react-hooks/unsupported-syntax
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, event, ref)}

		ref.addEventListener(type, callback, options);
		return (() => ref.removeEventListener(type, callback, options));
	}, [listener, options, type]));

	useEffect(() =>
	{
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, event, this)}

		ref.ref.current?.addEventListener(type, callback, options);
		return (() => ref.ref.current?.removeEventListener(type, callback, options));
	}, [listener, options, ref.ref, type]);

	return (ref);
}
