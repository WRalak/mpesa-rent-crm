type AuthSnapshot = {
  userId: string | null;
  role: string | null;
  phone: string | null;
};

const initialState: AuthSnapshot = {
  userId: null,
  role: null,
  phone: null,
};

let state: AuthSnapshot = initialState;

export function getAuthState() {
  return state;
}

export function setAuthState(next: Partial<AuthSnapshot>) {
  state = { ...state, ...next };
}

export function resetAuthState() {
  state = initialState;
}
