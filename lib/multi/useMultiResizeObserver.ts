import { useCallback, useEffect, useRef } from "react";
import { useMultiElementRef, type MultiElementRefCallback } from "./useMultiElementRef";

export type UseMultiResizeObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (entries: ResizeObserverEntry[], refs: Map<string, T>, observer: ResizeObserver) => void
export function useMultiResizeObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMultiResizeObserverCallback<T>, options?: ResizeObserverOptions, keyName?: string)
{
	const observerRef = useRef<ResizeObserver>(null);
	const refStore = useMultiElementRef(useCallback<MultiElementRefCallback<T>>((name, ref, refs) =>
	{
		if (refs.has(name))
			observerRef.current?.unobserve(refs.get(name) as T);
		observerRef.current?.observe(ref, options);
		return (() => observerRef.current?.unobserve(ref));
	}, [options]), keyName);

	useEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new ResizeObserver((entries, observer) => callback(entries, refStore.ref.current, observer));
		refStore.ref.current.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options, refStore.ref]);

	return (refStore);
}
