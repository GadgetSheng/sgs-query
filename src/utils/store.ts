import localforage from "localforage";

localforage.config({
    driver: [localforage.INDEXEDDB, localforage.WEBSQL],
    name: 'sanguosha'
});

function resetData(){
    localforage.clear();
    // localStorage.clear();
}

export {
    localforage,
    resetData
}