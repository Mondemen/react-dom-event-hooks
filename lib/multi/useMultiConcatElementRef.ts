import { useCallback, useMemo, type Ref, type RefCallback } from "react";
import { useMultiElementRef, type MultiElementRefObject } from "./useMultiElementRef";

export function useMultiConcatElementRef<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>(...callbacks: (MultiElementRefObject<T> | Ref<T>)[])
{
	const {ref, saveRef: saveMultiRef, getElement} = useMultiElementRef<T>(useCallback(() => {}, []));
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
		const cleanupMulti = saveMultiRef(newRef);

		return (() =>
		{
			cleanupMulti?.();
			cleanup.forEach(cleanup => cleanup?.());
		})
	}, [callbacks, saveMultiRef]);

	return (useMemo<MultiElementRefObject<T>>(() =>
	({
		saveRef,
		ref,
		getElement
	}), [getElement, ref, saveRef]));
}
