import { FILE_PREFIX, GIT_FILE_LIST } from "./config";
import localforage from 'localforage';
import { resolveHeros } from "./helper";

localforage.config({
    driver: [localforage.INDEXEDDB, localforage.WEBSQL],
    name: 'sanguosha-query'
})


async function fetch1file(fileName: string) {
    const cache: any = await localforage.getItem(fileName);
    if (cache && cache.length) {
        console.log('file already cached', fileName);
        return;
    }
    const url = FILE_PREFIX + fileName + '.js';
    const text: string = await fetch(url).then(resp => resp.text());
    const heros = await resolveHeros(fileName, text);
    // console.log('heros', heros);
    localforage.setItem(fileName, heros);
    return heros.length;
}


async function initData() {
    const promiseList = GIT_FILE_LIST.map((name) => fetch1file(name));
    try {
        const counts = await Promise.all(promiseList);
        console.log(counts);
        return "done";
    } catch (error) {
        console.log('promise.all', error);
        return 'error';
    }
}

export {
    initData
}