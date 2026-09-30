import { Injectable } from '@angular/core';
import { ChatReply } from './chat.models';

/** Replace this implementation with a call to your server; keep API keys server-side. */
@Injectable({ providedIn: 'root' })
export class ChatService {
  async reply(prompt: string, signal: AbortSignal): Promise<ChatReply> {
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(new DOMException('Stopped', 'AbortError')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 850);
      if (signal.aborted) abort();
      else signal.addEventListener('abort', abort, { once: true });
    });
    return {
      content: 'The report has been generated for the given criteria.\n\nCriteria: ' + prompt,
      report: {
        url: 'reports/sample-report.xlsx',
        fileName: 'report.xlsx'
      }
    };
  }
}
