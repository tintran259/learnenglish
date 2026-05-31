export interface ColorTheme {
  id: string;
  label: string;
  primary: string;
  shadow: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: "lime",   label: "Lime",   primary: "#84cc16", shadow: "#65a30d" },
  { id: "green",  label: "Green",  primary: "#58cc02", shadow: "#46a302" },
  { id: "blue",   label: "Blue",   primary: "#3b82f6", shadow: "#1d4ed8" },
  { id: "purple", label: "Purple", primary: "#a855f7", shadow: "#7e22ce" },
  { id: "orange", label: "Orange", primary: "#f97316", shadow: "#c2410c" },
  { id: "rose",   label: "Rose",   primary: "#f43f5e", shadow: "#be123c" },
];

export const DEFAULT_THEME_ID = "lime";

export function getTheme(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

// Inlined in layout <script> to avoid FOUC — keep in sync with COLOR_THEMES above
export const THEME_INIT_SCRIPT = `(function(){
  var T={"lime":["#84cc16","#65a30d"],"green":["#58cc02","#46a302"],"blue":["#3b82f6","#1d4ed8"],"purple":["#a855f7","#7e22ce"],"orange":["#f97316","#c2410c"],"rose":["#f43f5e","#be123c"]};
  try{var id=localStorage.getItem("app-color-theme")||"lime";var t=T[id]||T.lime;var r=document.documentElement;r.style.setProperty("--app-primary",t[0]);r.style.setProperty("--app-primary-shadow",t[1]);}catch(e){}
})();`;
