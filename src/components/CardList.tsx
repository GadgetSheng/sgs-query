import React from 'react';
import { IMG_PREFIX_MAP } from '../utils/config';
import { GenderMap, NationEnum, NationMap, Skill } from '../utils/domain';


const Filled=React.memo(()=>( <i className="i-carbon-favorite-filled inline-block v-mid c-#999"></i> ));
const Empty=React.memo(()=>( <i className="i-carbon-favorite inline-block v-mid c-#999"></i> ));

function Magatama(props:any){
  const {hp=''}=props;
  const [have,full]=String(hp).split('/');
  const current=Number(have);
  const total=Number(full);
  if(isNaN(current)) return <>{hp}</>;
  if(isNaN(total)){
    if(current<=6){
      return (<> {Array.from({length:current}).map((_,i)=>(<Filled key={i}/>))} </>);
    }
    return <><Filled/>x {current}</>
  }
  return (<>
    {Array.from({length:current}).map((_,i)=>(<Filled key={i}/>))}
    {Array.from({length:(total-current)}).map((_,i)=>(<Empty key={i}/>))}
  </>)
}


function CardList(props: any) {
  const { heros, setSkill, setName } = props;
  if (!heros || !heros.length) return <div className="mx-4">EMPTY</div>;
  const renderSkills = (skills: any[]) => {
    if (!skills.length) return null;
    return skills.map((skill: Skill, i) => {
      const { key: skillKey, name, desc } = skill;
      return (
        <li key={i} className="mt-2 rd-r-2 bg-[wheat] p-1 lh-normal c-#333" title={skillKey}>
          <span 
            className="b-1 b-#666 rd-r-full b-solid bg-gray-200 px-1 fw-bold"
            onClick={()=>setSkill(name)}
          >{name}</span>
          &nbsp;
          <span>{desc}</span>
        </li>
      )
    })
  };
  const useCDN=localStorage.getItem('useCDN') ?? '';
  const renderHeros = () => {
    return heros.map((hero: any, i: number) => {
      const { from, gender, hp, key, name, pinyin, nation, skills = [] } = hero;
      const prefix=IMG_PREFIX_MAP[useCDN] || IMG_PREFIX_MAP.default;
      const heroUrl = prefix + key + '.jpg';
      let bColor="";
      switch(nation){
        case NationEnum.wei:
          bColor='b-blue-300';
          break;
        case NationEnum.shu:
          bColor='b-red-300';
          break;
        case NationEnum.wu:
          bColor='b-green-300';
          break;
        case NationEnum.qun:
          bColor='b-yellow-300';
          break;
        case NationEnum.jin:
          bColor='b-purple-300';
          break;
        default: break;
      }
      // classList.push(bColor);
      const imgCls=["mt-3 h-38 w-30 b-2 b-groove bg-cover shadow-md rd-2"];
      imgCls.push(bColor);
      return (
        <div key={i} className="mx-3 box-border flex flex-row b-1 b-#ccc rd-2 b-solid bg-transparent px-3 py-1 shadow-xl">
          <div className="min-w-32 flex flex-col">
            <img className={imgCls.join(' ')} src={heroUrl} alt={key} ></img>
            {key}
          </div>
          <div className="p-3 text-3">
            <div className="flex justify-between fw-bold">
              <span className="text-14px" onClick={()=>setName(name)}>{name || pinyin}</span>
              <i>[{from}]</i>
            </div>
            <div>
              {GenderMap[gender]} <Magatama hp={hp} /> {hp} {NationMap[nation]}
            </div>
            <ul className="xSkills">
              {renderSkills(skills)}
            </ul>
          </div>
        </div>
      )
    });
  }
  return (
    <div className="h-full max-w-160 w-full flex flex-col gap-4">
      <div className="mx-4 p-2">总数：{heros.length}</div>
      {renderHeros()}
    </div>
  )
}

export default CardList;