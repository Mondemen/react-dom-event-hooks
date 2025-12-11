import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRefStore, type RefStoreCallback } from "./useRefStore";

export type UseResizeObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (refs: Map<string, T>, ...args: Parameters<ResizeObserverCallback>) => void
export function useResizeObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseResizeObserverCallback<T>, options?: ResizeObserverOptions, keyName?: string)
{
	const observerRef = useRef<ResizeObserver>(null);
	const [saveRef, getRef, refs] = useRefStore(useCallback<RefStoreCallback<T>>((name, ref, refs) =>
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
		observerRef.current = new ResizeObserver((entries, observer) => callback(refs.current, entries, observer));
		refs.current.forEach(ref => observerRef.current?.observe(ref, options));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, options, refs]);

	return (useMemo(() => [saveRef, getRef] as const, [getRef, saveRef]));
}
