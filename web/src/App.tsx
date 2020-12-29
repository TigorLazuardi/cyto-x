import React, { useState } from "react"
import { useCrate, useTakeEffect } from "wasm"

const App = () => {
    const crate = useCrate()
    const [greet, setGreet] = useState("")

    useTakeEffect(() => {
        const hello = crate.greet("Tigor")
        setGreet(hello)
    }, [crate])
    return (
        <div>
            <p>{greet}</p>
            <p>Hello World!</p>
        </div>
    )
}

export default App
