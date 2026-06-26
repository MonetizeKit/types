/**
 * @monetizekit/types — Shared TypeScript types for the MonetizeKit SDK.
 * These types mirror the REST API response shapes.
 */

// ============================================================
// Core Resource Types
// ============================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: "trial" | "active" | "past_due" | "churned" | "free";
  planId: string | null;
  mrr: number;
  seats: number;
  maxSeats: number;
  creditsBalance: number | null;
  attributes: Record<string, unknown>;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "private";
  version: number;
  entitlements: PlanEntitlement[];
  pricing: PricingTerm[];
  trialDays: number | null;
  tags: string[];
}

export interface PlanEntitlement {
  featureId: string;
  featureKey: string;
  featureDisplayName: string;
  type: "boolean" | "limit" | "enum" | "string";
  value: string | number | boolean;
}

/**
 * A single per-unit price bracket for graduated/volume tiered pricing.
 * `upTo: null` denotes the final "and above" bracket.
 */
export interface PricingTier {
  upTo: number | null;
  unitPrice: number;
}

export interface PricingTerm {
  type: "flat" | "per_seat" | "usage" | "credits" | "setup_fee";
  amount: number;
  currency: string;
  interval: "monthly" | "annually" | "one_time";
  /** Meter this term is billed against (for `usage` terms). */
  meterId?: string;
  meterDisplayName?: string;
  /** Units included before metered overage applies. */
  includedUnits?: number;
  /**
   * How tiered overage is billed:
   *  - `graduated`: each bracket's units priced at that bracket's rate
   *  - `volume`: the whole quantity priced at the single bracket it lands in
   * Maps to Stripe's graduated/volume tier modes.
   */
  tierMode?: "graduated" | "volume";
  /** Per-unit price brackets for metered overage. */
  tieredPricing?: PricingTier[];
}

export interface FeatureDefinition {
  id: string;
  key: string;
  displayName: string;
  description: string;
  type: "boolean" | "limit" | "enum" | "string";
  enumValues: string[];
  defaultValue: unknown;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd: string | null;
  cancelAt: string | null;
  stripeSubscriptionId?: string;
}

export interface EntitlementResult {
  featureKey: string;
  featureDisplayName: string;
  type: "boolean" | "limit" | "enum" | "string";
  value: string | number | boolean;
  planValue: string | number | boolean;
  addOnDelta: number | boolean | null;
  overrideValue: string | number | boolean | null;
  effectiveValue: string | number | boolean;
  sources: string[];
}

export interface UsageData {
  meterId: string;
  meterName: string;
  current: number;
  limit: number | null;
  unit: string;
  history: Array<{ date: string; value: number }>;
}

export interface CreditBalance {
  customerId: string;
  balance: number;
  totalGranted: number;
  totalUsed: number;
  expiringAmount: number;
  expiringDate: string | null;
}

// ============================================================
// API Response Types
// ============================================================

export interface PaginatedList<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    request_id: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// ============================================================
// Webhook Types
// ============================================================

export const WebhookEventTypes = {
  CUSTOMER_CREATED: "customer.created",
  CUSTOMER_UPDATED: "customer.updated",
  CUSTOMER_DELETED: "customer.deleted",
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_UPDATED: "subscription.updated",
  SUBSCRIPTION_CANCELED: "subscription.canceled",
  CREDIT_GRANTED: "credit.granted",
  CREDIT_DEPLETED: "credit.depleted",
  USAGE_THRESHOLD: "usage.threshold",
  PLAN_PUBLISHED: "plan.published",
  ENTITLEMENT_CHANGED: "entitlement.changed",
} as const;

export type WebhookEventType = (typeof WebhookEventTypes)[keyof typeof WebhookEventTypes];

export interface WebhookEvent<T = unknown> {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  data: T;
  workspaceId: string;
}

// ============================================================
// Auth Types
// ============================================================

export interface CustomerJwtPayload {
  sub: string; // customer ID
  workspaceId: string;
  planId: string;
  iat: number;
  exp: number;
}
