export type ProductKey = 'marketplace' | 'coach-studio';

export type ProductRoleKey = 'member' | 'trainer' | 'manager' | 'admin' | 'owner';

export type PlanKey =
  | 'free'
  | 'pro'
  | 'verified'
  | 'starter'
  | 'growth'
  | 'enterprise'
  | 'custom';

export interface UserProductAccess {
  product: ProductKey;
  roles: ProductRoleKey[];
  plan?: PlanKey | null;
  active?: boolean;
}

export function hasProductAccess(accessList: UserProductAccess[], product: ProductKey) {
  return accessList.some((entry) => entry.product === product && entry.active !== false);
}

export function hasProductRole(
  accessList: UserProductAccess[],
  product: ProductKey,
  role: ProductRoleKey,
) {
  return accessList.some(
    (entry) => entry.product === product && entry.active !== false && entry.roles.includes(role),
  );
}
