export const GIT_FILE_LIST: string[] = [
  // 'mobile', // 移动
  // 'sb', // 谋攻s
  'shenhua', // 神话再临
  'old', // 旧版`
  'standard',
  'sp', // SP
  'sp2', // SP2
  'xinghuoliaoyuan', // 星火燎原
  'yijiang', // 一将成名
  'refresh', // 重置
  'yingbian', // 应变
  // 'clan',
];

const FILE_PREFIX = 'https://raw.githubusercontent.com/RainEggplant/noname/pwa/';
const CDN_FILE_PREFIX = 'https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/';
const ESM_FILE_PREFIX = 'https://esm.sh/v126/gh/RainEggplant/noname@pwa/es2022/';
// https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/character/old.js

export const FILE_PREFIX_MAP:Record<string,string>={
  default: FILE_PREFIX,
  '1': CDN_FILE_PREFIX,
  '2': ESM_FILE_PREFIX,
}

// https://raineggplant.github.io/noname/image/character/re_zhoucang.jpg
const IMG_PREFIX = 'https://raineggplant.github.io/noname/image/character/';
const CDN_IMG_PREFIX= 'https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/image/character/';
const ESM_IMG_PREFIX= 'https://esm.sh/gh/RainEggplant/noname@pwa/image/character/';
// https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/image/character/re_zhoucang.jpg

export const IMG_PREFIX_MAP:Record<string,string> = {
  default: IMG_PREFIX,
  '1': CDN_IMG_PREFIX,
  '2': ESM_IMG_PREFIX,
}


export const PACKAGE_MAP: Record<string, string> = {
  'shenhua': '神话再临', // 
  'old': '旧版', // 旧版`
  'standard': '标准',
  'sp': 'SP', // SP
  'sp2': 'SP2', // SP2
  'xinghuoliaoyuan': '星火燎原', // 星火燎原
  'yijiang': '一将成名', // 一将成名
  'yingbian': '应变', // 应变
  'refresh': '界限突破', // 重置
  // 'clan': '名门士族',
  // 'mobile': '手杀' // ERROR: 存在 qiaosi_c1:'<imgsrc="'+lib.assetURL+'image/card/qiaosi_card1.png"width="60"height="60">'
}


// Root endpoint is always https://cdn.jsdelivr.net
// jsdelivr RULES= https://cdn.jsdelivr.net/gh/user/repo@version/file