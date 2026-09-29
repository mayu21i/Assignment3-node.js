function longestCommonPrefix(arrOfStrs){
    let prefix = arrOfStrs[0];

    for(let i =  1 ; i < arrOfStrs.length ; i++){
        while(!arrOfStrs[i].startsWith(prefix)){
            prefix = prefix.slice(0 , -1);
            if(prefix === ""){
                return "" ;
            }
        }   
    }
    return prefix
}

console.log(longestCommonPrefix(["flower", "flow", "flight"])); 
console.log(longestCommonPrefix(["dog", "racecar", "car"]));    