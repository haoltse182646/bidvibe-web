import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createApi } from './api';
import Landing from './Landing';
import Admin from './Admin';
import './styles.css';

function App() {
  const [route, setRoute] = useState(location.hash);
  const [session, setSession] = useState(null);
  const isAdmin = route.startsWith('#/admin');
  // Keep credentials in memory only. Refreshing the page asks the administrator to sign in again.
  const api = React.useMemo(() => createApi(import.meta.env.VITE_API_BASE_URL || 'https://bidvibe-be.onrender.com', () => session?.token, () => setSession(null)), [session]);
  useEffect(() => {
    const change = () => setRoute(location.hash);
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => { document.title = isAdmin ? 'BidVibe — Quản trị' : 'BidVibe — Món đồ độc đáo. Trải nghiệm xứng đáng.'; window.scrollTo(0, 0); }, [isAdmin]);
  return isAdmin ? <Admin api={api} session={session} setSession={setSession} /> : <Landing />;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
