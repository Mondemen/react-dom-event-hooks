import { useCallback, useEffect } from "react";
import { useMultiElementRef, type MultiElementRefCallback } from "./useMultiElementRef";

export type UseMultiElementEventListenerCallback<K extends keyof HTMLElementEventMap> = (this: HTMLElement, event: HTMLElementEventMap[K], ref: HTMLElement, refs: Map<string, HTMLElement>) => any
export function useMultiElementEventListener<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(type: K, listener: UseMultiElementEventListenerCallback<K>, options?: boolean | AddEventListenerOptions, keyName?: string)
{
	const refStore = useMultiElementRef(useCallback<MultiElementRefCallback<HTMLElement>>((_, ref, refs) =>
	{
		// eslint-disable-next-line react-hooks/unsupported-syntax
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, event, ref, refs)}

		ref.addEventListener(type, callback, options);
		return (() => ref.removeEventListener(type, callback, options));
	}, [listener, options, type]), keyName);

	useEffect(() =>
	{
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, event, this, refStore.ref.current)}

		refStore.ref.current.forEach(ref => ref.addEventListener(type, callback, options));
		return (() => refStore.ref.current.forEach(ref => ref.removeEventListener(type, callback, options)));
	}, [listener, options, refStore.ref, type]);

	return (refStore);
}
