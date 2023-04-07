export type MaybeNull<T> = T | null;

export type MaybePromise<T> = Promise<T> | T;

export type MaybePromiseOrNull<T> = MaybeNull<MaybePromise<T>>;
