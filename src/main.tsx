import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerRoot } from 'remotion';
import App from './App.tsx';
import { RemotionRoot } from './video/Root';
import './index.css';

// Register the Remotion root
registerRoot(RemotionRoot);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);