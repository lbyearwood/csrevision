import { useEffect } from 'react';
import type { AttemptEvent } from '../../types/domain';

const keyMap: Record<string, AttemptEvent['eventType']> = {
  copy: 'copy_attempt',
  paste: 'paste_attempt',
  cut: 'cut_attempt',
  contextmenu: 'right_click_attempt',
};

export function AntiCheatLayer({
  attemptId,
  onLog,
}: {
  attemptId: string;
  onLog: (attemptId: string, eventType: AttemptEvent['eventType']) => void | Promise<void>;
}) {
  useEffect(() => {
    const blockEvent = (event: Event) => {
      event.preventDefault();
      const eventType = keyMap[event.type];
      if (eventType) onLog(attemptId, eventType);
    };
    const blockPrint = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        onLog(attemptId, 'print_attempt');
      }
    };
    const beforePrint = () => onLog(attemptId, 'print_attempt');
    const visibility = () => {
      if (document.hidden) onLog(attemptId, 'tab_hidden');
    };
    const blur = () => onLog(attemptId, 'window_blur');
    const leave = () => onLog(attemptId, 'page_leave_attempt');

    for (const eventName of Object.keys(keyMap)) {
      document.addEventListener(eventName, blockEvent);
    }
    window.addEventListener('keydown', blockPrint);
    window.addEventListener('beforeprint', beforePrint);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', blur);
    window.addEventListener('beforeunload', leave);

    return () => {
      for (const eventName of Object.keys(keyMap)) {
        document.removeEventListener(eventName, blockEvent);
      }
      window.removeEventListener('keydown', blockPrint);
      window.removeEventListener('beforeprint', beforePrint);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', blur);
      window.removeEventListener('beforeunload', leave);
    };
  }, [attemptId, onLog]);

  return null;
}
