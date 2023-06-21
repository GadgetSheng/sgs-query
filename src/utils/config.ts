export const GIT_FILE_LIST: string[] = [
  // 'clan', // 士族
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
];

export const FILE_PREFIX = 'https://raw.githubusercontent.com/RainEggplant/noname/pwa/character/';
export const CDN_FILE_PREFIX = 'https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/character/';
// https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/character/old.js

// https://raineggplant.github.io/noname/image/character/re_zhoucang.jpg
export const IMG_PREFIX = 'https://raineggplant.github.io/noname/image/character/';
export const CDN_IMG_PREFIX= 'https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/image/character/'
// https://cdn.jsdelivr.net/gh/RainEggplant/noname@pwa/image/character/re_zhoucang.jpg



export const PACKAGE_MAP: Record<string, string> = {
  'shenhua': '神话再临', // 
  'old': '旧版', // 旧版`
  'standard': '标准',
  'sp': 'SP', // SP
  'sp2': 'SP2', // SP2
  'xinghuoliaoyuan': '星火燎原', // 星火燎原
  'yijiang': '一将成名', // 一将成名
  'yingbian': '应变', // 应变
  'refresh': '新重制', // 重置
}


// Root endpoint is always https://cdn.jsdelivr.net
// jsdelivr RULES= https://cdn.jsdelivr.net/gh/user/repo@version/file