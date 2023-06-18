import { useCallback, useState } from 'react'
import { initData } from './utils/fetcher';

function App() {
  const [fetching, setFetching] = useState(false)
  const [data, setData] = useState({});
  const onInitData = useCallback(async () => {
    setFetching(true);
    const result = await initData();
    setData(result);
    setFetching(false);
  }, []);

  return (
    <>
      <h1>SGS-QUERY</h1>
      <button onClick={onInitData}>初始化读取数据</button>
      <div>
        {fetching ? "fetching..." : JSON.stringify(data)}
      </div>
    </>
  )
}

export default App
