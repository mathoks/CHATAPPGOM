export const serilizeString = (data)=>{
console.log(data)
let words = data.toLowerCase().split(" ")
var searchTxt = words[0]
words.shift()
var FilterTxt = words.join(" ")

return {searchTxt, FilterTxt}
}