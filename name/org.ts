import {} from 'https://denopkg.com/gnlow/deno-fp-ts/src/HKT.ts'
import { flow, pipe } from "https://denopkg.com/gnlow/deno-fp-ts/src/function.ts"
import * as T from "https://denopkg.com/gnlow/deno-fp-ts/src/Task.ts"

import { stringify } from "https://deno.land/std@0.130.0/encoding/csv.ts"

const parse = (t: string) => pipe(
    t,
    JSON.parse,
    ({data}) => data,
    // as => as.map(({이름, 건수}: any) => [이름, 건수]),
    /*
    data => stringify(
        data,
        ["이름", "건수"]
    ),
    */
    p => () => p
)
const write =
    (name: string) =>
    (data: string) => 
    () => Deno.writeTextFile(name, data)
const simple = 
    (name: string, year: string) =>
    pipe(
        () => Deno.readTextFile(`${year}/${name}.json`),
        T.chain(parse),
        //T.chain(write(`${name}/${year}.csv`)),
    )

const boy: Record<string, any> = {}
const girl: Record<string, any> = {}
for await (const dir of Deno.readDir("./")) {
    if (dir.isDirectory && dir.name != "boy" && dir.name != "girl") {
        const boyd = await simple("boy", dir.name)() as any
        boyd.forEach(({이름, 건수}: any) => {
            if (! (이름 in boy)) boy[이름] = {}
            boy[이름][dir.name] = 건수
        })
        const girld = await simple("girl", dir.name)() as any
        girld.forEach(({이름, 건수}: any) => {
            if (! (이름 in girl)) girl[이름] = {}
            girl[이름][dir.name] = 건수
        })
    }
}

await Deno.writeTextFile("boy.csv",await stringify(
    Object.entries(boy).map(([name, v]) => ({...v, name})),
    ["name",...Array(12).fill(void 0).map((x,i)=>String(i+2008))]
))
await Deno.writeTextFile("girl.csv",await stringify(
    Object.entries(girl).map(([name, v]) => ({...v, name})),
    ["name",...Array(12).fill(void 0).map((x,i)=>String(i+2008))]
))