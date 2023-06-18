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
        return cache.length;
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
        return counts;
    } catch (error) {
        console.log('promise.all', error);
        return 'error';
    }
}

async function resetData() {
    localforage.clear();
}

async function queryCard(where: string) {
    let result = null;
    for (const fileName of GIT_FILE_LIST) {
        console.log(fileName, where);
        const heros: any = await localforage.getItem(fileName);
        if (heros && heros.length) {
            if (fileName === 'xinghuoliaoyuan') {
                console.log(heros);
            }
            const hero = heros.find((hero: any) => {
                return hero.key.indexOf(where) >= 0
                    || (hero.name && hero.name.indexOf(where) >= 0)
            });
            if (hero) {
                result = hero;
                result.from = fileName;
                break;
            }
        }
    }
    console.log(result);
    return result;
}

export { initData, resetData, queryCard }