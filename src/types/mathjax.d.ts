declare global {
  interface Window {
    MathJax: {
      // Core MathJax v3 functions
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      typeset: (elements?: HTMLElement[]) => void;

      // Conversion functions
      tex2chtml: (latex: string) => Element;
      tex2mmlPromise?: (latex: string) => Promise<string>;

      // Startup and configuration
      startup: {
        promise: Promise<void>;
        pageReady: () => Promise<void>;
        defaultPageReady: () => Promise<void>;
        ready: () => void;
        document: {
          clear: () => void;
          updateDocument: () => void;
        };
      };

      // Configuration objects
      loader: {
        load: string[];
      };
      tex: {
        packages: {
          "[+]": string[];
        };
      };
      chtml?: {
        scale?: number;
      };
      options?: {
        enableMenu?: boolean;
        skipHtmlTags?: string[];
      };

      // Custom extensions (not standard MathJax)
      typesetClear: (elements: HTMLElement[]) => void;
    };
    debugLatex: (latex: string) => Promise<void>;
  }
}

export {};
