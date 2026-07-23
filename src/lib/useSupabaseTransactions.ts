"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Transaction } from "@/types/transaction";

interface TransactionRow {
  id: string;
  type: Transaction["type"];
  amount: number | string;
  category: string;
  memo: string | null;
  date: string;
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    memo: row.memo ?? "",
    date: row.date,
  };
}

export function useSupabaseTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("id, type, amount, category, memo, date")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setTransactions((data as TransactionRow[]).map(rowToTransaction));
  }, []);

  useEffect(() => {
    fetchTransactions().finally(() => setLoading(false));
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (t: Transaction) => {
    // 낙관적 업데이트: 화면에 먼저 반영
    setTransactions((prev) => [t, ...prev]);

    const { error } = await supabase.from("transactions").insert({
      id: t.id,
      type: t.type,
      amount: t.amount,
      category: t.category,
      memo: t.memo,
      date: t.date,
    });

    if (error) {
      // 실패 시 롤백
      setTransactions((prev) => prev.filter((x) => x.id !== t.id));
      setError(error.message);
    }
  }, []);

  const deleteTransaction = useCallback(
    async (id: string) => {
      const prev = transactions;
      // 낙관적 업데이트
      setTransactions((cur) => cur.filter((x) => x.id !== id));

      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) {
        // 실패 시 롤백
        setTransactions(prev);
        setError(error.message);
      }
    },
    [transactions]
  );

  return { transactions, loading, error, addTransaction, deleteTransaction };
}
