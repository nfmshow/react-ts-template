import { useEffect, useRef } from "react";

export interface RefType<RefObjectType> {
	current: null | RefObjectType;
}

export default function useCustomRef<RefObjectType>(value: RefObjectType): RefType<RefObjectType> {
	const ref = useRef<RefObjectType>(value);
	return ref;
}