export type Invalid<T> = Error & { __errorMessage: T };
export type AsUniqueArray<
    A extends ReadonlyArray<any>,
    B extends ReadonlyArray<any>,
> = {
    [I in keyof A]: unknown extends {
        [J in keyof B]: J extends I ? never : B[J] extends A[I] ? unknown : never
    }[number] ? Invalid<[A[I], "is repeated"]> : A[I]
};