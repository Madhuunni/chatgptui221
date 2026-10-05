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
      content: 'Here are the details for your request.',
      details: {
        "SR #": "JJCAN11028053Critical1llness",
        "Total Gross OVP": "4200.0",
        "PC Recovered": "500.0",
        "Balance Due": "3381.64",
        "Number of installment": "4",
        "Dedcution Recovered": "0.0",
        "Total Net OVP": "3881.64",
        "Earnings Recovered": "0.0",
        "Date Created": "Wed Aug 19 00:00:00 UTC 2026",
        "Gross/Net": "N"
      }
      // Add report: { url: '/api/reports/123/download', fileName: 'report.xlsx' }
      // here when your backend also returns a generated report.
    };
  }
}
