import { useCallback, useEffect, useMemo, useRef, useState, type RefCallback } from "react";
import { useMultiElementRef, type MultiElementRefCallback, type MultiElementRefObject } from "./useMultiElementRef";

export type UseMultiIntersectionObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (entries: IntersectionObserverEntry[], refs: Map<string, T>, observer: IntersectionObserver) => void;

export type UseMultiIntersectionObserverOptions = Omit<IntersectionObserverInit, "root">;

export interface MultiIntersectionObserverObject<T extends HTMLElement | SVGElement = HTMLElement> extends MultiElementRefObject<T>
{
	saveRootRef: RefCallback<T>
}

export function useMultiIntersectionObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseMultiIntersectionObserverCallback<T>, options?: UseMultiIntersectionObserverOptions, keyName?: string)
{
	const observerRef = useRef<IntersectionObserver>(null);
	const refStore = useMultiElementRef(useCallback<MultiElementRefCallback<T>>((name, ref, refs) =>
	{
		if (refs.has(name))
			observerRef.current?.unobserve(refs.get(name) as T);
		observerRef.current?.observe(ref);
		return (() => observerRef.current?.unobserve(ref));
	}, []), keyName);
	const [rootRef, setRootRef] = useState<T | null>(null);
	const saveRootRef = useCallback<RefCallback<T>>(ref => setRootRef(ref), []);

	useEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new IntersectionObserver((entries, observer) => callback(entries, refStore.ref.current, observer), {...options, root: rootRef});
		refStore.ref.current.forEach(ref => observerRef.current?.observe(ref));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options, refStore.ref, rootRef]);

	return (useMemo<MultiIntersectionObserverObject<T>>(() =>
	({
		...refStore,
		saveRootRef
	}), [refStore, saveRootRef]));
}
