import { useCallback, useEffectEvent, useMemo, useRef, type RefCallback } from "react";
import { useIsomorphicLayoutEffect } from "../utils";
import type { MultiElementRefObject } from "./useMultiElementRef";

export type UseMultiElementEventListenerCallback<K extends keyof HTMLElementEventMap> = (this: HTMLElement, event: HTMLElementEventMap[K], ref: HTMLElement, refs: Map<string, HTMLElement>) => any
export function useMultiElementEventListener<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(type: K, listener: UseMultiElementEventListenerCallback<K>, options?: boolean | AddEventListenerOptions, keyName?: string)
{
	const eventListener = useEffectEvent((refObject: HTMLElement) =>
	{
		// eslint-disable-next-line react-hooks/unsupported-syntax
		return (function (this: HTMLElement, event: HTMLElementEventMap[K])
		{
			if (ref.current)
				listener.call(this, event, refObject, ref.current);
		})
	});
	const ref = useRef<Map<string, HTMLElement>>(new Map());
	const getElement = useCallback((key?: string) => ref.current.get(key ?? "") ?? null, []);
	const saveRef = useCallback<RefCallback<HTMLElement>>((newRef) =>
	{
		let key = newRef?.dataset[keyName ?? "key"] ?? "default";

		if (newRef)
			ref.current.set(key, newRef);
		return (() => {ref.current.delete(key)});
	}, [keyName]);

	useIsomorphicLayoutEffect(() =>
	{
		const refStore = ref.current;

		refStore.forEach(ref => ref.addEventListener(type, eventListener(ref), options));
		return (() => refStore.forEach(ref => ref.removeEventListener(type, eventListener(ref), options)));
	}, [options, type]);

	return (useMemo<MultiElementRefObject<HTMLElement>>(() =>
	({
		saveRef,
		getElement,
		ref
	}), [getElement, saveRef]));
}
