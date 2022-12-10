import React from 'react';

import { RecoilRoot } from 'recoil';

import { createRoot } from 'react-dom/client';
import App from './app/App';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App brand="CeskyRozhlas Miner" authors={['Ondrej Planer']} />
    </RecoilRoot>
  </React.StrictMode>
);
