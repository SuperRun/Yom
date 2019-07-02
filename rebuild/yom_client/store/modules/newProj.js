import {copyList} from "static/js/util";

const state = () => ({
    projNameShare: "",
    descriptionShare: "",
    selectedCatsShare:[],
    catTree: [],
    catList: [],
    checkedCatsTree: [],
    timeTotal: 0,
    newProject: {},
    configCatsDbVersion: 0,
    projtype: 0,
    changeTimeCostOptions: {
        parentIndex: 0,
        childIndex: 0,
        slider: 0,
        changedCatId: 0
    }
});

const getters = {
    projNameShare: state => state.projNameShare,
    descriptionShare: state => state.descriptionShare,
    selectedCatsShare: state => state.selectedCatsShare,
    catTree: state => state.catTree,
    catList: state => state.catList,
    timeTotal: state => state.timeTotal,
    checkedCatsTree: state => state.checkedCatsTree,
    newProject: state => state.newProject,
    configCatsDbVersion: state => state.configCatsDbVersion,
    projtype: state => state.projtype
}

const mutations = {
    setProjtype: (state, val) => (state.projtype = val),
    setProjNameShare: (state, payload) => (state.projNameShare = payload),
    setDescriptionShare: (state, payload) => (state.descriptionShare = payload),
    setSelectedCatsShare: (state, payload) => (state.selectedCatsShare = payload),
    setCatTree: (state, payload) => (state.catTree = payload),
    setNewProject: (state, payload) => (state.newProject = payload),
    setCatTreeNode: (state, info) => {
        console.log(state.catTree[info.parentIndex].childNodes[info.childIndex].category);
        if (state.catTree[info.parentIndex].childNodes[info.childIndex].category) {
            for (let key of Object.keys(info.objs)) {
                state.catTree[info.parentIndex].childNodes[info.childIndex].category[key] = info.objs[key];
            }
        } else {
            for (let key of Object.keys(info.objs)) {
                console.log(`key=${key}`);
                state.catTree[info.parentIndex].childNodes[info.childIndex][key] = info.objs[key];
            }
        }
    },
    setCatList: (state, catList) => (state.catList = catList),
    setCatListNode: (state, info) => {
        for (let cat of state.catList) {
            if (cat.id === info.id || cat.catId === info.id){
                console.log('info', info);
                for (let key of Object.keys(info.objs)) {
                    console.log(`cat start ${key}:`, cat[key]);
                    cat.category ? cat.category[key] = info.objs[key] : cat[key] = info.objs[key];
                    console.log(`cat end ${key}:`, cat[key]);
                }
                break;
            }
        }
    },
    setTimeTotal: (state, timeTotal) => (state.timeTotal = timeTotal),
    calculateTimeTotal: (state, costTime) => (state.timeTotal += costTime),
    setCheckedCatsTree: (state, checkedCatsTree) => (state.checkedCatsTree = checkedCatsTree),
    setChangeTimeCostOptions: (state, payload) => (state.changeTimeCostOptions = payload),
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
    },
    convertToCatTree: (state, catList) =>{
        let copyCatList = copyList(catList);

        state.catTree = copyCatList.filter(cat => {
            if(cat.category)
                return cat.category.parentId === null;
            else
                return cat.parentId === null;
        });
        let childNodes = copyCatList.filter(cat => {
            if(cat.category)
                return cat.category.parentId != null;
            else
                return cat.parentId != null;
        });
        for (let cat of state.catTree) {
            Object.assign(cat, {childNodes: []});
            for (let child of childNodes) {
                if (child.category) {
                    if (child.category.parentId === cat.category.id) {
                        cat.childNodes.push(child);
                    }
                }else{
                    if (child.parentId === cat.catId) {
                        cat.childNodes.push(child);
                    }
                }

            }
        }
    },
    convertCheckedCatTree(state){

        let copyCatTree = copyList(state.catTree);
        for (let copyCat of copyCatTree){
            copyCat.childNodes = copyList(copyCat.childNodes);
        }
        for (let i=0; i < copyCatTree.length;) {
            for (let j=0; j< copyCatTree[i].childNodes.length; ) {
                if (!state.selectedCatsShare.find(selectedCat => {
                    if (copyCatTree[i].childNodes[j].category) {
                        return selectedCat === copyCatTree[i].childNodes[j].category.id
                    } else {
                        return copyCatTree[i].childNodes[j].id? selectedCat === copyCatTree[i].childNodes[j].id: selectedCat === copyCatTree[i].childNodes[j].catId;
                    }
                })) {
                    copyCatTree[i].childNodes.splice(j,1);
                    j=0;
                }else{
                    j++;
                }
            }
            if (copyCatTree[i].childNodes.length === 0) {
                copyCatTree.splice(i,1);
                i=0;
            }else{
                i++;
            }
        }
        console.log('copyCatTree');
        console.log(copyCatTree);
        state.checkedCatsTree = copyCatTree;
    },
    updateCatList(state){
        state.catList.map(cat =>{
            state.selectedCatsShare.find(selectedCat => (cat.id?selectedCat === cat.id:selectedCat === cat.catId))?cat.isChecked=1:cat.isChecked=0;
        })
    },
    getSelectedCatsShare(state){
        let selectedCats = state.catList.map(cat=> {
            if(cat.isChecked && cat.parentId){
                return cat.id?cat.id:cat.catId;
            }
        }).filter(cat=>cat);
        state.selectedCatsShare = selectedCats;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
