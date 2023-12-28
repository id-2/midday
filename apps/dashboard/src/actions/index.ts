"use server";

import { env } from "@/env.mjs";
import { getUser } from "@midday/supabase/cached-queries";
import {
  createEnrichmentTransaction,
  updateSimilarTransactions,
  updateTransaction,
} from "@midday/supabase/mutations";
import { createClient } from "@midday/supabase/server";
import { invalidateCacheAction } from "./invalidate-cache-action";

const baseUrl = "https://api.resend.com";

export async function sendFeeback(formData: FormData) {
  const supabase = await createClient();
  const feedback = formData.get("feedback");
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${baseUrl}/email`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "feedback@midday.ai",
      to: "pontus@lostisland.co",
      subject: "Feedback",
      text: `${feedback} \nName: ${session?.user?.user_metadata?.name} \nEmail: ${session?.user?.email}`,
    }),
  });

  const json = await res.json();

  return json;
}

export async function updateTransactionAction(id: string, payload: any) {
  const supabase = await createClient();
  const { data } = await updateTransaction(supabase, id, payload);

  // Add category to global enrichment_transactions
  if (data?.category) {
    createEnrichmentTransaction(supabase, {
      name: data.name,
      category: data.category,
    });
  }

  invalidateCacheAction([
    `transactions_${data.team_id}`,
    `spending_${data.team_id}`,
    `metrics_${data.team_id}`,
  ]);
}

export async function updateSimilarTransactionsAction(id: string) {
  const supabase = await createClient();
  await updateSimilarTransactions(supabase, id);
  const user = await getUser();
  const teamId = user.data.team_id;

  invalidateCacheAction([
    `transactions_${teamId}`,
    `spending_${teamId}`,
    `metrics_${teamId}`,
  ]);
}
