# @monetizekit/types

Shared TypeScript types for the [MonetizeKit](https://monetizekit.app) SDK. These
mirror the REST/GraphQL API resource shapes and are consumed by
`@monetizekit/node`, `@monetizekit/embed`, and the `@monetizekit/react` package
(and are useful directly when calling the API from your own TypeScript code).

## Install

```bash
npm install @monetizekit/types
```

## Usage

```ts
import type { Customer, Plan, PricingTerm, EntitlementResult } from "@monetizekit/types";

async function getPlans(): Promise<Plan[]> {
  const res = await fetch("https://app.monetizekit.app/api/v1/plans?page=1&pageSize=50", {
    headers: { Authorization: `Bearer ${process.env.MK_PUBLISHABLE_KEY}` },
  });
  const body = (await res.json()) as { data: Plan[] };
  return body.data;
}
```

Type-only package — it ships declarations (`.d.ts`) plus empty ESM/CJS entry
points, so it adds no runtime weight.

## License

MIT
