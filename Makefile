-include .env
export

# include all custom makefiles
-include Makefiles/*.mk

LOCAL_DOCKER_IMAGE := end-2-end-tests
DOCKER_RUN := docker run -it -v ${PWD}:/var/e2e -v ~/.aws:/root/.aws -e AWS_PROFILE=${AWS_PROFILE} -e AWS_REGION=${AWS_REGION} -e LOG_LEVEL=$(LOG_LEVEL) --rm --entrypoint= $(LOCAL_DOCKER_IMAGE)

########
# Help #
########

.DEFAULT_GOAL := help

.PHONY: help
help: ## Lists all available commands
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


#########
# Build #
#########

.PHONY: init ## Builds container and installs all dependencies (covers "build" and "install")
init: build install

.PHONY: build
build: ## Builds the docker container
	docker build \
		--file docker/Dockerfile \
        --tag $(LOCAL_DOCKER_IMAGE) \
        --target development \
        --no-cache \
        .

.PHONY: install
install: ## Installs all dependencies
	$(DOCKER_RUN) npm install


####################
# Service Commands #
####################

.PHONY: shell
shell sh: ## Open a shell inside the container
	$(DOCKER_RUN) /bin/bash


##################
# Test execution #
##################

.PHONY: test
test: ## Execute all tests
	$(DOCKER_RUN) npx playwright test


.PHONY: test-specific
test-specific: ## Execute specific tests NAME=tests/<domain>/ OR NAME=tests/<domain>/<test>.spec.ts
	$(DOCKER_RUN) npx playwright test $(NAME) --reporter=list


.PHONY: test-specific-html
test-specific-html: ## Execute specific tests NAME=tests/<domain>/ OR NAME=tests/<domain>/<test>.spec.ts
	$(DOCKER_RUN) npx playwright test $(NAME) --debug


.PHONY: ui
ui: ## Run in ui mode
	npx playwright test --ui


###################
# Helper Commands #
###################

.PHONY: checks
checks: ## Run all checks
	$(DOCKER_RUN) npm run checks

.PHONY: fix
fix: ## Run auto fixing
	$(DOCKER_RUN) npm run fix

.PHONY: update
update: ## Update all dependencies
	$(DOCKER_RUN) npm update
