import {} from 'https://denopkg.com/gnlow/deno-fp-ts/src/HKT.ts'
import { flow, pipe } from "https://denopkg.com/gnlow/deno-fp-ts/src/function.ts"
import * as T from "https://denopkg.com/gnlow/deno-fp-ts/src/Task.ts"

import { stringify } from "https://deno.land/std@0.130.0/encoding/csv.ts"

const parse = (t: string) => pipe(
    t,
    JSON.parse,
    ({data}) => data,
    // as => as.map(({이름, 건수}: any) => [이름, 건수]),
    data => stringify(
        data,
        ["이름", "건수"]
    ),
    p => () => p
)
const write =
    (name: string) =>
    (data: string) => 
    () => Deno.writeTextFile(name, data)
const simple = 
    (name: string, year: string) =>
    pipe(
        () => Deno.readTextFile(name + ".json"),
        T.chain(parse),
        T.chain(write(`${name}/${year}.csv`)),
    )

for await (const dir of Deno.readDir("./")) {
    if (dir.isDirectory) {
        await simple("boy", dir.name)()
        await simple("girl", dir.name)()
    }
}