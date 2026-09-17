let pyodidePromise: Promise<PyodideLike> | null = null;

type PyodideLike = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideLike>;
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar o motor Python"));
    document.head.appendChild(s);
  });
}

export async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const url = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/";
      await loadScript(`${url}pyodide.js`);
      if (!window.loadPyodide) throw new Error("Pyodide indisponível");
      return window.loadPyodide({ indexURL: url });
    })();
  }
  return pyodidePromise;
}

export async function runPython(code: string) {
  const py = await getPyodide();
  let out = "";
  py.setStdout({
    batched: (s) => {
      out += s;
    },
  });
  py.setStderr({
    batched: (s) => {
      out += s;
    },
  });
  try {
    await py.runPythonAsync(code);
    return { ok: true as const, output: out.trim() || "(sem saída)" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false as const, output: `${out}\n${msg}`.trim() };
  }
}
