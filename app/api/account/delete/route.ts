import { NextResponse } from "next/server";
import { deleteUserAccountData } from "@/lib/account-deletion";
import { getUserFromBearerRequest } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const confirmation = body?.confirmation?.toString().trim().toUpperCase();

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: 'Type DELETE to confirm account deletion.' },
        { status: 400 }
      );
    }

    const plan = await deleteUserAccountData(user.id);
    return NextResponse.json({ data: { deleted: true, mode: plan.mode } });
  } catch (caughtError: unknown) {
    const message =
      caughtError instanceof Error ? caughtError.message : "Failed to delete account";

    return NextResponse.json(
      { error: message },
      {
        status: message.includes("shared workspace") ? 409 : 500,
      }
    );
  }
}
