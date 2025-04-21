// Define jQuery types
interface JQueryStatic {
  (selector: string | Element | Document | EventTarget): JQuery;
  summernote: {
    ui: {
      button: (options: { contents: string; tooltip: string; className: string; click: () => void }) => { render: () => HTMLElement };
    };
  };
}

interface SummernoteOptions {
  height?: number;
  placeholder?: string;
  styleTags?: string[];
  fontNames?: string[];
  fontNamesIgnoreCheck?: string[];
  callbacks?: {
    onInit?: () => void;
    onChange?: (contents: string) => void;
    // Using any here because the Summernote library's event types don't match TypeScript's standard event types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeydown?: (e: any) => boolean | void;
  };
  buttons?: Record<string, (context: SummernoteContext) => HTMLElement>;
  toolbar?: Array<[string, string[]]>;
}

interface SummernoteContext {
  invoke: (command: string, html: string) => void;
}

interface JQuery {
  summernote(options: SummernoteOptions): JQuery;
  summernote(command: string, html?: string): JQuery;
  each(callback: (this: HTMLElement, index: number, element: HTMLElement) => void): JQuery;
  find(selector: string): JQuery;
  closest(selector: string): JQuery;
  append(element: HTMLElement): JQuery;
  addClass(className: string): JQuery;
  on<K extends keyof HTMLElementEventMap>(event: K, selector: string, handler: (this: HTMLElement, event: HTMLElementEventMap[K]) => void): JQuery;
  on<K extends keyof HTMLElementEventMap>(event: K, handler: (this: HTMLElement, event: HTMLElementEventMap[K]) => void): JQuery;
  on(event: string, selector: string, handler: (this: HTMLElement, event: Event) => void): JQuery;
  on(event: string, handler: (this: HTMLElement, event: Event) => void): JQuery;
  off(event: string, selector: string): JQuery;
  off(event: string): JQuery;
  get(): HTMLElement[];
  get(index: number): HTMLElement;
  length: number;
  [index: number]: HTMLElement;
}

// Add global type declarations for jQuery and Summernote
declare global {
  interface Window {
    jQuery: JQueryStatic;
    $: JQueryStatic;
  }
}
