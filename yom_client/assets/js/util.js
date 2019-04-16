const copyList = (arr) => {
    return arr.map((e)=>{
        if(typeof e === 'object'){
            return Object.assign({},e)
        }else{
            return e
        }
    })
}
export {
    copyList
}
