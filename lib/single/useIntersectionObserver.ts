import { useCallback, useEffect, useMemo, useRef, useState, type RefCallback } from "react";
import { useElementRef, type ElementRefCallback, type ElementRefObject } from "./useElementRef";

export type UseIntersectionObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (entries: IntersectionObserverEntry[], ref: T, observer: IntersectionObserver) => void;

export type UseIntersectionObserverOptions = Omit<IntersectionObserverInit, "root">;

export interface IntersectionObserverObject<T extends HTMLElement | SVGElement = HTMLElement> extends ElementRefObject<T>
{
	saveRootRef: RefCallback<T>
}

export function useIntersectionObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseIntersectionObserverCallback<T>, options?: UseIntersectionObserverOptions)
{
	const observerRef = useRef<IntersectionObserver>(null);
	const refStore = useElementRef(useCallback<ElementRefCallback<T>>(ref =>
	{
		if (ref)
			observerRef.current?.unobserve(ref);
		observerRef.current?.observe(ref);
		return (() => observerRef.current?.unobserve(ref));
	}, []));
	const [rootRef, setRootRef] = useState<T | null>(null);
	const saveRootRef = useCallback<RefCallback<T>>(ref => setRootRef(ref), []);

	useEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new IntersectionObserver((entries, observer) =>
		{
			if (refStore.ref.current)
				callback(entries, refStore.ref.current, observer);
		}, {...options, root: rootRef});
		if (refStore.ref.current)
			observerRef.current?.observe(refStore.ref.current);
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options, refStore.ref, rootRef]);

	return (useMemo<IntersectionObserverObject<T>>(() =>
	({
		...refStore,
		saveRootRef
	}), [refStore, saveRootRef]));
}
