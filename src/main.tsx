import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import '@/locales/i18n'
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
