import { useCallback, useState } from 'react'
import ReactJson from 'react-json-view';
import { resetData } from './utils/store';
import CardList from './components/CardList';
import { initAll,queryCards, simpleTest } from './utils/task';

function App() {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState({});
  const [heros, setHeros] = useState<any>(null);
  const [query, setQuery] = useState('');
  const onInitAll = useCallback(async () => {
    setFetching(true);
    const result = await initAll();
    setData(result);
    setFetching(false);
  },[])
  const onTest= useCallback(async()=>{
    const result=await simpleTest();
    setData(result as any);
  },[])
  const onClearAll = useCallback(() => {
    const confirm = window.confirm("确定要清空数据库吗？");
    if (confirm) resetData();
  }, [])
  const onQuery = useCallback(() => {
    if (!query) return;
    if (query.length < 1) return;
    queryCards(query).then(results => {
      setHeros(results);
    });
  }, [query]);
  const onQueryChange = useCallback((e: any) => setQuery(e.target?.value), []);

  return (
    <div className="w-screen h-screen">
      <h1>SGS-QUERY</h1>
      <button onClick={()=>onTest()}>TEST</button>
      <button onClick={onInitAll}>新初始化</button>
      <button onClick={onClearAll}>清空数据库</button>
      <div>
        {fetching ? "fetching..." : (
        <ReactJson 
          src={data} 
          enableClipboard={false}
          displayDataTypes={false}
          theme="hopscotch"
        />
        )}
      </div>
      武将名称/拼音
      <input type="text" value={query} onChange={onQueryChange} placeholder='至少一字符' />
      <button onClick={onQuery}>查询</button>
      <hr />
      <CardList heros={heros} />
    </div>
  )
}

export default App
