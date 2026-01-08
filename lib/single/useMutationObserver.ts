import { useCallback, useEffect, useRef } from "react";
import { useElementRef, type ElementRefCallback } from "./useElementRef";

export type UseMutationObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (mutations: MutationRecord[], ref: T, observer: MutationObserver) => void
export function useMutationObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMutationObserverCallback<T>, options?: MutationObserverInit)
{
	const observerRef = useRef<MutationObserver>(null);
	const updateObserver = useCallback((ref: T | null) =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new MutationObserver((entries, observer) =>
		{
			if (ref)
				callback(entries, ref, observer);
		});
		if (ref)
			observerRef.current?.observe(ref, options);
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options]);
	const refStore = useElementRef(useCallback<ElementRefCallback<T>>(ref => updateObserver(ref), [updateObserver]));

	useEffect(() => updateObserver(refStore.ref.current), [callback, options, refStore.ref, updateObserver]);

	return (refStore);
}
