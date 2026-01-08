import { useCallback, useMemo, useRef, type RefCallback, type RefObject } from "react";

export type ElementRefCallback<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> = (ref: T) => ReturnType<RefCallback<T>>

export interface SaveElementRefObject<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>
{
	saveRef: RefCallback<T>
}
export interface ElementRefObject<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> extends SaveElementRefObject<T>
{
	ref: RefObject<T | null>
}

export function useElementRef<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>(callback: ElementRefCallback<T>)
{
	const ref = useRef<T>(null);
	const saveRef = useCallback<RefCallback<T>>((newRef) =>
	{
		const cleanup = newRef ? callback?.(newRef) : undefined;

		ref.current = newRef;
		return (() =>
		{
			ref.current = null;
			cleanup?.();
		})
	}, [callback]);

	return (useMemo<ElementRefObject<T>>(() =>
	({
		saveRef,
		ref
	}), [saveRef]));
}
