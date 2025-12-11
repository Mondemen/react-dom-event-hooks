import { useCallback, useEffect, useMemo } from "react";
import { useRefStore, type RefStoreCallback } from "./useRefStore";

export type UseElementEventListenerCallback<K extends keyof HTMLElementEventMap> = (this: HTMLElement, refs: Map<string, HTMLElement>, event: HTMLElementEventMap[K]) => any
export function useElementEventListener<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(type: K, listener: UseElementEventListenerCallback<K>, options?: boolean | AddEventListenerOptions, keyName?: string)
{
	const [saveRef, getRef, refs] = useRefStore(useCallback<RefStoreCallback<HTMLElement>>((_, ref) =>
	{
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, refs.current, event)}

		ref.addEventListener(type, callback, options);
		return (() => ref.removeEventListener(type, callback, options));
	}, [listener, options, type]), keyName);

	useEffect(() =>
	{
		const refList = refs.current;
		function callback(this: HTMLElement, event: HTMLElementEventMap[K]) {listener.call(this, refs.current, event)}

		refList.forEach(ref => ref.addEventListener(type, callback, options));
		return (() => refList.forEach(ref => ref.removeEventListener(type, callback, options)));
	}, [listener, options, refs, type]);

	return (useMemo(() => [saveRef, getRef] as const, [getRef, saveRef]));
}
