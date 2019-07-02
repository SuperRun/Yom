import {openDB} from "idb";

const DB_NAME_TYPE = "types-db";
const DB_NAME_CATCONFIG = "configcats-db";
const DB_NAME_PROJ = "projects-db";

const STORE_NAME_TYPE = "types";
const STORE_NAME_CATCONFIG = "configcats";
const STORE_NAME_PROJ = "projects";

async function createIndexedDB(dbName, storeName, version=1) {
    if (process.client) {
        if (!('indexedDB' in window)) {
            return null;
        }
        return await openDB(dbName, version, {
            upgrade(db) {

                if (!db.objectStoreNames.contains(storeName)) {

                    const store = db.createObjectStore(storeName, {
                        keyPath: 'id',
                        autoIncrement: true

                    });

                    if (storeName == 'projects') {
                        store.createIndex('createdAtIndex', 'created_at', {unique: false});
                        store.createIndex('projNameIndex', 'projName', {unique: false});
                    }
                }
            }
        });
    }
}

async function saveDataLocally(db, storeName, datas) {

    if (!('indexedDB' in window)) {return null;}
    // console.log(db);
    const tx = db.transaction(storeName, 'readwrite');
    tx.store.clear();
    for (let data of datas) {
        // console.log(data);
        tx.store.add(data);
    }
    await tx.done;
}

async function addDataLocally(db, storeName, data) {
    if (process.client) {
        if (!('indexedDB' in window)) {return null;}
        // console.log(db);
        const tx = db.transaction(storeName, 'readwrite');
        let dataKey = null;
        tx.store.add(data).then(res=>{
            dataKey = res;
        });
        await tx.done;
        return dataKey;
    }

}

function fetchApi(url , method, data, markId = '') {
    console.log('markId', markId);
    const headers = new Headers(
        {'Content-Type': 'application/json', 'X-Mark-Id': markId}
    );
    const body = JSON.stringify(data);
    return fetch(url, {
        method: method,
        headers: headers,
        body: body
    });
}

async function getLocalData(db, storeName) {
    return await db.getAll(storeName);
}
async function getLocalDataCount(db, storeName) {
    return await db.count(storeName);
}
async function getLocalDataByKeyPath(db, storeName, val) {
    // console.log(`projId=${val}`);
    // console.log(`storeName=${storeName}`);
    // const value = await db.get(storeName, 139);
    // console.log(value);
    return await db.get(storeName, parseInt(val));
}

async function updateProj(db, id, val){
    const tx = db.transaction('projects','readwrite');
    const store= tx.store;
    let cursor = await store.openCursor();
    console.log('id',id);
    while(cursor){
        console.log('key',typeof cursor.key);
        console.log(cursor.key === parseInt(id));
        if (cursor.key === parseInt(id)){
            // cursor.value = proj;
            // if (typeof val === 'number'){
            //     const proj = { ...cursor.value };
            //     proj.id = val;
            //     val = proj;
            // } else{
            //     Object.assign(val, {
            //         id: parseInt(id),
            //         created_at: cursor.value.created_at
            //     });
            // }
            if (typeof val === 'object'){ 
               
                if (Object.keys(val).indexOf('id')=== -1){
                    // 编辑项目后保持indexdb数据一致
                    Object.assign(val, {
                        id: parseInt(id),
                        created_at: cursor.value.created_at
                    });
                } else {
                    // 更改id值 isSaved的值
                    const proj = { ...cursor.value };
                    for(let [key,value] of Object.entries(val)){
                        if (key === 'isSaved' && value){
                            delete proj[key];
                        }else{
                            proj[key] = value;
                        }
                    }
                    val =proj;
                }

            }

            console.log(`val`);
            console.log(val);
            cursor.update(val);
            break;
        }
        cursor = await cursor.continue();
    }
    await tx.done;

}

async function getProjsByDate(db){
   return await db.getAllFromIndex('projects', 'createdAtIndex');
}

async function searchProjs(db, query){
    let datas = await getProjsByDate(db)
    datas.reverse()
    let projs = []
    if (Object.keys(query).length){

        if (query.projName) {
            projs = datas.filter(data=> (data.projName.indexOf(query.projName)!==-1))
        }else{
            projs = datas
        }
        return projs.filter(data => (validateTime(data.created_at, query.startTime, query.endTime)))
    } else {
        return datas
    }
}

function validateTime(time, startTime, endTime){
    if (new Date(time.split('T')[0]) >= new Date(startTime) &&
        new Date(time.split('T')[0]) <= new Date(endTime)) {
        return true
    }else{
        return false
    }
}
/* Storage functions */

function getLastUpdated() {
    return localStorage.getItem('lastUpdated');
}

function setLastUpdated(date) {
    localStorage.setItem('lastUpdated', date);
}

export {
    createIndexedDB,
    saveDataLocally,
    getLocalData,
    getProjsByDate,
    getLocalDataCount,
    searchProjs,
    setLastUpdated,
    addDataLocally,
    updateProj,
    getLocalDataByKeyPath,
    DB_NAME_TYPE,
    DB_NAME_CATCONFIG,
    DB_NAME_PROJ,
    STORE_NAME_TYPE,
    STORE_NAME_CATCONFIG,
    STORE_NAME_PROJ
}