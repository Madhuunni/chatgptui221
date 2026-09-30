# Angular 21 Chat UI

A standalone, zoneless Angular 21 project with a ChatGPT-inspired sidebar and central chat panel. This is an independent UI implementation, not an official OpenAI application.

## Run

This version supports Node.js 22.14.0. Angular 21 requires Node.js ^20.19.0, ^22.12.0, or ^24.0.0. The included `.nvmrc` selects 22.14.0 when using nvm.

```bash
npm install
npm start
```

Open http://localhost:4200. For a different port: `npm start -- --port 4300`.

```bash
npm run build
```

Production output: `dist/angular-chat-ui/browser/`.

## Included

- Responsive left sidebar with a mobile drawer and collapse controls.
- Central chat panel with welcome prompts and multi-line message composer.
- Enter to send; Shift+Enter for a new line; IME composition support.
- New conversations, search, select and delete history.
- Local browser persistence for conversations and appearance.
- Light and dark themes, copy response, simulated loading and stop controls.
- Accessible labels, keyboard focus states and reduced-motion support.
- Angular signals, standalone components, strict template checking, and CSS without a UI framework.

## Structure

```text
src/app/
  app.component.ts            Main layout and composer behavior
  app.component.html          Welcome, messages, composer
  sidebar/                    Menu, history, search, theme controls
  shared/icon.component.ts    Local SVG icons
  core/chat.models.ts         Conversation and message types
  core/chat.store.ts          State, persistence and request cancellation
  core/chat.service.ts        Demo response implementation / backend integration point
src/styles.css                Themes and responsive styles
```

## Connect a real backend

The demo service returns a typed `ChatReply` with message text and report metadata:

```ts
{
  content: 'The report has been generated for the given criteria.',
  report: {
    url: 'reports/sample-report.xlsx',
    fileName: 'report.xlsx'
  }
}
```

The template renders an Excel icon and a native download link from `report.url` and `report.fileName`. Responses are interpolated as plain text, with no raw HTML injection. Report metadata is saved with the message so the link remains after reloading.

The bundled workbook is a static sample for demonstrating the download. It does not contain results filtered by the entered criteria. Replace `ChatService.reply()` with your backend call, return `Promise<ChatReply>`, and map your generated workbook's URL into `report.url`. Return the success message only after the backend confirms generation. Use a same-origin URL for the native download attribute, or serve cross-origin downloads with `Content-Disposition: attachment`. Persist durable report URLs, not temporary blob URLs; refresh expired signed URLs through your backend if necessary. Keep API keys server-side.

Chats are stored under `angular-chat-ui.conversations.v1` in localStorage. Delete individual chats from the sidebar, or clear that key to reset all history. No data is sent to a server in demo mode.

Angular compatibility reference: https://angular.dev/reference/versions

## Verification

A clean `npm ci` and production `npm run build` passed using Node.js 22.14.0, Angular/core/CLI/build 21.2.24, and TypeScript 5.9.3. Browser interaction checks were performed on the original Angular 22 version; they were not repeated for this dependency update. The UI source and preview images are unchanged.

## Update from the earlier Angular 22 download

Extract this updated archive into a fresh folder, then run `npm ci` and `npm start`. If updating an existing checkout, replace `package.json` and `package-lock.json` with the supplied versions and run `npm ci`; it replaces the old installed dependency tree. Angular packages now use the 21.2 release line, and TypeScript uses 5.9.3. No global Angular CLI update is necessary: npm scripts use the project-local CLI.

Report-link update: production build checked with Angular 21.2.24. The packaged preview screenshots show the earlier layout before the report link was added.
