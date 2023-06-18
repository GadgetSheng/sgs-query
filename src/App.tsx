import { useCallback, useState } from 'react'
import { initData, resetData, queryCards } from './utils/fetcher';
import CardList from './components/CardList';

function App() {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState({});
  const [heros, setHeros] = useState<any>(null);
  const [query, setQuery] = useState('');
  const onInitData = useCallback(async () => {
    setFetching(true);
    const result = await initData();
    setData(result);
    setFetching(false);
  }, []);
  const onClearAll = useCallback(() => {
    const confirm = window.confirm("确定要清空数据库吗？");
    if (confirm) resetData();
  }, [])
  const onQuery = useCallback(() => {
    if (!query) return;
    if (query.length < 2) return;
    queryCards(query).then(results => {
      setHeros(results);
    });
  }, [query]);
  const onQueryChange = useCallback((e) => setQuery(e.target?.value), []);
  return (
    <div className="w-screen h-screen">
      <h1>SGS-QUERY</h1>
      <button onClick={onInitData}>初始化读取数据</button>
      <button onClick={onClearAll}>清空数据库</button>
      <div>
        {fetching ? "fetching..." : JSON.stringify(data)}
      </div>
      武将名称/拼音
      <input type="text" value={query} onChange={onQueryChange} placeholder='至少两字符'/>
      <button onClick={onQuery}>查询</button>
      <hr />
      <CardList heros={heros} />
    </div>
  )
}

export default App
