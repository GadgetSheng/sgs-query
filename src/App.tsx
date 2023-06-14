import { useCallback, useState } from 'react'
import localforage from 'localforage';
localforage.config({
  driver: [ localforage.INDEXEDDB, localforage.WEBSQL],
  name: 'sanguosha-query'
})

const REGEX_TRANSLATE=/translate:\{([.\s\S]+),?\},/g;

function App() {
  const [fetching, setFetching] = useState(false)
  const [data,setData]=useState({});
  const onInitData=useCallback(async ()=>{
    setFetching(true);
    const count =await localforage.length();
    if(count){
      const value=await localforage.getItem('refresh');
      setData(value as any);
      console.log('count',count);
      setFetching(false);
      return;
    }
    fetch('https://raw.githubusercontent.com/RainEggplant/noname/pwa/character/refresh.js')
    .then(resp=>resp.text())
    .then(text=>{
      const match=REGEX_TRANSLATE.exec(text);
      let result="match-error";
      if(match && match[1]){
        // console.log(match[1]);
        eval(`window.__JSON={${match[1].trim().slice(0,-1)}}`);
        // @ts-expect-error __JSON
        result=window.__JSON;
        console.log(result);
        localforage.setItem('refresh',result).then((value)=>{
          console.log('save to db',value);
        })
      }
      setData(result);
      // console.log(text);
    }).catch(err=>setData(err.message))
    .finally(()=>setFetching(false));
  },[]);

  return (
    <>
      <h1>SGS-QUERY</h1>
      <button onClick={onInitData}>初始化读取数据</button>
      <div>
      {fetching ? "fetching...": JSON.stringify(data) }
      </div>
    </>
  )
}

export default App
