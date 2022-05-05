export default function(timeout: number): Promise<void> {
	return new Promise((resolve: AnyFunction) => setTimeout(resolve, timeout));
}