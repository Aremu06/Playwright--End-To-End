# Assertions

Assertions provide reusable interfaces to verify concrete states.

Example:
```typescript
// <domain>/assertions/title-assertion.ts
import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { Dto } from "../models/example.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateTitle implements Probe<any> {

  async verify(event, dto: Dto): Promise<void> {
      
    expect(
      event.title,
      "Title has been imported correctly",
    ).toEqual(dto.title);
  }
  
}
```

Usage:
```typescript
import { ValidateProductTitle } from "./validate-product-title";

const test = baseTest.extend({
    
  // eslint-disable-next-line no-empty-pattern
  logger: async ({}, use) => {
    await use(LoggerFactory.createLogger("OIC"));
  },
  
  // eslint-disable-next-line no-empty-pattern
  validateTitle: async ({}, use) => {
    await use(new ValidateTitle());
  },

});
```
