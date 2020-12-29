import { DependencyList, useEffect, useState } from "react"

export type WASM = typeof import("./crate")

export function useCrate() {
    const [wasm, setWasm] = useState(undefined as unknown)

    useEffect(() => {
        ;(async () => {
            const mod = await import("./crate")
            setWasm(mod)
        })()
    }, [])

    return wasm as WASM
}

/**
 * Waits asynchronously and executes the function when all given dependency is available (Not falsy)
 */
export function useTakeEffect(fn: () => void | (() => void), deps: DependencyList) {
    useEffect(() => {
        if (deps.some((d) => !d)) return
        const destructor = fn()
        return () => {
            destructor && destructor()
        }
    }, deps)
}
