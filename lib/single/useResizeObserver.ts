import { useCallback, useEffectEvent, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../utils";
import { useElementRef, type ElementRefCallback } from "./useElementRef";

export type UseResizeObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (entries: ResizeObserverEntry[], ref: T, observer: ResizeObserver) => void
export function useResizeObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseResizeObserverCallback<T>, options?: ResizeObserverOptions)
{
	const observerRef = useRef<ResizeObserver>(null);
	const eventCallback = useEffectEvent(callback);
	const refStore = useElementRef(useCallback<ElementRefCallback<T>>((ref) =>
	{
		if (ref)
			observerRef.current?.unobserve(ref);
		observerRef.current?.observe(ref, options);
		return (() => observerRef.current?.unobserve(ref));
	}, [options]));

	useIsomorphicLayoutEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new ResizeObserver((entries, observer) =>
		{
			if (refStore.ref.current)
				eventCallback(entries, refStore.ref.current, observer);
		});
		if (refStore.ref.current)
			observerRef.current?.observe(refStore.ref.current, options);
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [options, refStore.ref]);

	return (refStore);
}
