import { computed, inject, Injectable, signal } from '@angular/core';
import { ChatService } from './chat.service';
import { Conversation, Message, isResponseDetails } from './chat.models';
const KEY = 'angular-chat-ui.conversations.v1';
@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly api = inject(ChatService);
  readonly conversations = signal<Conversation[]>(this.restore());
  readonly activeId = signal<string | null>(null);
  readonly active = computed(() => this.conversations().find(c => c.id === this.activeId()));
  readonly messages = computed(() => this.active()?.messages ?? []);
  readonly busy = signal(false);
  readonly error = signal('');
  private controller?: AbortController;

  newChat(): void { this.stop(); this.activeId.set(null); this.error.set(''); }
  select(id: string): void { this.stop(); this.activeId.set(id); this.error.set(''); }
  remove(id: string): void {
    if (this.activeId() === id) this.newChat();
    this.conversations.update(items => items.filter(c => c.id !== id));
    this.persist();
  }
  stop(): void { this.controller?.abort(); this.controller = undefined; this.busy.set(false); }
  async send(raw: string): Promise<void> {
    const content = raw.trim();
    if (!content || this.busy()) return;
    this.error.set('');
    let id = this.activeId();
    if (!id) {
      id = crypto.randomUUID();
      this.conversations.update(items => [{ id: id!, title: content.slice(0, 48), updatedAt: Date.now(), messages: [] }, ...items]);
      this.activeId.set(id);
    }
    this.append(id, { id: crypto.randomUUID(), role: 'user', content });
    const controller = new AbortController();
    this.controller = controller;
    this.busy.set(true);
    try {
      const response = await this.api.reply(content, controller.signal);
      if (!controller.signal.aborted) this.append(id, { id: crypto.randomUUID(), role: 'assistant', content: response.content, report: response.report, details: response.details });
    } catch (error) {
      if (!controller.signal.aborted) this.error.set('Could not get a response. Please send your message again.');
    } finally {
      if (this.controller === controller) { this.busy.set(false); this.controller = undefined; }
    }
  }
  private append(id: string, message: Message): void {
    this.conversations.update(items => items.map(c => c.id === id ? { ...c, updatedAt: Date.now(), messages: [...c.messages, message] } : c).sort((a, b) => b.updatedAt - a.updatedAt));
    this.persist();
  }
  private persist(): void {
    try { localStorage.setItem(KEY, JSON.stringify(this.conversations())); }
    catch { this.error.set('Browser storage is unavailable or full. This session’s new changes may not be saved.'); }
  }
  private restore(): Conversation[] {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      if (!Array.isArray(data)) return [];
      return data.filter((c): c is Conversation => c && typeof c.id === 'string' && typeof c.title === 'string' && typeof c.updatedAt === 'number' && Array.isArray(c.messages) && c.messages.every((m: Message) => m && typeof m.id === 'string' && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && (m.details === undefined || isResponseDetails(m.details)) && (m.report === undefined || (m.report && typeof m.report.url === 'string' && typeof m.report.fileName === 'string'))));
    } catch { return []; }
  }
}
