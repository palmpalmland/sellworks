import { PROJECT_ASSETS_BUCKET } from "@/lib/project-storage";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type AccountDeletionWorkspaceSummary = {
  brandId: string;
  brandName: string;
  memberCount: number;
};

export type AccountDeletionPlan = {
  mode: "full" | "partial" | "blocked";
  canDelete: boolean;
  ownedSoloWorkspaces: AccountDeletionWorkspaceSummary[];
  ownedSharedWorkspaces: AccountDeletionWorkspaceSummary[];
  joinedWorkspaces: AccountDeletionWorkspaceSummary[];
};

function summarizeBrands(params: {
  brands: Array<{ id: string; name: string }>;
  memberCounts: Map<string, number>;
}) {
  const { brands, memberCounts } = params;

  return brands.map((brand) => ({
    brandId: brand.id,
    brandName: brand.name,
    memberCount: memberCounts.get(brand.id) || 0,
  }));
}

async function getProjectsForDeletion(params: {
  userId: string;
  mode: "full" | "partial";
  ownedSoloBrandIds: string[];
}) {
  const { userId, mode, ownedSoloBrandIds } = params;

  if (mode === "full") {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((project) => project.id as string);
  }

  if (ownedSoloBrandIds.length === 0) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("id")
    .in("brand_id", ownedSoloBrandIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((project) => project.id as string);
}

async function removeProjectStorageObjects(projectIds: string[]) {
  if (projectIds.length === 0) {
    return;
  }

  const { data: assets, error: assetsError } = await supabaseAdmin
    .from("project_assets")
    .select("storage_path")
    .in("project_id", projectIds);

  if (assetsError) {
    throw new Error(assetsError.message);
  }

  const { data: outputs, error: outputsError } = await supabaseAdmin
    .from("project_outputs")
    .select("meta")
    .eq("output_type", "image")
    .in("project_id", projectIds);

  if (outputsError) {
    throw new Error(outputsError.message);
  }

  const imagePaths =
    (outputs || []).flatMap((output) => {
      const images = Array.isArray(output.meta?.images) ? output.meta.images : [];
      return images
        .map((image: unknown) =>
          typeof image === "object" && image && "storagePath" in image
            ? (image as { storagePath?: string }).storagePath || null
            : null
        )
        .filter((path: string | null): path is string => Boolean(path));
    }) || [];

  const allPaths = Array.from(
    new Set(
      [...(assets || []).map((asset) => asset.storage_path as string | null), ...imagePaths].filter(
        (path): path is string => Boolean(path)
      )
    )
  );

  if (allPaths.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin.storage.from(PROJECT_ASSETS_BUCKET).remove(allPaths);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAccountDeletionPlan(userId: string): Promise<AccountDeletionPlan> {
  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("brand_members")
    .select("brand_id")
    .eq("user_id", userId);

  if (membershipsError) {
    throw new Error(membershipsError.message);
  }

  const brandIds = Array.from(
    new Set((memberships || []).map((membership) => membership.brand_id as string).filter(Boolean))
  );

  if (brandIds.length === 0) {
    return {
      mode: "full",
      canDelete: true,
      ownedSoloWorkspaces: [],
      ownedSharedWorkspaces: [],
      joinedWorkspaces: [],
    };
  }

  const { data: brands, error: brandsError } = await supabaseAdmin
    .from("brands")
    .select("id, name, owner_user_id")
    .in("id", brandIds);

  if (brandsError) {
    throw new Error(brandsError.message);
  }

  const { data: allMembers, error: allMembersError } = await supabaseAdmin
    .from("brand_members")
    .select("brand_id")
    .in("brand_id", brandIds);

  if (allMembersError) {
    throw new Error(allMembersError.message);
  }

  const memberCounts = new Map<string, number>();
  for (const member of allMembers || []) {
    const brandId = member.brand_id as string;
    memberCounts.set(brandId, (memberCounts.get(brandId) || 0) + 1);
  }

  const ownedBrands = (brands || []).filter((brand) => brand.owner_user_id === userId);
  const joinedBrands = (brands || []).filter((brand) => brand.owner_user_id !== userId);

  const ownedSoloWorkspaces = summarizeBrands({
    brands: ownedBrands.filter((brand) => (memberCounts.get(brand.id) || 0) <= 1) as Array<{
      id: string;
      name: string;
    }>,
    memberCounts,
  });

  const ownedSharedWorkspaces = summarizeBrands({
    brands: ownedBrands.filter((brand) => (memberCounts.get(brand.id) || 0) > 1) as Array<{
      id: string;
      name: string;
    }>,
    memberCounts,
  });

  const joinedWorkspaces = summarizeBrands({
    brands: joinedBrands as Array<{ id: string; name: string }>,
    memberCounts,
  });

  if (ownedSharedWorkspaces.length > 0) {
    return {
      mode: "blocked",
      canDelete: false,
      ownedSoloWorkspaces,
      ownedSharedWorkspaces,
      joinedWorkspaces,
    };
  }

  return {
    mode: joinedWorkspaces.length > 0 ? "partial" : "full",
    canDelete: true,
    ownedSoloWorkspaces,
    ownedSharedWorkspaces: [],
    joinedWorkspaces,
  };
}

export async function deleteUserAccountData(userId: string) {
  const plan = await getAccountDeletionPlan(userId);

  if (!plan.canDelete || plan.mode === "blocked") {
    throw new Error("This account still owns a shared workspace. Transfer ownership or delete that workspace first.");
  }

  const ownedSoloBrandIds = plan.ownedSoloWorkspaces.map((workspace) => workspace.brandId);
  const projectIds = await getProjectsForDeletion({
    userId,
    mode: plan.mode,
    ownedSoloBrandIds,
  });

  await removeProjectStorageObjects(projectIds);

  if (projectIds.length > 0) {
    const { error: projectsDeleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .in("id", projectIds);

    if (projectsDeleteError) {
      throw new Error(projectsDeleteError.message);
    }
  }

  if (ownedSoloBrandIds.length > 0) {
    const { error: brandsDeleteError } = await supabaseAdmin
      .from("brands")
      .delete()
      .in("id", ownedSoloBrandIds);

    if (brandsDeleteError) {
      throw new Error(brandsDeleteError.message);
    }
  }

  const cleanupOperations = [
    supabaseAdmin.from("brand_members").delete().eq("user_id", userId),
    supabaseAdmin.from("profiles").delete().eq("id", userId),
    supabaseAdmin.from("usage_limits").delete().eq("user_id", userId),
    supabaseAdmin.from("usage_logs").delete().eq("user_id", userId),
    supabaseAdmin.from("payments").delete().eq("user_id", userId),
    supabaseAdmin.from("subscriptions").delete().eq("user_id", userId),
    supabaseAdmin.from("billing_accounts").delete().eq("owner_user_id", userId),
  ];

  const results = await Promise.all(cleanupOperations);
  const cleanupError = results.find((result) => result.error);

  if (cleanupError?.error) {
    throw new Error(cleanupError.error.message);
  }

  const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    throw new Error(authDeleteError.message);
  }

  return plan;
}
