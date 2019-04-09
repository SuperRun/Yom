const state = () => ({
    projNameShare: "",
    descriptionShare: "",
    selectedCatsShare:[],
    catTree: [],
    catList: [],
    checkedCatsTree: [],
    timeTotal: 0
});

const getters = {
    projNameShare: state => state.projNameShare,
    descriptionShare: state => state.descriptionShare,
    selectedCatsShare: state => state.selectedCatsShare,
    catTree: state => state.catTree,
    catList: state => state.catList,
    timeTotal: state => state.timeTotal,
    checkedCatsTree: state => state.checkedCatsTree
}

const mutations = {
    setProjNameShare: (state, payload) => (state.projNameShare = payload.projName),
    setDescriptionShare: (state, payload) => (state.descriptionShare = payload.description),
    setSelectedCatsShare: (state, payload) => (state.selectedCatsShare = payload.selectedCats),
    setCatTree: (state, catTree) => (state.catTree = catTree),
    setCatList: (state, catList) => (state.catList = catList),
    setTimeTotal: (state, timeTotal) => (state.timeTotal = timeTotal),
    calculateTimeTotal: (state, costTime) => (state.timeTotal += costTime),
    setCheckedCatsTree: (state, checkedCatsTree) => (state.checkedCatsTree = checkedCatsTree),
    initData: (state) => {
        Object.keys(state).forEach(key=>{
            if (typeof state[key] === 'string') state[key] = ''
            else if (typeof state[key] === 'number') state[key] = 0
            else if (typeof state[key] === 'boolean') state[key] = false
            else if (typeof state[key] === 'object') {
                if (state[key] instanceof Array) state[key] = []
                else state[key] = {}
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
