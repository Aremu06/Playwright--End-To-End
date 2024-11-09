## Fixtures Loader

If you want to load fixtures, you can use the fixturesLoader.
To use the loader, import `getFixtures` and get the fixtures from your fixtures file:

```typescript
import { getFixtures } from "../../src/core/fixturesLoader/fixturesLoader.ts";

//getting test data using fixtures
(async () => {
    try {
        fixtures = await getFixtures(
            locationOfFixturesFile,
        );
        logger.info("Loading fixtures", { additional: fixtures });
    } catch (error) {
        logger.error("Error loading fixtures:", fixtures);
    }
})();
let fixtures: string[] = [];
```
