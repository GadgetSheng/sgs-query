import localforage from 'localforage';
import { FILE_PREFIX, GIT_FILE_LIST } from "./config";
import { regexMatch, resolveHeros, simpleRegexMatch } from "./helper";

localforage.config({
    driver: [localforage.INDEXEDDB, localforage.WEBSQL],
    name: 'sanguosha-query'
})


async function fetch1file(fileName: string) {
    const key = `dict_${fileName}`;
    const cache: any = await localforage.getItem(key);
    if (cache && cache.length) {
        console.log('dict already cached', fileName);
        return cache.length;
    }
    const url = FILE_PREFIX + fileName + '.js';
    const text: string = await fetch(url).then(resp => resp.text());
    localStorage.setItem(fileName, text);
    const translateMap = regexMatch(fileName, text, 2);
    await localforage.setItem(key, translateMap);
    const heroMap = regexMatch(fileName, text);
    return [fileName, heroMap];
}




async function initData() {
    const promiseList = GIT_FILE_LIST.map((name) => fetch1file(name));
    try {
        const heroMaps = await Promise.all(promiseList);
        console.log(heroMaps.length);
        const counts: number[] = [];
        for (let i = 0; i < heroMaps.length; i++) {
            const [fileName, heroMap] = heroMaps[i];
            const heros = await resolveHeros(fileName, heroMap);
            // console.log('heros', heros);
            await localforage.setItem(fileName, heros);
            counts[i] = heros.length;
        }
        return counts;
    } catch (error) {
        console.log('promise.all', error);
        return 'error';
    }
}

async function initFile(fileName: string) {
    const key = `dict_${fileName}`;
    try {
        let text: string = localStorage.getItem(fileName) || '';
        if (text && text.length) {
            console.log('text already cached', fileName);
        } else {
            const url = FILE_PREFIX + fileName + '.js';
            text = await fetch(url).then(resp => resp.text());
        }
        localStorage.setItem(fileName, text);
        const translateMap = simpleRegexMatch(fileName, text);
        await localforage.setItem(key, translateMap);
        console.log('store [%s] ok', fileName);
        // const heroMap = regexMatch(fileName, text);
        // const heros = await resolveHeros(fileName, heroMap);
        // await localforage.setItem(fileName, heros);
        return 'done';
    } catch (error) {
        console.warn('error', error);
        return 'error';
    }
}

async function resetData() {
    localforage.clear();
    // localStorage.clear();
}

async function queryCards(where: string) {
    const result: any = [];
    for (const fileName of GIT_FILE_LIST) {
        // console.log(fileName, where);
        const heros: any = await localforage.getItem(fileName);
        if (heros && heros.length) {
            const hero = heros.find((hero: any) => {
                return hero.key.indexOf(where) >= 0
                    || (hero.name && hero.name.indexOf(where) >= 0)
            });
            if (hero) {
                const data = { from: fileName, ...hero };
                result.push(data);
                // break;
            }
        }
    }
    console.log(result);
    return result;
}

export { initData, initFile, resetData, queryCards }