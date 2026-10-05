export interface ReportDownload { url: string; fileName: string; }
export type DetailValue = string | number | boolean | null;
export type ResponseDetails = Record<string, DetailValue>;
export interface ChatReply { content: string; report?: ReportDownload; details?: ResponseDetails; }

export function isResponseDetails(value: unknown): value is ResponseDetails {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every(item => item === null || typeof item === 'string'
      || typeof item === 'boolean' || (typeof item === 'number' && Number.isFinite(item)));
}
export interface Message extends ChatReply { id: string; role: 'user' | 'assistant'; }
export interface Conversation { id: string; title: string; updatedAt: number; messages: Message[]; }
