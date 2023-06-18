import { Hero, Skill } from "./domain";

/* eslint-disable @typescript-eslint/no-unused-vars */
const REGEX_TRANSLATE = /translate:\{([\S\s]+?),\s+\},/g;

const REGEX_CH = /character:\{([\S\s]+?),\s+\},/g;

function regexMatch(key: string, text: string, type = 1) {
    const regex = type === 1 ? REGEX_CH : REGEX_TRANSLATE;
    const name = key + '_' + (type === 1 ? 'character' : 'translate');
    const match = regex.exec(text);
    let result: Record<string, string> = {};
    if (match && match[1]) {
        const origin = match[1];
        let regular = origin
            .replaceAll(/\/\/.*$/gm, '')
            .replaceAll(/\s/g, '')
            .trim();
        if (regular.endsWith(',')) regular = regular.slice(0, -1);
        try {
            // if (key === 'refresh' && type === 2) console.log('===>match\r\n', regular);
            eval(`window.__JSON_${name}={${regular}}`);
            // @ts-expect-error __JSON
            result = window[`__JSON_${name}`];
            // @ts-expect-error __JSON
            window[`__JSON_${name}`] = null;
        } catch (error) {
            console.warn(key, type, error);
            console.error(regular);
            return {};
        }
    } else {
        console.log('===>not-match', key, type)
    }
    return result;

}

// async function fetchRawData(fileName: string) {
//     const url = FILE_PREFIX + fileName + '.js';
//     const text: string = await fetch(url).then(resp => resp.text());
//     return text;
// }

// async function getTranslateMap(fileName: string, source: string) {
// const map = regexMatch(fileName, source, 2);
// return map;
// if (fileName !== 'refresh') return map;
// const data1 = await fetchRawData('standard');
// const map1 = regexMatch('standard', data1, 2);
// const data2 = await fetchRawData('yijiang');
// const map2 = regexMatch('yijiang', data2, 2);
// return { ...map1, ...map2, ...map };
// }

export async function resolveHeros(fileName: string, source: string) {
    const heroMap = regexMatch(fileName, source);
    const translateMap = regexMatch(fileName, source, 2);
    const characters: Array<Hero> = [];
    // console.log('resolveHeros', heroMap);
    Object.entries(heroMap).forEach(([id, data]) => {
        // ['female', 'wu', 3, Array(2)]
        const [gender, nation, hp, skills]: any = data;
        const hero: Hero = { key: id, gender, nation, hp };
        hero.name = translateMap[id];
        hero.skills = skills.map((skillName: string) => {
            const name = translateMap[skillName];
            const desc = translateMap[`${skillName}_info`];
            return { key: skillName, name, desc } as Skill;
        });
        characters.push(hero);
    });
    return characters;
}

