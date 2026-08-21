import { useEffect, useEffectEvent } from "react";

export function useDocumentEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions)
{
	const eventListener = useEffectEvent(listener);

	useEffect(() =>
	{
		const target = typeof document !== "undefined" ? document : undefined;

		target?.addEventListener(type, eventListener, options);
		return (() => target?.removeEventListener(type, eventListener, options));
	}, [options, type]);
}
