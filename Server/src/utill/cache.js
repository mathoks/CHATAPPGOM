import filter from "./fiter.js"
export const cache = (key, data, txt)=>{
const save = new Map()

const keys = JSON.stringify(key)
if (save.has(keys)){

return save.get(keys)
}
const result = filter(data, txt)
save.set(keys, result)
console.log(save)
return result
}


