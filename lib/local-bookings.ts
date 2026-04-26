export type SavedBooking = {
  id: string;
  token: string;
  date: string;
  hour: number;
  duration: number;
  name: string;
  savedAt: string;
};

const KEY = "nook:bookings";

export function readMyBookings(): SavedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<SavedBooking>[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((b) => ({
      id: String(b.id),
      token: String(b.token),
      date: String(b.date),
      hour: Number(b.hour),
      duration: typeof b.duration === "number" ? b.duration : 1,
      name: String(b.name ?? ""),
      savedAt: String(b.savedAt ?? ""),
    }));
  } catch {
    return [];
  }
}

export function saveMyBooking(b: SavedBooking) {
  if (typeof window === "undefined") return;
  const all = readMyBookings().filter((x) => x.id !== b.id);
  all.push(b);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  notify();
}

export function removeMyBooking(id: string) {
  if (typeof window === "undefined") return;
  const all = readMyBookings().filter((x) => x.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  notify();
}

export function updateMyBooking(
  id: string,
  patch: Partial<SavedBooking>,
) {
  if (typeof window === "undefined") return;
  const all = readMyBookings().map((x) =>
    x.id === id ? { ...x, ...patch } : x,
  );
  window.localStorage.setItem(KEY, JSON.stringify(all));
  notify();
}

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nook:bookings:changed"));
}
