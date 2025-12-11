import { useEffect } from "react";

export function useDocumentEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions)
{
	useEffect(() =>
	{
		const target = typeof document !== "undefined" ? document : undefined;

		target?.addEventListener(type, listener, options);
		return (() => target?.removeEventListener(type, listener, options));
	}, [listener, options, type]);
}
