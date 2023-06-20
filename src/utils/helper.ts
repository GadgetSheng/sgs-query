// /translate:\{(.*?),?\}[\},]/g
const REGEX_TRANSLATE = /translate:[{](.*?),?[}],?[}]/g;

const REGEX_HERO = /character:\{(.*?),?\},/g;

export function regexMatch(key: string, origin: string,type=1) {
    let result: Record<string, any> = {};
    const source = origin.replaceAll(/\/\/.*$/gm, '').replaceAll(/\s/g, '');
    const match= new RegExp(type===1 ? REGEX_TRANSLATE : REGEX_HERO).exec(source);
    if (match && match[1]) {
        let text = match[1];
        if (text.endsWith(',')) text = origin.slice(0, -1);
        result = evalParse(text, key, type);
    } else {
        console.log('===>not-match', key, type)
    }
    return result;
}

function evalParse(match: string, key: string,type=1) {
    const name = key + (type===1?'_dict':'_heros');
    let result: Record<string, any> = {};
    try {
        // if (key === 'refresh' && type === 2) console.log('===>match\r\n', regular);
        eval(`window.__JSON_${name}={${match}}`);
        // @ts-expect-error __JSON
        result = window[`__JSON_${name}`];
        // @ts-expect-error __JSON
        window[`__JSON_${name}`] = null;
    } catch (error) {
        console.warn('EVAL.ERROR', key, error);
        if(key==='shenhua') console.error(match);
    }
    return result;
}

export function regexTest(origin:string){
    const text = origin.replaceAll(/\/\/.*$/gm, '').replaceAll(/\s/g, '');
    // console.log(text);
    const match = REGEX_TRANSLATE.exec(text);
    if(match && match[1]){
        console.log('match');
        return match[1];
    }else {
        console.warn('not match');
        return 'error';
    }
}