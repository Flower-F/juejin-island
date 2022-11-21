import { useState } from 'react';

export const Layout = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Layout 1111</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add count</button>
      </div>
    </div>
  );
};
