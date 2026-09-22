import "../styles/setup.css";
import { resolveWallpaperUrl, resolveIconUrl, resolvePapirusUrl } from "../shared/assetResolver.js";
import { ICON_PACKS, SAMPLE_ICONS, getIconPack, setIconPack } from "../shared/iconPack.js";
import { isImageFile } from "../shared/fileKindDetector.js";
import { SystemUtilities } from "../system.js";
import { Achievements } from "../achievements.js";
import { AppSource } from "../AppSource.js";
import { PREDEFINED_AVATARS } from "../utils/avatarData.js";
import { applyFontFamily, applyTheme, applyGuiScale, applyDesktopIconSize } from "../settings/settingsApply.js";
import { $, $$, bindEvent, setText, setHTML, toggleClass, createElement } from "../shared/domUtils.js";
import { getAllThemes } from "../shared/themeEngine.js";
import { KeybindManager, KEYBIND_DEFINITIONS } from "../keybindManager.js";
import { BaseApp, StorageKeys, os, ServiceKeys } from "../framework.js";
import { startIntroTour } from "./introTour.js";
import { buildHeaderForStyle, resolveHeaderStyleId } from "../windowManager/headerStyles.js";
export const FEATURE_DATA = {
  step2: [
    {
      icon: "fas fa-desktop",
      title: "True Desktop Experience",
      desc: "Drag, snap, and tile windows like a native desktop",
      animation: "tilt-card"
    },
    {
      icon: "fas fa-gamepad",
      title: "3000+ Games & Emulators",
      desc: "Play DOS, Flash, and console classics instantly",
      animation: "spin-card"
    },
    {
      icon: "fas fa-folder-tree",
      title: "Persistent Filesystem",
      desc: "Files and settings persist locally, always ready",
      animation: "bounce-card"
    },
    {
      icon: "fas fa-box-archive",
      title: "80 Built-in Apps",
      desc: "Notepad to Terminal to Browser, ready instantly",
      animation: "glow-card"
    },
    {
      icon: "fas fa-keyboard",
      title: "Keyboard Shortcuts",
      desc: "Launch with Ctrl+K, switch windows with Alt+Q",
      animation: "slide-card"
    }
  ],
  step3: [
    {
      icon: "fas fa-keyboard",
      title: "Command Palette",
      desc: "Launch apps, files, and commands with Ctrl+K"
    },
    {
      icon: "fas fa-save",
      title: "Session Persistence",
      desc: "Reopens your windows exactly as you left them"
    },
    {
      icon: "fas fa-paint-brush",
      title: "Full Customization",
      desc: "Themes, wallpapers and fonts to make it yours"
    },
    {
      icon: "fas fa-bell",
      title: "Notifications",
      desc: "Tidy toasts with Do Not Disturb for focus"
    },
    {
      icon: "fas fa-sliders-h",
      title: "Audio Mixer",
      desc: "Control master and per-app volume in one place"
    },
    {
      icon: "fas fa-download",
      title: "Import / Export",
      desc: "Back up your system and restore it anywhere"
    }
  ],
  step3b: [
    {
      icon: "fas fa-layer-group",
      title: "Taskbar & Start Menu",
      desc: "Launch apps and flip workspaces instantly"
    },
    {
      icon: "fas fa-eye",
      title: "Window Preview",
      desc: "Hover taskbar icons for live window previews"
    },
    {
      icon: "fas fa-window-restore",
      title: "Window Management",
      desc: "Smart z-ordering keeps your workflow smooth"
    },
    {
      icon: "fas fa-arrows-alt",
      title: "Window Snapping",
      desc: "Drag to edges or press Ctrl+arrows to snap"
    },
    {
      icon: "fas fa-upload",
      title: "File Drag-and-Drop",
      desc: "Drop files from your computer onto the desktop"
    },
    {
      icon: "fas fa-network-wired",
      title: "Unified Ecosystem",
      desc: "Apps share files and state through one core"
    },
    {
      icon: "fas fa-cloud",
      title: "PWA & Offline",
      desc: "Install it and run fully offline"
    },
    {
      icon: "fas fa-arrows-up-down-left-right",
      title: "Workspace System",
      desc: "Juggle tasks across multiple virtual desktops"
    },
    {
      icon: "fas fa-code-branch",
      title: "App Creator",
      desc: "Turn any website into a desktop app"
    },
    {
      icon: "fas fa-gamepad",
      title: "Onyx Steam Game Hub",
      desc: "Browse and launch thousands of games instantly"
    },
    {
      icon: "fas fa-microchip",
      title: "Multi-Runtime Engine",
      desc: "Run DOS, x86, Flash, and 3DS side by side"
    },
    {
      icon: "fas fa-trophy",
      title: "Stats & Achievements",
      desc: "Earn achievements as you explore and play"
    },
    {
      icon: "fas fa-calendar-alt",
      title: "Calendar System",
      desc: "Manage events from the taskbar calendar"
    },
    {
      icon: "fas fa-robot",
      title: "Clippy Assistant",
      desc: "Get playful tips from your desktop helper"
    },
    {
      icon: "fas fa-user-lock",
      title: "Session Management",
      desc: "Secure login with quick auto-start"
    },
    {
      icon: "fas fa-adjust",
      title: "Window Transparency",
      desc: "Adjust glass effects for focus or flair"
    },
    {
      icon: "fas fa-camera",
      title: "Screen Capture",
      desc: "Capture screenshots and recordings to Pictures"
    },
    {
      icon: "fas fa-eye-dropper",
      title: "Color Picker",
      desc: "Sample any pixel with Alt+H and magnifier"
    },
    {
      icon: "fas fa-mouse-pointer",
      title: "Context Menus",
      desc: "Right-click anywhere for powerful actions"
    },
    {
      icon: "fas fa-file-export",
      title: "File Actions Menu",
      desc: "Convert, compress, or set wallpapers in one click"
    },
    {
      icon: "fas fa-window-maximize",
      title: "Window Control Menu",
      desc: "Snap, move, or pin windows with one menu"
    },
    {
      icon: "fas fa-gamepad",
      title: "Onyx Steam Context Actions",
      desc: "Favorite, hide, and organize your game library"
    },
    {
      icon: "fas fa-arrows-alt",
      title: "Taskbar Positioning",
      desc: "Place the taskbar on any screen edge"
    }
  ],
  step6: {
    keyboardShortcuts: KEYBIND_DEFINITIONS.map((s) => ({ keys: s.defaultKeys.join("+"), desc: s.desc, cat: s.cat })),
    performanceModes: [
      { value: "balanced", title: "Balanced", desc: "Recommended for most users" },
      { value: "performance", title: "Performance", desc: "Maximize speed, reduce effects" },
      { value: "quality", title: "Quality", desc: "Best visuals, may be slower" }
    ],
    suggestedApps: [
      { id: "notepad", title: "Notepad", icon: "fas fa-file-alt" },
      { id: "terminal", title: "Terminal", icon: "fas fa-terminal" },
      { id: "browser", title: "Browser", icon: "static/icons/firefox.webp" },
      { id: "explorer", title: "Explorer", icon: "fas fa-folder" },
      { id: "settings", title: "Settings", icon: "fas fa-cog" },
      { id: "yukiOsGuide", title: "OnyxOS Guide", icon: "fas fa-book-open" }
    ],
    transparencyLevels: [
      { value: "high", title: "High Transparency", desc: "More glass effect" },
      { value: "medium", title: "Medium Transparency", desc: "Balanced look" },
      { value: "low", title: "Low Transparency", desc: "More solid windows" }
    ]
  }
};

const FONT_LABELS = {
  opensans: "Open Sans",
  inter: "Inter",
  rubik: "Rubik",
  sora: "Sora",
  jetbrainsmono: "JetBrains Mono",
  monocraft: "Monocraft"
};

export class SetupApp extends BaseApp {
  singletonWindowIds = ["setup-wizard"];

  constructor(services) {
    super(services);
    this.totalSetupSteps = 9;
    this.currentStep = 0;
    this.userChoices = {
      theme: "dark",
      wallpaper: null,
      notifications: true,
      sound: true,
      clipboardManager: true,
      performanceMode: "balanced",
      transparency: "medium",
      taskbarPosition: os.storage.get(StorageKeys.taskbarPosition) || "bottom",
      taskbarAlignment: os.storage.get(StorageKeys.taskbarAlignment) || "left",
      desktopIconSize: Number(os.storage.get(StorageKeys.desktopIconSize)) || 48,
      guiScale: Number(os.storage.get(StorageKeys.guiScale)) || 100,
      windowAnimationSpeed: os.storage.get(StorageKeys.windowAnimationSpeed) || "1.0",
      username: os.storage.get(StorageKeys.username) || "Guest",
      profilePicture: os.storage.get(StorageKeys.profilePicture) || PREDEFINED_AVATARS[0],
      fontFamily: "opensans",
      iconPack: getIconPack()
    };
    this.wallpapers = [];
    this.customWallpapers = [];
    this.isTransitioning = false;
    this.stepTransitionTimer = null;
  }

  async open(options = {}) {
    const winId = "setup-wizard";
    this.currentStep = 0;
    this.isTransitioning = false;
    if (this.stepTransitionTimer) {
      clearTimeout(this.stepTransitionTimer);
      this.stepTransitionTimer = null;
    }

    await this.loadWallpapers();

    const win = os.window.create(winId, "Set Up OnyxOS", "85vw", "75vh", {
      icon: "fas fa-rocket",
      position: "center",
      skipHeader: true
    });
    win.innerHTML = this.buildUI();
    os.window.applySnap(win, "maximize");
    this.trackWindow(winId, win);
    this.bindEvents(win);
    this.animateStepIn(win);
  }

  onClose(winId) {
    this.untrackWindow(winId);
  }

  buildUI() {
    const headerHtml = buildHeaderForStyle("Set Up OnyxOS", "", os.window.getWindowControls(), resolveHeaderStyleId());
    return `
      ${headerHtml}
      <div class="window-content setup-wizard">
        <div class="setup-progress">
          ${Array.from({ length: this.totalSetupSteps - 1 }, (_, idx) => idx + 1)
            .map(
              (i) => `
            <div class="progress-step ${i === 1 ? "active" : ""}" data-step="${i}">
              <div class="progress-circle">
                <span class="progress-number">${i}</span>
                <i class="fas fa-check progress-check"></i>
              </div>
              ${i < this.totalSetupSteps - 1 ? '<div class="progress-line"></div>' : ""}
            </div>
          `
            )
            .join("")}
        </div>

        <div class="setup-content">
          ${this.buildStep1()}
          ${this.buildStep2()}
          ${this.buildStep3()}
          ${this.buildStep3b()}
          ${this.buildStep4()}
          ${this.buildStep5()}
          ${this.buildStep6()}
          ${this.buildStep7()}
          ${this.buildStep8()}
        </div>

        <div class="setup-footer">
          <button class="setup-btn setup-btn-secondary" id="setup-skip">
            Skip Setup
          </button>
          <div class="setup-nav">
            <button class="setup-btn setup-btn-secondary" id="setup-back" style="display: none;">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <button class="setup-btn setup-btn-primary" id="setup-next">
              Get Started <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  buildStep1() {
    const nickname = os.storage.get(StorageKeys.username) || "Guest";
    return `
      <div class="setup-step active" data-step="1">
        <div class="step-hero" style="margin-top: 50px;">
          <div class="hero-logo">
            <i class="fas fa-snowflake"></i>
          </div>
          <h1 class="hero-title">Hey there, ${nickname}</h1>
          <p class="hero-subtitle">A complete desktop in one tab. No installs, always ready, always yours</p>
          <button class="setup-info-btn" id="setup-info-btn">
            <i class="fas fa-circle-info"></i>
          </button>
        </div>
      </div>
    `;
  }

  buildFeatureGrid(data, title, icon, extraClass) {
    return `
      <div class="step-content">
        <div class="step-title"><i class="${icon}"></i> ${title}</div>
        <div class="feature-grid${extraClass ? ` ${extraClass}` : ""}">
          ${data
            .map(
              (f) => `
            <div class="feature-card">
              <div class="feature-icon"><i class="${f.icon}"></i></div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildStep2() {
    return `
      <div class="setup-step" data-step="2">
        <div class="setup-value-prop">
          <div class="value-prop-icon"><i class="fas fa-snowflake"></i></div>
          <h2 class="value-prop-title">A full desktop in one browser tab</h2>
          <p class="value-prop-sub">No installs. Runs instantly on any network. Every file, setting, and window stays exactly where you left it. Return anytime and resume.</p>
        </div>
        ${this.buildFeatureGrid(FEATURE_DATA.step2, "Here's What You Get", "fas fa-star")}
      </div>
    `;
  }

  buildStep3() {
    return `<div class="setup-step" data-step="3">${this.buildFeatureGrid(FEATURE_DATA.step3, "System Features", "fas fa-puzzle-piece")}</div>`;
  }

  buildStep3b() {
    return `<div class="setup-step" data-step="4">${this.buildFeatureGrid(FEATURE_DATA.step3b, "More Features", "fas fa-plus-circle")}</div>`;
  }

  buildIconPackSection() {
    const isPapirus = this.userChoices.iconPack !== ICON_PACKS.FA;
    const papirusIcons = SAMPLE_ICONS.map(
      (s) => `<img src="${resolvePapirusUrl(s.papirus, 22)}" class="papirus-icon papirus-icon--22" alt="" />`
    ).join("");
    const faIcons = SAMPLE_ICONS.map((s) => `<i class="${s.fa}" style="font-size:18px;"></i>`).join("");
    return `
      <div class="personalize-section">
        <label class="section-label">Icon Style</label>
        <p style="font-size:12px;color:var(--text-secondary);margin:4px 0 8px;">Same preview as Settings. Click to switch, Papirus is default</p>
        <div class="icon-pack-chooser" id="setup-iconpack-chooser" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;">
          <button class="icon-pack-option ${isPapirus ? "active" : ""}" data-icon-pack="papirus" style="display:flex;flex-direction:column;align-items:center;padding:10px;border:1.5px solid ${isPapirus ? "var(--brand)" : "var(--glass-border)"};border-radius:8px;background:${isPapirus ? "color-mix(in srgb, var(--brand) 12%, transparent)" : "var(--glass)"};cursor:pointer;gap:6px;">
            <span style="font-weight:600;font-size:13px;"><i class="fas fa-palette" style="margin-right:6px;"></i>Papirus</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:8px;background:var(--bg-secondary,rgba(0,0,0,0.15));border-radius:6px;margin:4px 0;min-height:38px;align-items:center;">${papirusIcons}</div>
            <span style="font-size:11px;color:var(--text-secondary)">Colorful detailed</span>
          </button>
          <button class="icon-pack-option ${!isPapirus ? "active" : ""}" data-icon-pack="fontawesome" style="display:flex;flex-direction:column;align-items:center;padding:10px;border:1.5px solid ${!isPapirus ? "var(--brand)" : "var(--glass-border)"};border-radius:8px;background:${!isPapirus ? "color-mix(in srgb, var(--brand) 12%, transparent)" : "var(--glass)"};cursor:pointer;gap:6px;">
            <span style="font-weight:600;font-size:13px;"><i class="fas fa-font" style="margin-right:6px;"></i>Font Awesome</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px;background:var(--bg-secondary,rgba(0,0,0,0.15));border-radius:6px;margin:4px 0;min-height:38px;align-items:center;">${faIcons}</div>
            <span style="font-size:11px;color:var(--text-secondary)">Monochrome vector</span>
          </button>
        </div>
      </div>
    `;
  }

  buildStep4() {
    const themes = getAllThemes();

    const themeButtons = themes
      .map(
        (theme) => `
        <button class="theme-btn ${this.userChoices.theme === theme.value ? "active" : ""}" data-theme="${theme.value}" style="height: 56px; background: ${theme.preview || "var(--brand)"}; color: ${theme.textColor || "var(--text-on-brand)"};">
          <span>${theme.label}</span>
        </button>
      `
      )
      .join("");

    return `
      <div class="setup-step" data-step="5">
        <h2 class="step-title">
          <i class="fas fa-paint-brush"></i> Choose a theme and wallpaper
        </h2>

        <div class="personalize-section">
          <label class="section-label">Choose Theme</label>
          <div class="theme-selector theme-selector-scroll">
            ${themeButtons}
          </div>
        </div>

        <div class="personalize-section">
          <label class="section-label">Font Family</label>
          <div class="font-selector font-selector-grid">
            <button class="font-btn ${this.userChoices.fontFamily === "opensans" ? "active" : ""}" data-font="opensans">
              <span>Open Sans</span>
            </button>
            <button class="font-btn ${this.userChoices.fontFamily === "inter" ? "active" : ""}" data-font="inter">
              <span>Inter</span>
            </button>
            <button class="font-btn ${this.userChoices.fontFamily === "rubik" ? "active" : ""}" data-font="rubik">
              <span>Rubik</span>
            </button>
            <button class="font-btn ${this.userChoices.fontFamily === "sora" ? "active" : ""}" data-font="sora">
              <span>Sora</span>
            </button>
            <button class="font-btn ${this.userChoices.fontFamily === "jetbrainsmono" ? "active" : ""}" data-font="jetbrainsmono">
              <span>JetBrains Mono</span>
            </button>
            <button class="font-btn ${this.userChoices.fontFamily === "monocraft" ? "active" : ""}" data-font="monocraft">
              <span>Monocraft</span>
            </button>
          </div>
        </div>

        ${this.buildIconPackSection()}

        <div class="personalize-section">
          <label class="section-label">Select Wallpaper</label>
          <div class="wallpaper-grid" id="wallpaper-grid">
            ${this.wallpapers
              .map(
                (wp) => `
              <div class="wallpaper-thumb ${this.userChoices.wallpaper === wp ? "active" : ""}" data-wallpaper="${wp}" data-type="builtin">
                <img data-src="${resolveWallpaperUrl("static/wallpapers/" + wp)}" alt="${wp}" loading="lazy">
                <div class="wallpaper-overlay">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            `
              )
              .join("")}
            ${this.customWallpapers
              .map(
                (wp) => `
              <div class="wallpaper-thumb ${this.userChoices.wallpaper === wp.name ? "active" : ""}" data-wallpaper="${wp.name}" data-type="custom" data-url="${wp.url}">
                <img data-src="${wp.url}" alt="${wp.name}" loading="lazy">
                <div class="wallpaper-overlay">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <button class="setup-btn setup-btn-secondary setup-upload-button" id="upload-wallpaper-btn">
            <i class="fas fa-upload"></i> Upload Custom Wallpaper
          </button>
        </div>
      </div>
    `;
  }

  buildToggle(setting, icon, label, checked) {
    return `
      <div class="setting-item">
        <div class="setting-info">
          <i class="${icon} setting-icon"></i>
          <div>
            <h4>${label}</h4>
          </div>
        </div>
        <label class="setting-toggle">
          <input type="checkbox" ${checked ? "checked" : ""} data-setting="${setting}">
          <span class="toggle-track"><span class="toggle-thumb"></span></span>
        </label>
      </div>
    `;
  }

  buildPerformanceSelector() {
    return `
      <div class="settings-half">
        <label class="section-label">Performance</label>
        <div class="performance-selector">
          ${FEATURE_DATA.step6.performanceModes
            .map(
              (m) => `
            <button class="performance-btn ${this.userChoices.performanceMode === m.value ? "active" : ""}" data-mode="${m.value}">
              <div class="performance-title">${m.title}</div>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildTransparencySelector() {
    return `
      <div class="settings-half">
        <label class="section-label">Transparency</label>
        <div class="transparency-selector">
          ${FEATURE_DATA.step6.transparencyLevels
            .map(
              (t) => `
            <button class="transparency-btn ${this.userChoices.transparency === t.value ? "active" : ""}" data-transparency="${t.value}">
              <div class="transparency-title">${t.title}</div>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildTaskbarPositionSelector() {
    const opts = [
      { value: "bottom", label: "Bottom", icon: "fas fa-arrow-down" },
      { value: "top", label: "Top", icon: "fas fa-arrow-up" },
      { value: "left", label: "Left", icon: "fas fa-arrow-left" },
      { value: "right", label: "Right", icon: "fas fa-arrow-right" }
    ];
    return `
      <div class="settings-half">
        <label class="section-label">Taskbar Position</label>
        <div class="taskbar-position-selector" style="display:flex;gap:6px;flex-wrap:wrap;">
          ${opts
            .map(
              (o) => `
            <button class="taskbar-pos-btn ${this.userChoices.taskbarPosition === o.value ? "active" : ""}" data-pos="${o.value}" style="flex:1;min-width:60px;padding:8px 6px;border-radius:6px;border:1px solid var(--glass-border);background:${this.userChoices.taskbarPosition === o.value ? "var(--brand)" : "var(--glass)"};color:${this.userChoices.taskbarPosition === o.value ? "var(--text-on-brand)" : "var(--text-primary)"};font-size:12px;font-weight:600;cursor:pointer;">
              <i class="${o.icon}"></i> ${o.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildTaskbarAlignmentSelector() {
    const opts = [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" }
    ];
    return `
      <div class="settings-half">
        <label class="section-label">Taskbar Alignment</label>
        <div class="taskbar-alignment-selector" style="display:flex;gap:6px;">
          ${opts
            .map(
              (o) => `
            <button class="taskbar-align-btn ${this.userChoices.taskbarAlignment === o.value ? "active" : ""}" data-align="${o.value}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:${this.userChoices.taskbarAlignment === o.value ? "var(--brand)" : "var(--glass)"};color:${this.userChoices.taskbarAlignment === o.value ? "var(--text-on-brand)" : "var(--text-primary)"};font-size:12px;font-weight:600;cursor:pointer;">
              ${o.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildIconSizeSelector() {
    const opts = [
      { value: 32, label: "Small" },
      { value: 48, label: "Medium" },
      { value: 64, label: "Large" }
    ];
    return `
      <div class="settings-half">
        <label class="section-label">Desktop Icons</label>
        <div class="icon-size-selector" style="display:flex;gap:6px;">
          ${opts
            .map(
              (o) => `
            <button class="icon-size-btn ${this.userChoices.desktopIconSize === o.value ? "active" : ""}" data-size="${o.value}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:${this.userChoices.desktopIconSize === o.value ? "var(--brand)" : "var(--glass)"};color:${this.userChoices.desktopIconSize === o.value ? "var(--text-on-brand)" : "var(--text-primary)"};font-size:12px;font-weight:600;cursor:pointer;">
              ${o.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildGuiScaleSelector() {
    const opts = [
      { value: 90, label: "90%" },
      { value: 100, label: "100%" },
      { value: 125, label: "125%" }
    ];
    return `
      <div class="settings-half">
        <label class="section-label">Interface Scale</label>
        <div class="gui-scale-selector" style="display:flex;gap:6px;">
          ${opts
            .map(
              (o) => `
            <button class="gui-scale-btn ${this.userChoices.guiScale === o.value ? "active" : ""}" data-scale="${o.value}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:${this.userChoices.guiScale === o.value ? "var(--brand)" : "var(--glass)"};color:${this.userChoices.guiScale === o.value ? "var(--text-on-brand)" : "var(--text-primary)"};font-size:12px;font-weight:600;cursor:pointer;">
              ${o.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildAnimationSpeedSelector() {
    const opts = [
      { value: "3.0", label: "Slow" },
      { value: "1.0", label: "Normal" },
      { value: "0.4", label: "Fast" }
    ];
    return `
      <div class="settings-half">
        <label class="section-label">Animation Speed</label>
        <div class="animation-speed-selector" style="display:flex;gap:6px;">
          ${opts
            .map(
              (o) => `
            <button class="anim-speed-btn ${this.userChoices.windowAnimationSpeed === o.value ? "active" : ""}" data-speed="${o.value}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:${this.userChoices.windowAnimationSpeed === o.value ? "var(--brand)" : "var(--glass)"};color:${this.userChoices.windowAnimationSpeed === o.value ? "var(--text-on-brand)" : "var(--text-primary)"};font-size:12px;font-weight:600;cursor:pointer;">
              ${o.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  buildStep5() {
    return `
      <div class="setup-step" data-step="6">
        <h2 class="step-title">
          <i class="fas fa-sliders-h"></i> Essentials
        </h2>
        <p style="font-size:13px;color:var(--text-secondary);margin:0 0 12px;">Pick the basics that shape your daily workflow. Everything else stays in Settings.</p>
        <div class="settings-grid">
          ${this.buildToggle("notifications", "fas fa-bell", "Notifications", this.userChoices.notifications)}
          ${this.buildToggle("sound", "fas fa-volume-high", "Sound", this.userChoices.sound)}
          ${this.buildToggle("clipboardManager", "fas fa-paste", "Clipboard History", this.userChoices.clipboardManager)}
        </div>
        <div class="settings-row">
          ${this.buildTaskbarPositionSelector()}
          ${this.buildTaskbarAlignmentSelector()}
        </div>
        <div class="settings-row">
          ${this.buildIconSizeSelector()}
          ${this.buildGuiScaleSelector()}
        </div>
        <div class="settings-row">
          ${this.buildAnimationSpeedSelector()}
          ${this.buildPerformanceSelector()}
        </div>
        <div class="settings-row">
          ${this.buildTransparencySelector()}
        </div>
      </div>
    `;
  }

  buildStep6() {
    const preview = [
      { keys: "Ctrl+K / F1", desc: "Open command palette" },
      { keys: "Alt+Q", desc: "Switch windows" },
      { keys: "Alt + Right Drag", desc: "Resize window" },
      { keys: "Ctrl+Arrows", desc: "Snap window" }
    ];
    return `
      <div class="setup-step" data-step="7">
        <h2 class="step-title">
          <i class="fas fa-compass"></i> Get Around Faster
        </h2>
        <p style="font-size:13px;color:var(--text-secondary);margin:0 0 12px;">OnyxOS stays fast with the keyboard. Start with these four, then explore the rest.</p>
        <div class="personalize-section">
          <label class="section-label">Essential Shortcuts</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${preview
              .map(
                (s) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--glass-border);border-radius:8px;background:var(--glass);">
                <span style="font-size:12px;color:var(--text-secondary);">${s.desc}</span>
                <span style="font-size:11px;font-weight:700;padding:4px 6px;border-radius:4px;background:var(--brand);color:var(--text-on-brand);white-space:nowrap;">${s.keys}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <p style="font-size:12px;color:var(--text-secondary);margin:10px 0 12px;">Open the full list to remap any shortcut. Hover the desktop or Start menu for extra tips.</p>
          <button class="setup-btn setup-btn-primary" id="setup-launch-shortcuts">
            <i class="fas fa-keyboard"></i> Open Keyboard Shortcuts
          </button>
        </div>
      </div>
    `;
  }

  buildStep7() {
    const username = this.userChoices.username || "Guest";
    const profilePic = this.userChoices.profilePicture || PREDEFINED_AVATARS[0];
    const avatarsHtml = PREDEFINED_AVATARS.map(
      (avatar) => `
        <div class="setup-avatar-option ${avatar === profilePic ? "selected" : ""}" data-src="${avatar}" style="border-radius: 25px; overflow: hidden; cursor: pointer; border: 2px solid var(--glass-border); transition: all 0.15s; width: 56px; height: 56px; position: relative;">
          <img data-src="${avatar}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; display: ${avatar === profilePic ? "flex" : "none"}; align-items: center; justify-content: center; background: color-mix(in srgb, var(--brand) 55%, transparent); color: var(--text-on-brand); font-size: 12px;"><i class="fas fa-check"></i></div>
        </div>
      `
    ).join("");

    return `
      <div class="setup-step" data-step="8">
        <h2 class="step-title">
          <i class="fas fa-user-circle"></i> Profile Setup
        </h2>
        <div class="personalize-section" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--brand-dim); border-radius: 8px; border: 1px solid var(--brand);">
            <div style="width: 46px; height: 46px; border-radius: 25px; overflow: hidden; border: 2px solid var(--brand); flex-shrink: 0;">
              <img id="setup-profile-preview-img" data-src="${profilePic}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="min-width: 0;">
              <div id="setup-profile-preview-name" style="font-size: 15px; color: var(--text-primary); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${username}</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Profile Preview</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label class="section-label">Nickname</label>
            <input id="setup-profile-name" type="text" value="${username}" placeholder="Enter your nickname" style="padding: 8px 10px; border-radius: 6px; border: 1px solid var(--glass-border); background: var(--surface-1); color: var(--text-primary); font-size: 14px; outline: none;" />
          </div>
          <button class="setup-btn setup-btn-secondary setup-upload-button" id="setup-profile-upload">
            <i class="fas fa-upload"></i> Upload Custom Avatar
          </button>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); gap: 8px; max-height: 210px; overflow-y: auto;">
            ${avatarsHtml}
          </div>
        </div>
      </div>
    `;
  }

  buildStep8() {
    const username = this.userChoices.username || "Guest";
    const profilePic = this.userChoices.profilePicture || PREDEFINED_AVATARS[0];
    return `
      <div class="setup-step" data-step="9">
        <div class="complete-hero">
          <div class="complete-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <h2 class="complete-title">You're All Set!</h2>
          <p class="complete-subtitle">Your desktop is ready</p>
        </div>

        <div class="summary-grid">
          <div class="summary-item" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 10px;">
            <img id="setup-summary-profile-img" data-src="${profilePic}" alt="${username}" style="width: 30px; height: 30px; border-radius: 25px; border: 1px solid var(--glass-border); object-fit: cover;">
            <span id="setup-summary-profile-name">Profile: ${username}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-palette"></i>
            <span>Theme: ${this.userChoices.theme}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-image"></i>
            <span>Wallpaper: ${this.userChoices.wallpaper || "Default"}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-bell"></i>
            <span>Notifications: ${this.userChoices.notifications ? "On" : "Off"}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-volume-high"></i>
            <span>Sound: ${this.userChoices.sound ? "On" : "Off"}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-tachometer-alt"></i>
            <span>Performance: ${this.userChoices.performanceMode}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-adjust"></i>
            <span>Transparency: ${this.userChoices.transparency}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-font"></i>
            <span>Font: ${FONT_LABELS[this.userChoices.fontFamily] || this.userChoices.fontFamily}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-arrows-alt"></i>
            <span>Taskbar: ${this.userChoices.taskbarPosition} · ${this.userChoices.taskbarAlignment}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-expand"></i>
            <span>Icons: ${this.userChoices.desktopIconSize}px · Scale ${this.userChoices.guiScale}%</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-bolt"></i>
            <span>Animation: ${this.userChoices.windowAnimationSpeed === "3.0" ? "Slow" : this.userChoices.windowAnimationSpeed === "0.4" ? "Fast" : "Normal"}</span>
          </div>
          <div class="summary-item">
            <i class="fas fa-paste"></i>
            <span>Clipboard: ${this.userChoices.clipboardManager ? "On" : "Off"}</span>
          </div>
        </div>

        <div class="complete-actions">
          <button id="setup-launch-guide" class="setup-guide-btn">
            <i class="fas fa-book-open"></i>
            <span>Open OnyxOS Guide</span>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents(win) {
    const nextBtn = $("#setup-next", win);
    const backBtn = $("#setup-back", win);
    const skipBtn = $("#setup-skip", win);
    const infoBtn = $("#setup-info-btn", win);

    nextBtn.addEventListener("click", () => {
      if (this.isTransitioning) return;
      this.nextStep(win);
    });

    backBtn.addEventListener("click", () => {
      if (this.isTransitioning) return;
      this.prevStep(win);
    });
    skipBtn.addEventListener("click", () => this.skipSetup(win));

    if (infoBtn) {
      infoBtn.addEventListener("click", () => {
        os.app.launch("aboutApp");
      });
    }

    const themeBtns = $$(".theme-btn", win);
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;
        this.userChoices.theme = theme;
        themeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyTheme(theme, () => os.storage.get(StorageKeys.customColors));
      });
    });

    const fontBtns = $$(".font-btn", win);
    fontBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const font = btn.dataset.font;
        this.userChoices.fontFamily = font;
        fontBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFontFamily(font);
      });
    });

    const iconPackOptions = $$(".icon-pack-option", win);
    iconPackOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const pack = btn.dataset.iconPack === "fontawesome" ? ICON_PACKS.FA : ICON_PACKS.PAPIRUS;
        this.userChoices.iconPack = pack;
        iconPackOptions.forEach((b) => {
          const isActive = b.dataset.iconPack === pack;
          b.classList.toggle("active", isActive);
          b.style.borderColor = isActive ? "var(--brand)" : "var(--glass-border)";
          b.style.background = isActive ? "color-mix(in srgb, var(--brand) 12%, transparent)" : "var(--glass)";
        });
      });
    });

    const wallpaperThumbs = $$(".wallpaper-thumb", win);
    wallpaperThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const wallpaper = thumb.dataset.wallpaper;
        this.userChoices.wallpaper = wallpaper;
        wallpaperThumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    const toggles = $$(".setting-toggle input", win);
    toggles.forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const setting = toggle.dataset.setting;
        this.userChoices[setting] = toggle.checked;
      });
    });

    const uploadBtn = $("#upload-wallpaper-btn", win);
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => this.handleWallpaperUpload(win));
    }

    const perfBtns = $$(".performance-btn", win);
    perfBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        this.userChoices.performanceMode = mode;
        perfBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    const transparencyBtns = $$(".transparency-btn", win);
    transparencyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const transparency = btn.dataset.transparency;
        this.userChoices.transparency = transparency;
        transparencyBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    const posBtns = $$(".taskbar-pos-btn", win);
    posBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const pos = btn.dataset.pos;
        this.userChoices.taskbarPosition = pos;
        posBtns.forEach((b) => {
          const active = b.dataset.pos === pos;
          b.classList.toggle("active", active);
          b.style.background = active ? "var(--brand)" : "var(--glass)";
          b.style.color = active ? "var(--text-on-brand)" : "var(--text-primary)";
        });
      });
    });

    const alignBtns = $$(".taskbar-align-btn", win);
    alignBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const align = btn.dataset.align;
        this.userChoices.taskbarAlignment = align;
        alignBtns.forEach((b) => {
          const active = b.dataset.align === align;
          b.classList.toggle("active", active);
          b.style.background = active ? "var(--brand)" : "var(--glass)";
          b.style.color = active ? "var(--text-on-brand)" : "var(--text-primary)";
        });
      });
    });

    const iconSizeBtns = $$(".icon-size-btn", win);
    iconSizeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = Number(btn.dataset.size);
        this.userChoices.desktopIconSize = size;
        iconSizeBtns.forEach((b) => {
          const active = Number(b.dataset.size) === size;
          b.classList.toggle("active", active);
          b.style.background = active ? "var(--brand)" : "var(--glass)";
          b.style.color = active ? "var(--text-on-brand)" : "var(--text-primary)";
        });
        applyDesktopIconSize(size);
      });
    });

    const guiScaleBtns = $$(".gui-scale-btn", win);
    guiScaleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const scale = Number(btn.dataset.scale);
        this.userChoices.guiScale = scale;
        guiScaleBtns.forEach((b) => {
          const active = Number(b.dataset.scale) === scale;
          b.classList.toggle("active", active);
          b.style.background = active ? "var(--brand)" : "var(--glass)";
          b.style.color = active ? "var(--text-on-brand)" : "var(--text-primary)";
        });
        applyGuiScale(scale);
      });
    });

    const animBtns = $$(".anim-speed-btn", win);
    animBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const speed = btn.dataset.speed;
        this.userChoices.windowAnimationSpeed = speed;
        animBtns.forEach((b) => {
          const active = b.dataset.speed === speed;
          b.classList.toggle("active", active);
          b.style.background = active ? "var(--brand)" : "var(--glass)";
          b.style.color = active ? "var(--text-on-brand)" : "var(--text-primary)";
        });
        os.storage.set(StorageKeys.windowAnimationSpeed, speed);
      });
    });

    const launchGuideBtn = $("#setup-launch-guide", win);
    if (launchGuideBtn) {
      launchGuideBtn.addEventListener("click", () => {
        os.app.launch("yukiOsGuideApp");
      });
    }

    const launchShortcutsBtn = $("#setup-launch-shortcuts", win);
    if (launchShortcutsBtn) {
      launchShortcutsBtn.addEventListener("click", () => {
        os.app.launch("shortcutsApp");
      });
    }

    this.bindProfileStepEvents(win);
  }

  nextStep(win) {
    if (this.isTransitioning) return;

    if (this.currentStep < this.totalSetupSteps - 1) {
      this.isTransitioning = true;

      const currentStepEl = $(`.setup-step[data-step="${this.currentStep + 1}"]`, win);
      if (!currentStepEl) {
        this.isTransitioning = false;
        return;
      }

      currentStepEl.classList.add("exit-left");

      this.stepTransitionTimer = setTimeout(() => {
        currentStepEl.classList.remove("active", "exit-left");

        this.currentStep++;

        this.updateStepUI(win);
        this.animateStepIn(win);

        this.isTransitioning = false;
        this.stepTransitionTimer = null;
      }, 300);
    } else {
      this.completeSetup(win);
    }
  }

  prevStep(win) {
    if (this.isTransitioning) return;
    if (this.currentStep <= 0) return;

    this.isTransitioning = true;

    const currentStepEl = $(`.setup-step[data-step="${this.currentStep + 1}"]`, win);
    if (currentStepEl) currentStepEl.classList.remove("active");

    this.currentStep--;

    this.updateStepUI(win);

    const prevStepEl = $(`.setup-step[data-step="${this.currentStep + 1}"]`, win);

    if (prevStepEl) {
      prevStepEl.classList.add("active");
      prevStepEl.style.transform = "translateX(-50px)";
      this.lazyLoadActiveStepImages(prevStepEl);

      requestAnimationFrame(() => {
        prevStepEl.style.transform = "translateX(0)";
      });
    }

    setTimeout(() => {
      this.isTransitioning = false;
    }, 250);
  }

  updateStepUI(win) {
    const steps = $$(".progress-step", win);
    steps.forEach((step, index) => {
      step.classList.remove("active", "completed");
      if (index < this.currentStep) {
        step.classList.add("completed");
      } else if (index === this.currentStep) {
        step.classList.add("active");
      }
    });

    const backBtn = $("#setup-back", win);
    const nextBtn = $("#setup-next", win);

    backBtn.style.display = this.currentStep > 0 ? "flex" : "none";

    if (this.currentStep === this.totalSetupSteps - 1) {
      setHTML(nextBtn, "Open desktop");
    } else {
      setHTML(nextBtn, 'Continue <i class="fas fa-arrow-right"></i>');
    }

    this.refreshProfileSummary(win);
  }

  animateStepIn(win) {
    const stepEl = $(`.setup-step[data-step="${this.currentStep + 1}"]`, win);
    if (stepEl) {
      stepEl.classList.add("active");
      this.lazyLoadActiveStepImages(stepEl);
    }
  }

  lazyLoadActiveStepImages(stepEl) {
    stepEl.querySelectorAll("img[data-src]").forEach((img) => {
      if (!img.src && img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    stepEl.querySelectorAll(".feature-card").forEach((card, i) => card.style.setProperty("--i", i));
    stepEl.querySelectorAll(".summary-item").forEach((item, i) => item.style.setProperty("--i", i));
  }

  async completeSetup(win) {
    const finalizedName = (this.userChoices.username || "").trim() || "Guest";
    const finalizedAvatar = this.userChoices.profilePicture || PREDEFINED_AVATARS[0];
    this.userChoices.username = finalizedName;
    this.userChoices.profilePicture = finalizedAvatar;
    os.storage.set(StorageKeys.username, finalizedName);
    os.storage.set(StorageKeys.profilePicture, finalizedAvatar);

    const sm = this.os.app.getInstance(ServiceKeys.SESSION_MANAGER);
    if (sm?.currentSession) {
      sm.currentSession.name = finalizedName;
      sm.currentSession.key = finalizedName.toLowerCase().replace(/[^a-z0-9]/g, "") || "guest";
      sm.currentSession.avatar = finalizedAvatar;
    }

    os.storage.set(StorageKeys.theme, this.userChoices.theme);
    os.storage.set(StorageKeys.notificationsEnabled, this.userChoices.notifications.toString());
    os.storage.set(StorageKeys.soundEnabled, this.userChoices.sound.toString());
    os.storage.set(StorageKeys.setupCompleted, "true");

    os.storage.set(StorageKeys.performanceMode, this.userChoices.performanceMode);
    os.storage.set(StorageKeys.transparency, this.userChoices.transparency);

    os.storage.set(StorageKeys.fontFamily, this.userChoices.fontFamily);
    setIconPack(this.userChoices.iconPack || ICON_PACKS.PAPIRUS);
    os.storage.set(StorageKeys.taskbarPosition, this.userChoices.taskbarPosition);
    os.storage.set(StorageKeys.taskbarAlignment, this.userChoices.taskbarAlignment);
    os.storage.set(StorageKeys.desktopIconSize, String(this.userChoices.desktopIconSize));
    os.storage.set(StorageKeys.guiScale, String(this.userChoices.guiScale));
    os.storage.set(StorageKeys.windowAnimationSpeed, String(this.userChoices.windowAnimationSpeed));
    applyGuiScale(this.userChoices.guiScale);
    applyDesktopIconSize(this.userChoices.desktopIconSize);
    os.storage.set(StorageKeys.clipboardManagerEnabled, this.userChoices.clipboardManager.toString());

    this.os.app.triggerAchievement(Achievements.SetupComplete);

    if (this.userChoices.wallpaper) {
      try {
        const wallpaperUrl = resolveWallpaperUrl("static/wallpapers/" + this.userChoices.wallpaper);
        await SystemUtilities.setWallpaper(wallpaperUrl);
      } catch (e) {
        console.error("Failed to set wallpaper:", e);
      }
    }

    os.events.emit("SETUP_COMPLETED", this.userChoices);
    os.events.emit("AUDIO_SETTINGS_CHANGED", { soundEnabled: this.userChoices.sound });
    document.dispatchEvent(
      new CustomEvent("AUDIO_SETTINGS_CHANGED", {
        detail: { soundEnabled: this.userChoices.sound }
      })
    );
    const welcomeContent = `Setup complete, ${sm?.currentSession?.name || "Guest"}!

Here's what you picked:
- Theme: ${this.userChoices.theme}
- Taskbar: ${this.userChoices.taskbarPosition} · ${this.userChoices.taskbarAlignment}
- Icons: ${this.userChoices.desktopIconSize}px · Scale ${this.userChoices.guiScale}%
- Animation: ${this.userChoices.windowAnimationSpeed === "3.0" ? "Slow" : this.userChoices.windowAnimationSpeed === "0.4" ? "Fast" : "Normal"}
- Performance: ${this.userChoices.performanceMode} · Transparency: ${this.userChoices.transparency}
- Notifications: ${this.userChoices.notifications ? "On" : "Off"} · Sound: ${this.userChoices.sound ? "On" : "Off"}

Quick tips to get going:
• Press Ctrl+K to launch anything instantly
• Right-click the desktop, taskbar, or window headers for more
• Tweak everything later in Settings. Search for any option

Have fun!`;

    try {
      await os.fs.mkdir(["Documents"]);
      await os.fs.write(["Documents", "Welcome.txt"], welcomeContent);
    } catch (e) {
      console.error("Failed to create welcome file:", e);
    }

    os.notify.send("Welcome to OnyxOS", "", {
      type: "success",
      duration: 3000
    });

    os.window.close(win);
    setTimeout(() => startIntroTour(), 600);
  }

  skipSetup(win) {
    os.storage.set(StorageKeys.setupCompleted, "true");

    this.os.app.triggerAchievement(Achievements.SetupComplete);
    os.window.close(win);
    this.untrackWindow("setup-wizard");
  }

  async loadWallpapers() {
    try {
      const folder = await os.fs.readdir(["Pictures", "Wallpapers"]);
      if (folder) {
        this.wallpapers = Object.keys(folder).filter((name) => {
          const item = folder[name];
          return item && item.type === "file" && isImageFile(name);
        });
      }
    } catch (e) {
      console.error("Failed to load wallpapers:", e);
      this.wallpapers = [
        "wallpaper1.webp",
        "wallpaper2.webp",
        "wallpaper3.webp",
        "wallpaper4.webp",
        "wallpaper5.webp",
        "wallpaper6.webp"
      ];
    }
  }

  async handleWallpaperUpload(win) {
    const input = createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
        const fileName = "custom_" + Date.now() + "." + file.name.split(".").pop();

        try {
          await os.fs.mkdir(["Pictures", "Wallpapers"]);
          await os.fs.write(["Pictures", "Wallpapers", fileName], dataUrl);

          this.customWallpapers.push({ name: fileName, url: dataUrl });
          this.userChoices.wallpaper = fileName;

          const grid = $("#wallpaper-grid", win);
          if (grid) {
            const newThumb = createElement("div");
            newThumb.className = "wallpaper-thumb active";
            newThumb.dataset.wallpaper = fileName;
            newThumb.dataset.type = "custom";
            newThumb.dataset.url = dataUrl;
            newThumb.innerHTML = `
              <img src="${dataUrl}" alt="${fileName}">
              <div class="wallpaper-overlay">
                <i class="fas fa-check"></i>
              </div>
            `;
            grid.querySelectorAll(".wallpaper-thumb").forEach((t) => t.classList.remove("active"));
            grid.appendChild(newThumb);
            newThumb.addEventListener("click", () => {
              this.userChoices.wallpaper = fileName;
              grid.querySelectorAll(".wallpaper-thumb").forEach((t) => t.classList.remove("active"));
              newThumb.classList.add("active");
            });
          }
        } catch (err) {
          console.error("Failed to save wallpaper:", err);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  bindProfileStepEvents(win) {
    const nameInput = $("#setup-profile-name", win);
    const uploadBtn = $("#setup-profile-upload", win);
    const previewName = $("#setup-profile-preview-name", win);
    const previewImg = $("#setup-profile-preview-img", win);
    const avatarOptions = $$(".setup-avatar-option", win);

    if (!nameInput || !uploadBtn || !previewName || !previewImg) return;

    nameInput.addEventListener("input", () => {
      const nextName = nameInput.value || "Guest";
      previewName.textContent = nextName;
      this.userChoices.username = nextName;
      this.refreshProfileSummary(win);
    });

    const selectAvatar = (src) => {
      this.userChoices.profilePicture = src;
      previewImg.src = src;
      avatarOptions.forEach((option) => {
        option.classList.toggle("selected", option.dataset.src === src);
        const badge = option.querySelector("div");
        if (badge) {
          badge.style.display = option.dataset.src === src ? "flex" : "none";
        }
      });
      this.refreshProfileSummary(win);
    };

    avatarOptions.forEach((option) => {
      option.addEventListener("click", () => {
        selectAvatar(option.dataset.src);
      });
    });

    uploadBtn.addEventListener("click", () => {
      const input = createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxBytes = 2000 * 1024;
        if (file.size > maxBytes) {
          os.dialog.alert(
            "Image Too Large",
            `The selected image is ${(file.size / 1024).toFixed(1)} KB. Please choose an image under 2 MB.`
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (!dataUrl) return;

          const img = new Image();
          img.onload = () => {
            const maxDim = 200;
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              const ratio = Math.min(maxDim / width, maxDim / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.7);

            this.userChoices.profilePicture = compressed;
            previewImg.src = compressed;
            this.refreshProfileSummary(win);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  refreshProfileSummary(win) {
    const summaryImg = $("#setup-summary-profile-img", win);
    const summaryName = $("#setup-summary-profile-name", win);
    if (summaryImg) {
      summaryImg.dataset.src = this.userChoices.profilePicture || PREDEFINED_AVATARS[0];
      summaryImg.src = summaryImg.dataset.src;
    }
    if (summaryName) setText(summaryName, `Profile: ${this.userChoices.username || "Guest"}`);
  }
}
