import { useCallback, useMemo, useRef, type RefCallback } from "react";

export type RefStoreCallback<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> = (key: string, ref: T, refs: Map<string, T>) => ReturnType<RefCallback<T>>
export function useRefStore<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>(callback?: RefStoreCallback<T>, keyName?: string)
{
	const refs = useRef<Map<string, T>>(new Map());
	const getRef = useCallback((key?: string) => refs.current.get(key ?? "") ?? null, []);
	const saveRef = useCallback<RefCallback<T>>((ref) =>
	{
		let key = ref?.dataset[keyName ?? "key"] ?? "default";
		let cleanup: ReturnType<typeof callback & {}>;

		if (ref)
		{
			refs.current.set(key, ref);
			cleanup = callback?.(key, ref, refs.current);
		}
		return (() =>
		{
			refs.current.delete(key);
			cleanup?.();
		});
	}, [callback]);

	return (useMemo(() => [saveRef, getRef, refs] as const, [getRef, saveRef]));
}
