import { createClient, type User } from "@supabase/supabase-js";

export async function getUserFromBearerRequest(
  req: Request
): Promise<{ user: User | null; error: string | null }> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Unauthorized" };
  }

  const token = authHeader.replace("Bearer ", "");

  const supabaseUserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
    error,
  } = await supabaseUserClient.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: "Invalid user" };
  }

  return { user, error: null };
}
