"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Transaction } from "@/types/transaction";

const STORAGE_KEY = "cashbook-transactions";
const EMPTY: Transaction[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedTransactions: Transaction[] = EMPTY;

function readSnapshot(): Transaction[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedTransactions;
  cachedRaw = raw;
  try {
    cachedTransactions = raw ? (JSON.parse(raw) as Transaction[]) : EMPTY;
  } catch {
    cachedTransactions = EMPTY;
  }
  return cachedTransactions;
}

function getServerSnapshot(): Transaction[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  listeners.forEach((listener) => listener());
}

export function useLocalTransactions() {
  const transactions = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const addTransaction = useCallback((t: Transaction) => {
    writeTransactions([...readSnapshot(), t]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    writeTransactions(readSnapshot().filter((t) => t.id !== id));
  }, []);

  return { transactions, addTransaction, deleteTransaction };
}
