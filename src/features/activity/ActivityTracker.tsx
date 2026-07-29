import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../../app/AppState';
import { logActivity, startActivitySession } from '../../lib/activity';

export function ActivityTracker() {
  const { session } = useAppState();
  const location = useLocation();
  const route = location.pathname;
  const isTrackedRoute = route.startsWith('/student') || route.startsWith('/teacher');
  const trackedRole = useRef<string | null>(null);

  useEffect(() => {
    if (!session.role) {
      trackedRole.current = null;
      return;
    }
    if (!isTrackedRoute || trackedRole.current === session.role) return;
    trackedRole.current = session.role;
    void startActivitySession(route).catch(() => undefined);
  }, [isTrackedRoute, route, session.role]);

  useEffect(() => {
    if (!session.role || !isTrackedRoute) return;
    void logActivity('page_view', route).catch(() => undefined);
  }, [isTrackedRoute, route, session.role]);

  useEffect(() => {
    if (!session.role || !isTrackedRoute) return;

    const heartbeat = () => void logActivity('heartbeat', route).catch(() => undefined);
    const onVisibilityChange = () => void logActivity(document.hidden ? 'page_hidden' : 'page_visible', route).catch(() => undefined);
    const interval = window.setInterval(heartbeat, 60_000);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isTrackedRoute, route, session.role]);

  return null;
}
