export interface ReportDownload { url: string; fileName: string; }
export interface ChatReply { content: string; report?: ReportDownload; }
export interface Message extends ChatReply { id: string; role: 'user' | 'assistant'; }
export interface Conversation { id: string; title: string; updatedAt: number; messages: Message[]; }
