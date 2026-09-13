import { useCallback, useEffectEvent, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../utils";
import { useElementRef, type ElementRefCallback } from "./useElementRef";

export type UseMutationObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (mutations: MutationRecord[], ref: T, observer: MutationObserver) => void
export function useMutationObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMutationObserverCallback<T>, options?: MutationObserverInit)
{
	const observerRef = useRef<MutationObserver>(null);
	const eventCallback = useEffectEvent(callback);
	const refStore = useElementRef(useCallback<ElementRefCallback<T>>((ref) =>
	{
		if (ref)
			observerRef.current?.disconnect();
		observerRef.current?.observe(ref, options);
		return (() => observerRef.current?.disconnect());
	}, [options]));

	useIsomorphicLayoutEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new MutationObserver((entries, observer) =>
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
