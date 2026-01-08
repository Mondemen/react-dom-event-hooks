import { useCallback, useEffect, useRef } from "react";
import { useMultiElementRef, type MultiElementRefCallback } from "./useMultiElementRef";

export type UseMultiMutationObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (mutations: MutationRecord[], refs: Map<string, T>, observer: MutationObserver) => void
export function useMultiMutationObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMultiMutationObserverCallback<T>, options?: MutationObserverInit, keyName?: string)
{
	const observerRef = useRef<MutationObserver>(null);
	const updateObserver = useCallback((refs: Map<string, T>) =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new MutationObserver((entries, observer) => callback(entries, refs, observer));
		refs.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options]);
	const refStore = useMultiElementRef(useCallback<MultiElementRefCallback<T>>((_name, _ref, refs) => updateObserver(refs), [updateObserver]), keyName);

	useEffect(() => updateObserver(refStore.ref.current), [callback, options, refStore.ref, updateObserver]);

	return (refStore);
}
