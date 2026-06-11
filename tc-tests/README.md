# TestChimp SmartTests

TestChimp SmartTests are built on top of **Playwright**.  That means you can bring your existing Playwright tests over as is.

Connect your repo and map a tests folder in your repo to this `tests` folder (from Project Settings -> Integrations tab).
(Similarly, you can map a folder for `plans` and have stories / scenarios you author in `Test Planning` be 
mirrored in your codebase so your agents can pick and work on them). 

TestChimp augments Playwright tests with additional capabilities making test creation, maintenance, and coverage tracking significantly 
easier.

------------------------------------------------------------------------

## What TestChimp Adds to Playwright

TestChimp extends Playwright with several capabilities designed to reduce QA friction and expand test coverage.

1. **Plain-English AI steps** inside your scripts
2. **Direct linking of tests to scenarios** for requirement traceability
3. **Exploratory agents** that detect UX and quality issues while following your tests
4. **TrueCoverage** - align test coverage with real user behaviour in production

------------------------------------------------------------------------

# `tests` folder structure (web scaffold)

All SmartTests live under `tests/`. This project uses the **web** scaffold (`project_type=web`): browser UI tests with Playwright, plus shared setup and fixtures at the top level.

    tests/
      setup/
      fixtures/
      pages/
      e2e/
      assets/
      .env-QA
      playwright.config.js

**setup/**  
Global setup runs **before** browser tests (via Playwright [project dependencies](https://playwright.dev/docs/test-global-setup-teardown#option-1-project-dependencies)). Edit `global.setup.spec.js` to seed data, prepare auth state, or other harness work shared by all e2e tests. The setup project is matched separately in `playwright.config.js` and is not part of the main test discovery glob.

Keep `@playwright/test` and `playwright` on the **same version** in your repo’s `package.json`; mismatched versions can cause `test()` in setup to fail at runtime. Check with `npm ls @playwright/test playwright`. If another dependency pulls a different `playwright` line, pin a single version with npm `overrides` (for example: `"overrides": { "playwright": "1.59.0" }`).

**fixtures/**  
`fixtures/index.js` wraps `@playwright/test` with `installTestChimp` (TrueCoverage, ExploreChimp screen markers, AI helpers). Import `test` / `expect` from `./fixtures/index.js` in specs instead of directly from `@playwright/test` when you want TestChimp runtime features. This folder is excluded from test discovery (`testIgnore`).

**pages/**  
Page objects (`.page.js` / `.page.ts`) — reusable helpers per screen. Not executed as tests; excluded via `testIgnore`.

**e2e/**  
Browser end-to-end specs (`*.spec.{js,ts}`). You may add other sibling folders under `tests/` (for example `search/`) if your `playwright.config.js` `testMatch` includes them; the default config discovers specs under `tests/` while ignoring `setup/`, `fixtures/`, and `pages/`.

**assets/**  
Binary or static files used during tests (uploads, images, fixtures data files).

**.env-X**
Environment configurations.
Each environment file defines variables accessible via:

    process.env.VAR_NAME

A default environment named **QA** is created automatically.
Additional environments can be created from the context menu on the `tests` folder.

**playwright.config.js**
Standard Playwright configuration.

TestChimp automatically installs and configures **`@testchimp/playwright`**. You can customize this
as needed (for proxies, headers, etc).

------------------------------------------------------------------------

# Using Plain-English AI Steps

Traditional scripts are powerful because they are:

-   Fast
-   Deterministic
-   Scalable
-   Maintainable

However, they can be **brittle** - small UI changes may break selectors.

TestChimp introduces **AI agentic steps** that operate by *looking at the screen* and deciding how to perform an 
instruction.

These steps are useful for handling:

-   UI selector drift
-   Random popups
-   Minor layout changes
-   Other flaky UI conditions

Because AI steps involve inference, they are slower than regular script steps. Often, using a agentic testing platform 
means having to let go of the benefits of scripts, and have all steps in all tests be agentically driven - making them 
less scalable, less debuggable. TestChimp's approach puts you in control: You get to retain the benefits of scripts, and 
bring AI steps only when needed - for those annoying / flaky portions.


### AI Commands

**ai.act**

    await ai.act("Click on the top left menu icon", { page, test });

**ai.verify**

    await ai.verify("Verify no error messages are shown", { page, test });

**ai.extract**

    const title = await ai.extract(
      "Name displayed in the dashboard title",
      { page, test }
    );

------------------------------------------------------------------------

# Authoring Tests

There are three ways to create tests in TestChimp.

### 1. Record Manual Steps

Using the **TestChimp Chrome Extension**

https://chromewebstore.google.com/detail/testchimp-ai-co-pilot-for/ailhophdeloancmhdklbbkobcbbnbglm

Unlike Playwright codegen, TestChimp analyzes your existing project structure (page objects, env files, etc.) so the 
generated test **matches your codebase style**.

------------------------------------------------------------------------

### 2. Generate Tests from Scenarios

You can generate tests from scenario steps defined in your test plans.

The agent will:

-   Execute the scenario
-   Record the actions taken
-   Generate a Playwright test aligned with your existing project structure

------------------------------------------------------------------------

### 3. Write Tests Manually

Create a blank test and write Playwright code directly.

You can freely mix:

-   Playwright commands
-   Page objects
-   AI steps

------------------------------------------------------------------------

# Linking Tests to Scenarios

Tests can be linked directly to scenarios using a simple comment:

     // @Scenario: <scenario-id> [optional title]

Example:

     // @Scenario: #TS-102 Checkout with credit card

Benefits:

-   Requirement traceability without external spreadsheets
-   Keeps the link **inside the codebase**
-   Agent friendly

When tests are generated from scenarios, this comment is added automatically by TestChimp.

------------------------------------------------------------------------

# Exploratory Agents (ExploreChimp)

ExploreChimp runs **guided exploratory testing** using your SmartTests.

Instead of exploring randomly, agents **follow the paths defined by your tests** and analyze the application along 
the way.

They inspect:

-   DOM structure
-   Visual layout
-   Console logs
-   Network activity
-   Browser performance metrics

This allows them to detect issues such as:

-   Performance regressions
-   Visual inconsistencies
-   Layout problems
-   Responsiveness issues
-   Accessibility violations
-   Internationalization issues
-   Security risks

Because SmartTests link to Scenarios -> User stories -> Folders, every issue has full traceability:

    Exploration finding
       → SmartTest
       → Scenario
       → User Story
       → Folder (Typically a sub-area / component)


Exploration findings are tagged to the screens where they occur and can be viewed in the **Atlas** tab.

Agents also update tests with screen-state annotations:

     // @Screen: Dashboard @State: Edit modal open

These annotations help the agent tag findings accurately.

------------------------------------------------------------------------

# TrueCoverage

**TrueCoverage** connects test coverage with **real production user behaviour**.

- Instrument your app to emit user events (`checkout`,`add-to-cart` etc.) using:

[`@testchimp/rum-js`](https://github.com/testchimphq/testchimp-rum-js). 

- During test runs, **`@testchimp/playwright`** augments these events with test metadata.

This allows TestChimp to overlay:

-   **What users actually do**
-   **What your tests currently cover**

TestChimp analyzes event traffic to generate stats across 4 categories per event type:

-   Demand
-   Duration
-   Depth
-   Drop-off

This makes it easy to identify **coverage gaps where it matters to the business**.

[Learn more](https://docs.testchimp.io/truecoverage/intro)

------------------------------------------------------------------------

# Running Tests in CI

1.  Connect your Git repository
    Click **Connect to GitHub** from the branch menu icon in the Smart Tests viewer.

2.  Select the repository and map your `tests` folder.

3.  Install the TestChimp reporter:

`npm install @testchimp/playwright`


4.  Configure environment variables in CI:

```
    TESTCHIMP_API_KEY   (required)
```

5.  Setup your workflow file to run tests using the standard Playwright runner.

Example workflow:

https://github.com/testchimphq/CafeTime/blob/main/.github/workflows/playwright-tests.yml

------------------------------------------------------------------------

# What the TestChimp Reporter Does

The `@testchimp/playwright` package automatically:

-   Enables **AI commands** (`ai.act`, `ai.verify`, `ai.extract`) anywhere you run
-   Augments TrueCoverage events with **test identity metadata**
-   Sends CI execution results to TestChimp, that power QA intelligence insights.

# Built for seamless QA outsourcing workflows

TestChimp integrates with your repository using a GitHub App.

Instead of relying on individual user authentication, all repository interactions are performed through the TestChimp 
App identity. This allows QA contributors to work with your test assets without requiring full repository access.

Benefits:
•	Simpler onboarding for external or outsourced QA teams
•	No need to provision individual repo accounts
•	Controlled access limited to testing folders (tests/ and plans/)

This makes it easy to scale QA efforts with external contributors while keeping your core codebase secure.