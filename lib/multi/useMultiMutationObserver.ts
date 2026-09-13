import { useCallback, useEffectEvent, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../utils";
import { useMultiElementRef, type MultiElementRefCallback } from "./useMultiElementRef";

export type UseMultiMutationObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (mutations: MutationRecord[], refs: Map<string, T>, observer: MutationObserver) => void
export function useMultiMutationObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMultiMutationObserverCallback<T>, options?: MutationObserverInit, keyName?: string)
{
	const observerRef = useRef<MutationObserver>(null);
	const eventCallback = useEffectEvent(callback);
	const refStore = useMultiElementRef(useCallback<MultiElementRefCallback<T>>((_, ref, refs) =>
	{
		observerRef.current?.disconnect();
		refs.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			observerRef.current?.disconnect();
			refs.forEach(refBase =>
			{
				if (refBase !== ref)
					observerRef.current?.observe(refBase, options);
			});
		});
	}, [options]), keyName);

	useIsomorphicLayoutEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new MutationObserver((entries, observer) => eventCallback(entries, refStore.ref.current, observer));
		refStore.ref.current.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [options, refStore.ref]);

	return (refStore);
}
