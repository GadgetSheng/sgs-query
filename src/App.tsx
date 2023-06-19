import { useCallback, useState } from 'react'
import { initData, resetData, queryCards, initFile } from './utils/fetcher';
import CardList from './components/CardList';
import { FILE_PREFIX, GIT_FILE_LIST } from './utils/config';

function App() {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState({});
  const [heros, setHeros] = useState<any>(null);
  const [query, setQuery] = useState('');
  const onInitFile = useCallback(async (fileName: string) => {
    setFetching(true);
    const result = await initFile(fileName);
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
  const onQueryChange = useCallback((e: any) => setQuery(e.target?.value), []);
  const renderInitButtons = () => GIT_FILE_LIST.map((fileName: string, i: number) => (
    <button key={i} onClick={() => onInitFile(fileName)}>init [{fileName}]</button>
  ));

  return (
    <div className="w-screen h-screen">
      <h1>SGS-QUERY</h1>
      {renderInitButtons()}
      <hr />
      <button onClick={onClearAll}>清空数据库</button>
      <div>
        {fetching ? "fetching..." : JSON.stringify(data)}
      </div>
      武将名称/拼音
      <input type="text" value={query} onChange={onQueryChange} placeholder='至少两字符' />
      <button onClick={onQuery}>查询</button>
      <hr />
      <CardList heros={heros} />
    </div>
  )
}

export default App
