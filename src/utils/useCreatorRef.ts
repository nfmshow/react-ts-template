import { useRef } from "react";

interface RefType<ValueType> {
	current: ValueType;
}

interface CustomRef<ValueType> {
	getter: () => ValueType;
	value?: RefType<ValueType>;
}

export default function useRef2<ValueType>(func: (() => ValueType)): RefType<ValueType> {
	const ref = useRef<CustomRef<ValueType>>({ getter: func });
	if (typeof(ref.current.value) === "undefined") {
		ref.current.value = { current: ref.current.getter() };
	}
	return ref.current.value;
}
