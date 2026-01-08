import { useCallback, useMemo, useRef, type Ref, type RefCallback } from "react";
import type { ElementRefObject } from "./useElementRef";

export function useConcatElementRef<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>(...callbacks: (ElementRefObject<T> | Ref<T>)[])
{
	const ref = useRef<T | null>(null);
	const saveRef = useCallback<RefCallback<T>>((newRef) =>
	{
		const cleanup = callbacks.map(callback =>
		{
			if (typeof callback === "function")
				return (callback(newRef));
			else if (callback && "current" in callback)
			{
				callback.current = newRef;
				return (() => {callback.current = null});
			}
			else if (callback && "saveRef" in callback && typeof callback.saveRef === "function")
				return (callback.saveRef(newRef));
		});

		ref.current = newRef;
		return (() =>
		{
			ref.current = null;
			cleanup.forEach(cleanup => cleanup?.());
		})
	}, [callbacks]);

	return (useMemo<ElementRefObject<T>>(() =>
	({
		saveRef,
		ref
 	}), [saveRef]));
}
