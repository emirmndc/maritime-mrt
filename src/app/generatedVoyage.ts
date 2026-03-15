export type GeneratedVoyage = {
  owner: string;
  charterer: string;
  broker: string;
  cargo: string;
  loadport: string;
  disport: string;
  freight_term: string;
  demurrage: string;
  claim_deadline: string;
  voyage_status: string;
  upcoming_trigger: string;
  voyage_health: string;
  commercial_risk: string;
  flags: string[];
};

const STORAGE_KEY = "generated-voyage-demo";

export function saveGeneratedVoyage(voyage: GeneratedVoyage) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(voyage));
}

export function loadGeneratedVoyage(): GeneratedVoyage | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GeneratedVoyage;
  } catch {
    return null;
  }
}
