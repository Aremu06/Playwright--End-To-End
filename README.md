# Overview

This project is used to run end-to-end tests for all services using playwright.


# Documentation

Confluence:
- [Test Automation Guidelines](https://fitmart-gmbh.atlassian.net/wiki/spaces/IE/pages/2496888856/Test+Automation+Guidelines)

Guidelines:
- [Assertions](docs/guidelines/assertions.md)
- [Fixture Loading](docs/guidelines/fixture-loading.md)
- [Logging](docs/guidelines/logging.md)
- [Plugins](docs/guidelines/plugins.md)
- [Testing](docs/guidelines/testing.md)
- [Git](docs/guidelines/git.md)
- [Local Development](docs/guidelines/local-development.md)
- [AWS & SSO](docs/guidelines/aws-sso.md)


Playwright:
- [Playwright documentation (Overview)](https://playwright.dev/docs/intro)
- [Playwright API testing](https://playwright.dev/docs/api-testing)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Reporters](https://playwright.dev/docs/test-reporters)


# Local development

Needed dependencies:
- Docker
- Make
- AWS Access
- Bitwarden Access
- GitHub Access with SSH key in profile settings


Clone the repository in your desired local folder:
```sh
git clone <ssh-repo-url> .
```

Copy your local config file:
```sh
cp .env.local.dist .env.local
```

Edit your new .env.local and fill all needed variables from bitwarden.


Build docker container and install project dependencies:
```sh
make init
```

List all available commands:
```
make help
```

Further documentation:
> See [Local Development](docs/guidelines/local-development.md)
