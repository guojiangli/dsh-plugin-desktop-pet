window.__ModuleLoader__.load({
  id: "@liguojiang/dsh-plugin-desktop-pet",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/DesktopPet.tsx
var import_react2 = require("react");

// src/client/config.ts
var import_react = require("react");
var STORAGE_KEY = "dsh.desktop-pet.config.v1";
var CHANGE_EVENT = "dsh-desktop-pet/change";
var MAX_IMAGE_BYTES = 2 * 1024 * 1024;
var DEFAULT_CONFIG = Object.freeze({
  enabled: true,
  name: "\u5C0F\u52A9\u624B",
  size: 128,
  motion: "float",
  showProgress: true,
  image: "",
  position: null
});
function sanitizeConfig(value) {
  const source = value !== null && typeof value === "object" ? value : {};
  const position = source.position;
  const validPosition = position !== null && typeof position === "object" && Number.isFinite(position.x) && Number.isFinite(position.y) ? { x: position.x, y: position.y } : null;
  const name = typeof source.name === "string" ? source.name.trim().slice(0, 24) : "";
  const size = Number(source.size);
  return {
    enabled: typeof source.enabled === "boolean" ? source.enabled : DEFAULT_CONFIG.enabled,
    name: name || DEFAULT_CONFIG.name,
    size: Math.min(200, Math.max(96, Number.isFinite(size) ? size : DEFAULT_CONFIG.size)),
    motion: source.motion === "none" || source.motion === "float" || source.motion === "bounce" ? source.motion : DEFAULT_CONFIG.motion,
    showProgress: typeof source.showProgress === "boolean" ? source.showProgress : DEFAULT_CONFIG.showProgress,
    image: typeof source.image === "string" && source.image.startsWith("data:image/") ? source.image : "",
    position: validPosition
  };
}
function readConfig(storage = localStorage) {
  try {
    return sanitizeConfig(JSON.parse(storage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(value, storage = localStorage) {
  const config = sanitizeConfig(value);
  storage.setItem(STORAGE_KEY, JSON.stringify(config));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: config }));
  }
  return config;
}
function usePetConfig() {
  const [config, setConfig] = (0, import_react.useState)(readConfig);
  (0, import_react.useEffect)(() => {
    const onChange = (event) => {
      setConfig(sanitizeConfig(event.detail));
    };
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setConfig(readConfig());
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const update = (0, import_react.useCallback)((patch) => {
    const next = writeConfig({ ...readConfig(), ...patch });
    setConfig(next);
    return next;
  }, []);
  return [config, update];
}

// src/client/default-image.ts
var svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect x="29" y="39" width="102" height="92" rx="32" fill="#fff" stroke="#25272a" stroke-width="7"/>
  <path d="M43 47 33 22l31 19M117 47l10-25-31 19" fill="#79d6c4" stroke="#25272a" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="62" cy="78" r="8" fill="#25272a"/><circle cx="99" cy="78" r="8" fill="#25272a"/>
  <path d="M70 99c6 7 14 7 21 0" fill="none" stroke="#25272a" stroke-width="6" stroke-linecap="round"/>
  <path d="M45 113c-12 4-18 12-17 23M115 113c12 4 18 12 17 23" fill="none" stroke="#25272a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="128" cy="58" r="13" fill="#f7c85e" stroke="#25272a" stroke-width="6"/>
</svg>`;
var DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent(svg)}`;

// src/client/DesktopPet.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function todosOf(projectionValues) {
  if (projectionValues === null || typeof projectionValues !== "object") return [];
  const todos = projectionValues.todos;
  if (!Array.isArray(todos)) return [];
  return todos.filter((item) => {
    if (item === null || typeof item !== "object") return false;
    const value = item;
    return typeof value.content === "string" && (value.status === "pending" || value.status === "in_progress" || value.status === "completed");
  });
}
function clampPosition(position, size) {
  const width = Math.max(0, window.innerWidth - size - 8);
  const height = Math.max(0, window.innerHeight - size - 74);
  return {
    x: Math.min(width, Math.max(8, position.x)),
    y: Math.min(height, Math.max(42, position.y))
  };
}
function defaultPosition(size) {
  return clampPosition({ x: window.innerWidth - size - 28, y: window.innerHeight - size - 96 }, size);
}
function DesktopPet({ useSessions }) {
  const [config, update] = usePetConfig();
  const summary = useSessions((state) => state.current === void 0 ? null : state.byId[state.current] ?? null);
  const todos = todosOf(summary?.projectionValues);
  const done = todos.filter((item) => item.status === "completed").length;
  const active = todos.find((item) => item.status === "in_progress");
  const progress = todos.length > 0 ? Math.round(done / todos.length * 100) : 0;
  const status = active?.content ?? (summary?.running ? "\u6B63\u5728\u5DE5\u4F5C" : todos.length > 0 && done === todos.length ? "\u4EFB\u52A1\u5B8C\u6210" : "\u5F85\u547D\u4E2D");
  const [position, setPosition] = (0, import_react2.useState)(() => config.position ? clampPosition(config.position, config.size) : defaultPosition(config.size));
  const [dragging, setDragging] = (0, import_react2.useState)(false);
  const drag = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    setPosition(config.position ? clampPosition(config.position, config.size) : defaultPosition(config.size));
  }, [config.position?.x, config.position?.y, config.size]);
  (0, import_react2.useEffect)(() => {
    const onResize = () => setPosition((current) => clampPosition(current, config.size));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [config.size]);
  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position
    };
    setDragging(true);
  };
  const onPointerMove = (event) => {
    const current = drag.current;
    if (current === null || current.pointerId !== event.pointerId) return;
    setPosition(clampPosition({
      x: current.origin.x + event.clientX - current.startX,
      y: current.origin.y + event.clientY - current.startY
    }, config.size));
  };
  const finishDrag = (event) => {
    const current = drag.current;
    if (current === null || current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const finalPosition = clampPosition({
      x: current.origin.x + event.clientX - current.startX,
      y: current.origin.y + event.clientY - current.startY
    }, config.size);
    drag.current = null;
    setPosition(finalPosition);
    setDragging(false);
    update({ position: finalPosition });
  };
  if (!config.enabled) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "section",
    {
      className: "dshPetRoot",
      style: { left: position.x, top: position.y, width: config.size },
      "data-motion": config.motion,
      "data-dragging": dragging || void 0,
      "aria-label": `${config.name}\uFF0C${status}`,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshPetBubble", title: status, children: [
          config.name,
          " \xB7 ",
          status
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshPetStage", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              className: "dshPetImage",
              src: config.image || DEFAULT_IMAGE,
              alt: config.name,
              draggable: false,
              onError: (event) => {
                event.currentTarget.src = DEFAULT_IMAGE;
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: "dshPetClose",
              type: "button",
              title: "\u5173\u95ED\u7535\u5B50\u5BA0\u7269",
              "aria-label": "\u5173\u95ED\u7535\u5B50\u5BA0\u7269",
              onClick: () => update({ enabled: false }),
              children: "\xD7"
            }
          )
        ] }),
        config.showProgress && todos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshPetProgress", "aria-label": `\u4EFB\u52A1\u8FDB\u5EA6 ${done}/${todos.length}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshPetTrack", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshPetFill", style: { width: `${progress}%` } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshPetCount", children: [
            done,
            "/",
            todos.length
          ] })
        ] }) : null
      ]
    }
  );
}

// src/client/PetSettings.tsx
var import_react3 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function PetSettings() {
  const [config, update] = usePetConfig();
  const [nameDraft, setNameDraft] = (0, import_react3.useState)(config.name);
  const [message, setMessage] = (0, import_react3.useState)({
    text: "\u652F\u6301 PNG\u3001JPEG\u3001WebP\u3001GIF\uFF0C\u6700\u5927 2 MB",
    error: false
  });
  (0, import_react3.useEffect)(() => setNameDraft(config.name), [config.name]);
  const commitName = () => {
    const name = nameDraft.trim() || DEFAULT_CONFIG.name;
    setNameDraft(name);
    update({ name });
  };
  const onFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6", error: true });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({ text: "\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 2 MB", error: true });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      try {
        update({ image: reader.result });
        setMessage({ text: `\u5DF2\u4F7F\u7528 ${file.name}`, error: false });
      } catch {
        setMessage({ text: "\u6D4F\u89C8\u5668\u5B58\u50A8\u7A7A\u95F4\u4E0D\u8DB3\uFF0C\u8BF7\u6362\u4E00\u5F20\u66F4\u5C0F\u7684\u56FE\u7247", error: true });
      }
    };
    reader.onerror = () => setMessage({ text: "\u56FE\u7247\u8BFB\u53D6\u5931\u8D25", error: true });
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "dshPetSettings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { className: "dshPetSettingsHeader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: "\u684C\u9762\u7535\u5B50\u5BA0\u7269" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u663E\u793A\u5728\u5DE5\u4F5C\u533A\u4E0A\u65B9\uFF0C\u5E76\u8DDF\u968F\u5F53\u524D\u4EFB\u52A1\u5217\u8868\u5C55\u793A\u8FDB\u5EA6\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetSwitch", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "checkbox",
            checked: config.enabled,
            onChange: (event) => update({ enabled: event.target.checked })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: config.enabled ? "\u5DF2\u6253\u5F00" : "\u5DF2\u5173\u95ED" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshPetSettingsGrid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshPetFields", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetField", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u5BA0\u7269\u540D\u79F0" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "input",
            {
              type: "text",
              maxLength: 24,
              value: nameDraft,
              onChange: (event) => setNameDraft(event.target.value),
              onBlur: commitName,
              onKeyDown: (event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetField", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u663E\u793A\u5C3A\u5BF8" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshPetRangeRow", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                type: "range",
                min: 96,
                max: 200,
                step: 4,
                value: config.size,
                onChange: (event) => update({ size: Number(event.target.value) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("output", { children: [
              config.size,
              "px"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetField", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u5F85\u673A\u52A8\u6548" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("select", { value: config.motion, onChange: (event) => update({ motion: event.target.value }), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "float", children: "\u8F7B\u8F7B\u6F02\u6D6E" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "bounce", children: "\u6D3B\u529B\u8DF3\u52A8" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "none", children: "\u5173\u95ED\u52A8\u6548" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetCheck", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "input",
            {
              type: "checkbox",
              checked: config.showProgress,
              onChange: (event) => update({ showProgress: event.target.checked })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u663E\u793A\u4EFB\u52A1\u8FDB\u5EA6\u6761" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "dshPetButton", type: "button", onClick: () => update({ position: null }), children: "\u6062\u590D\u9ED8\u8BA4\u4F4D\u7F6E" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshPetPreview", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "img",
          {
            src: config.image || DEFAULT_IMAGE,
            alt: "\u7535\u5B50\u5BA0\u7269\u56FE\u7247\u9884\u89C8",
            onError: (event) => {
              event.currentTarget.src = DEFAULT_IMAGE;
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshPetActions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dshPetUpload", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u4E0A\u4F20\u56FE\u7247" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif", onChange: onFile })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "dshPetButton",
              type: "button",
              disabled: !config.image,
              onClick: () => {
                update({ image: "" });
                setMessage({ text: "\u5DF2\u6062\u590D\u9ED8\u8BA4\u5F62\u8C61", error: false });
              },
              children: "\u6062\u590D\u9ED8\u8BA4\u56FE\u7247"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dshPetHint", "data-error": message.error || void 0, role: message.error ? "alert" : void 0, children: message.text })
      ] })
    ] })
  ] });
}

// src/client/styles.ts
var styles = `
.dshPetRoot{position:absolute;z-index:4;pointer-events:auto;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:6px;touch-action:none;user-select:none;cursor:grab;filter:drop-shadow(0 8px 14px rgb(0 0 0 / .16))}
.dshPetRoot[data-dragging=true]{cursor:grabbing;transition:none!important}.dshPetRoot[data-motion=float]:not([data-dragging=true]){animation:dshPetFloat 3.2s ease-in-out infinite}.dshPetRoot[data-motion=bounce]:not([data-dragging=true]){animation:dshPetBounce 1.8s ease-in-out infinite}
.dshPetBubble{box-sizing:border-box;max-width:220px;min-height:28px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#202124);font-size:12px;line-height:17px;text-align:center;box-shadow:var(--dsw-shadow-lv1,0 2px 8px rgb(0 0 0 / .08));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dshPetStage{position:relative;width:100%;aspect-ratio:1;display:grid;place-items:center}.dshPetImage{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}.dshPetClose{position:absolute;top:2px;right:2px;width:26px;height:26px;padding:0;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:50%;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#555);font:600 18px/22px system-ui;cursor:pointer;display:grid;place-items:center;box-shadow:0 2px 6px rgb(0 0 0 / .12)}.dshPetClose:hover{background:var(--dsw-alias-interactive-bg-hover,#f0f1f2);color:var(--dsw-alias-label-primary,#202124)}
.dshPetProgress{box-sizing:border-box;width:calc(100% - 12px);min-width:88px;display:flex;align-items:center;gap:7px;padding:5px 8px;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#555);font-size:11px;line-height:15px}.dshPetTrack{height:5px;min-width:34px;flex:1;border-radius:3px;background:var(--dsw-alias-interactive-bg-hover-solid,#e8eaed);overflow:hidden}.dshPetFill{height:100%;border-radius:3px;background:var(--dsw-alias-state-success-primary,#168a65);transition:width .25s ease}.dshPetCount{font-variant-numeric:tabular-nums;white-space:nowrap}
.dshPetSettings{width:100%;max-width:720px;color:var(--dsw-alias-label-primary,#202124);display:flex;flex-direction:column;gap:22px}.dshPetSettingsHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid var(--dsw-alias-border-l2,#d8dade)}.dshPetSettingsHeader h3{margin:0 0 4px;font-size:16px;line-height:24px}.dshPetSettingsHeader p{margin:0;color:var(--dsw-alias-label-tertiary,#777);font-size:13px;line-height:20px}
.dshPetSwitch{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;font-size:13px;line-height:20px;cursor:pointer}.dshPetSwitch input,.dshPetCheck input{width:16px;height:16px;accent-color:var(--dsw-alias-state-business-primary,#3f6df6)}.dshPetSettingsGrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,280px);gap:24px;align-items:start}.dshPetFields{display:flex;flex-direction:column;gap:16px}.dshPetField{display:flex;flex-direction:column;gap:7px}.dshPetField>span{color:var(--dsw-alias-label-secondary,#555);font-size:13px;font-weight:600;line-height:20px}
.dshPetField input[type=text],.dshPetField select{box-sizing:border-box;width:100%;height:36px;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#202124);padding:0 10px;font:13px/20px system-ui;outline:none}.dshPetField input:focus-visible,.dshPetField select:focus-visible,.dshPetButton:focus-visible,.dshPetUpload:focus-within{border-color:var(--dsw-alias-state-business-primary,#3f6df6);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3f6df6) 18%,transparent)}
.dshPetRangeRow{display:flex;align-items:center;gap:10px}.dshPetRangeRow input{flex:1;accent-color:var(--dsw-alias-state-business-primary,#3f6df6)}.dshPetRangeRow output{width:48px;text-align:right;color:var(--dsw-alias-label-tertiary,#777);font-size:12px;font-variant-numeric:tabular-nums}.dshPetCheck{display:flex;align-items:center;gap:8px;font-size:13px;line-height:20px;cursor:pointer}.dshPetPreview{min-width:0;display:flex;flex-direction:column;align-items:center;gap:12px;padding:18px;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#f7f8fa)}.dshPetPreview img{width:150px;height:150px;object-fit:contain}
.dshPetActions{width:100%;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.dshPetButton,.dshPetUpload{box-sizing:border-box;min-height:32px;border:1px solid var(--dsw-alias-border-l2,#d8dade);border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#202124);padding:5px 11px;font:13px/20px system-ui;cursor:pointer;text-align:center}.dshPetButton:hover,.dshPetUpload:hover{background:var(--dsw-alias-interactive-bg-hover,#f0f1f2)}.dshPetButton:disabled{cursor:not-allowed;opacity:.55}.dshPetUpload input{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);overflow:hidden}.dshPetHint{margin:0;color:var(--dsw-alias-label-tertiary,#777);font-size:12px;line-height:18px;text-align:center}.dshPetHint[data-error=true]{color:var(--dsw-alias-state-error-primary,#c73535)}
@keyframes dshPetFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes dshPetBounce{0%,100%{transform:translateY(0)}45%{transform:translateY(-12px)}60%{transform:translateY(-4px)}}@media (prefers-reduced-motion:reduce){.dshPetRoot{animation:none!important}.dshPetFill{transition:none}}@media (max-width:640px){.dshPetSettingsGrid{grid-template-columns:1fr}.dshPetPreview{order:-1}.dshPetSettingsHeader{align-items:center}}
`;

// src/client/index.tsx
var inject = ["slots"];
function apply(ctx) {
  ctx.effect(() => {
    const existing = document.querySelector('style[data-plugin="dsh-plugin-desktop-pet"]');
    existing?.remove();
    const tag = document.createElement("style");
    tag.dataset.plugin = "dsh-plugin-desktop-pet";
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, "desktop-pet: styles");
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "desktop-pet",
    order: 90
  }, DesktopPet));
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "desktop-pet",
    order: 60,
    label: "\u7535\u5B50\u5BA0\u7269"
  }, PetSettings));
}

    return module.exports;
  }
});
