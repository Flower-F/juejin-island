import A from '../../docs/guide/a';
import B from '../../docs/guide/b';
import Index from '../../docs/guide/index';
import { RouteObject, useRoutes } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/guide',
    element: <Index />,
  },
  {
    path: '/guide/a',
    element: <A />,
  },
  {
    path: '/guide/b',
    element: <B />,
  },
];

export const Content = () => {
  const rootElement = useRoutes(routes);
  return rootElement;
};
