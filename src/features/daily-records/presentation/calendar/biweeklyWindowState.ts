import {
  initialBiweekStart,
  nextBiweekStart,
  prevBiweekStart,
  toIsoDate,
} from "../../../../core/utils/date";

export interface BiweeklyWindowState {
  windowStartIso: string;
  selectedIso: string | null;
}

export type WindowAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "today"; today: Date }
  | { type: "select"; iso: string };

export function createInitialBiweeklyWindowState(today: Date): BiweeklyWindowState {
  return {
    windowStartIso: initialBiweekStart(today),
    selectedIso: toIsoDate(today),
  };
}

export function biweeklyWindowReducer(
  state: BiweeklyWindowState,
  action: WindowAction,
): BiweeklyWindowState {
  switch (action.type) {
    case "next":
      return {
        ...state,
        windowStartIso: nextBiweekStart(state.windowStartIso),
      };
    case "prev":
      return {
        ...state,
        windowStartIso: prevBiweekStart(state.windowStartIso),
      };
    case "today": {
      const todayIso = toIsoDate(action.today);
      return {
        windowStartIso: initialBiweekStart(action.today),
        selectedIso: todayIso,
      };
    }
    case "select":
      return {
        ...state,
        selectedIso: action.iso,
      };
    default:
      return state;
  }
}
