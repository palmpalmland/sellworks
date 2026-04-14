import { NextResponse } from "next/server";
import { getAccountDeletionPlan } from "@/lib/account-deletion";
import { getUserFromBearerRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const plan = await getAccountDeletionPlan(user.id);
    return NextResponse.json({ data: plan });
  } catch (caughtError: unknown) {
    return NextResponse.json(
      {
        error: caughtError instanceof Error ? caughtError.message : "Failed to check account deletion rules",
      },
      { status: 500 }
    );
  }
}
