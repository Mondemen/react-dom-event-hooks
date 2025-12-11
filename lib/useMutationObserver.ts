import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRefStore, type RefStoreCallback } from "./useRefStore";

export type UseMutationObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (refs: Map<string, T>, ...args: Parameters<MutationCallback>) => void
export function useMutationObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMutationObserverCallback<T>, options?: MutationObserverInit, keyName?: string)
{
	const observerRef = useRef<MutationObserver>(null);
	const updateObserver = useCallback((refs: Map<string, T>) =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new MutationObserver((entries, observer) => callback(refs, entries, observer));
		refs.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, []);
	const [saveRef, getRef, refs] = useRefStore(useCallback<RefStoreCallback<T>>((_name, _ref, refs) => updateObserver(refs), [options]), keyName);

	useEffect(() => updateObserver(refs.current), [callback, options, refs]);

	return (useMemo(() => [saveRef, getRef] as const, [getRef, saveRef]));
}
