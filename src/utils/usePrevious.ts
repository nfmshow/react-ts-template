import { useEffect, useRef } from "react";

export default function usePrevious<ValueType>(value: ValueType): ValueType | undefined {
	const ref = useRef<ValueType>(value);
	useEffect(function() {
		ref.current = value;
	});
	return ref.current;
}