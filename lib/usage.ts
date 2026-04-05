import { supabase } from "./supabase";

export async function getUsage(userId: string) {
  const { data, error } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No usage record found for this user");

  return data;
}

export async function incrementUsage(userId: string, credits: number) {
  const { data: usage, error: fetchError } = await supabase
    .from("usage_limits")
    .select("credits_used")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!usage) throw new Error("No usage record found for this user");

  const { data, error } = await supabase
    .from("usage_limits")
    .update({
      credits_used: usage.credits_used + credits,
    })
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function logUsage(userId: string, type: string, credits: number) {
  const { error } = await supabase
    .from("usage_logs")
    .insert({
      user_id: userId,
      type,
      credits_used: credits,
    });

  if (error) throw error;
}