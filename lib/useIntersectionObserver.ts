import { useCallback, useEffect, useMemo, useRef, useState, type RefCallback } from "react";
import { useRefStore, type RefStoreCallback } from "./useRefStore";

export type UseIntersectionObserverCallback<T extends HTMLElement | SVGElement = HTMLElement> = (refs: Map<string, T>, ...args: Parameters<IntersectionObserverCallback>) => void;
export type UseIntersectionObserverOptions = Omit<IntersectionObserverInit, "root">;
export function useIntersectionObserver<T extends HTMLElement | SVGElement = HTMLElement>(callback: UseIntersectionObserverCallback<T>, options?: UseIntersectionObserverOptions, keyName?: string)
{
	const observerRef = useRef<IntersectionObserver>(null);
	const [saveRef, getRef, refs] = useRefStore(useCallback<RefStoreCallback<T>>((name, ref, refs) =>
	{
		if (refs.has(name))
			observerRef.current?.unobserve(refs.get(name) as T);
		observerRef.current?.observe(ref);
		return (() => observerRef.current?.unobserve(ref));
	}, []), keyName);
	const [observerOptions, setObserverOptions] = useState<IntersectionObserverInit>({...options});
	const saveRootRef = useCallback<RefCallback<T>>((ref) => setObserverOptions(options => ({...options, root: ref})), []);

	useEffect(() =>
	{
		if (observerRef.current)
			observerRef.current?.disconnect();
		observerRef.current = new IntersectionObserver((entries, observer) => callback(refs.current, entries, observer), observerOptions);
		refs.current.forEach(ref => observerRef.current?.observe(ref));
		return (() =>
		{
			if (observerRef.current)
				observerRef.current?.disconnect();
			observerRef.current = null;
		});
	}, [callback, observerOptions, refs]);

	return (useMemo(() => [saveRef, saveRootRef, getRef] as const, [getRef, saveRef, saveRootRef]));
}
