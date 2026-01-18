import { writable } from 'svelte/store';

export interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequestState {
  method: string;
  url: string;
  headers: Header[];
  queryParams: QueryParam[];
  body: string;
}

export interface ApiResponseState {
  status: number;
  time_ms: number;
  headers: Record<string, string>;
  body: string;
  size_bytes: number;
  error?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  method: string;
  url: string;
}

// Default State
const defaultRequest: ApiRequestState = {
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
  queryParams: [],
  body: `{
  "key": "value"
}`,
};

export const requestStore = writable<ApiRequestState>(defaultRequest);
export const responseStore = writable<ApiResponseState | null>(null);
export const loadingStore = writable<boolean>(false);

// History Store with LocalStorage sync
const storedHistory = typeof localStorage !== 'undefined' ? localStorage.getItem('requestHistory') : null;
const initialHistory: HistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];

export const historyStore = writable<HistoryItem[]>(initialHistory);

historyStore.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('requestHistory', JSON.stringify(value));
  }
});
