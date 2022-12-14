import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import siteData from 'island:site-data';

function renderInBrowser() {
  console.log('siteData: ', siteData);
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(
    <Router>
      <App />
    </Router>,
  );
}

renderInBrowser();
