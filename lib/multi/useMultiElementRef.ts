import { useCallback, useMemo, useRef, type RefCallback, type RefObject } from "react";
import type { SaveElementRefObject } from "../single/useElementRef";

export type MultiElementRefCallback<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> = (key: string, ref: T, refs: Map<string, T>) => ReturnType<RefCallback<T>>

export interface MultiElementRefObject<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> extends SaveElementRefObject<T>
{
	ref: RefObject<Map<string, T>>,
	getElement: (key: string) => T | null
}

export function useMultiElementRef<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>(callback: MultiElementRefCallback<T>, keyName?: string)
{
	const ref = useRef<Map<string, T>>(new Map());
	const getElement = useCallback((key?: string) => ref.current.get(key ?? "") ?? null, []);
	const saveRef = useCallback<RefCallback<T>>((newRef) =>
	{
		let key = newRef?.dataset[keyName ?? "key"] ?? "default";
		const cleanup = newRef ? callback?.(key, newRef, ref.current) : undefined;

		if (newRef)
			ref.current.set(key, newRef);
		return (() =>
		{
			ref.current.delete(key);
			cleanup?.();
		});
	}, [callback, keyName]);

	return (useMemo<MultiElementRefObject<T>>(() =>
	({
		saveRef,
		getElement,
		ref
	}), [getElement, saveRef]));
}
