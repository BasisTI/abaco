export interface JSONable<T> {
    toJSONState(): T;
    copyFromJSON(json: any);
}
