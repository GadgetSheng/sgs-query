import { useCallback, useState } from 'react'
import { initData, resetData, queryCard } from './utils/fetcher';
import Card from './components/Card';

function App() {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState({});
  const [hero, setHero] = useState<any>(null);
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
    queryCard(query).then(hero => {
      setHero(hero);
    });
  }, [query]);
  const onQueryChange = useCallback((e) => setQuery(e.target?.value), []);
  return (
    <>
      <h1>SGS-QUERY</h1>
      <button onClick={onInitData}>初始化读取数据</button>
      <button onClick={onClearAll}>清空数据库</button>
      <div>
        {fetching ? "fetching..." : JSON.stringify(data)}
      </div>
      <input type="text" value={query} onChange={onQueryChange} />
      <button onClick={onQuery}>查询</button>
      <hr />
      <Card hero={hero} />
    </>
  )
}

export default App
