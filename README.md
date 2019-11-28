# Decathlon USA Shopify Theme

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Project Setup](#project-setup)
- [Development Process](#development-process)
- [npm scripts and Gulp tasks](#npm-scripts-and-gulp-tasks)
  - [npm Scripts](#npm-scripts)
  - [Gulp Tasks](#gulp-tasks)
- [Watch](#watch)
  - [Testing and development CLI flags](#testing-and-development-cli-flags)
- [Working with Shopify snippets](#working-with-shopify-snippets)
- [Working With Shopify Assets](#working-with-shopify-assets)
- [Stylesheets](#stylesheets)
- [JavaScript](#javascript)
  - [Type Checking](#type-checking)
  - [Conditional polyfills via polyfill.io](#conditional-polyfills-via-polyfillio)
  - [JavaScript builds & optimization via Rollup](#javascript-builds--optimization-via-rollup)
    - [Modern Bundle](#modern-bundle)
    - [Legacy Bundle](#legacy-bundle)
- [SVG Icons](#svg-icons)
- [Decathlon Patterns Submodule](#decathlon-patterns-submodule)
  - [Updating Patterns Submodule](#updating-patterns-submodule)
- [Product Page Fulfillment Options](#product-page-fulfillment-options)
- [Persistent Cart (PC)](#persistent-cart-pc)
  - [Building the client-side Persistent Cart JS](#building-the-client-side-persistent-cart-js)
  - [Where can I find the Decathlon USA Persistent Cart Heroku app URL?](#where-can-i-find-the-decathlon-usa-persistent-cart-heroku-app-url)
    - [Staging URL](#staging-url)
    - [Production URL](#production-url)
  - [Where can I find the Storefront API key?](#where-can-i-find-the-storefront-api-key)
    - [Staging API key](#staging-api-key)
    - [Production API key](#production-api-key)
  - [Default Domains & API URLs](#default-domains--api-urls)
    - [Production Default Domains & API URLs](#production-default-domains--api-urls)
    - [Staging Default Domains & API URLs](#staging-default-domains--api-urls)
    - [How are the default Domain & API URLs used?](#how-are-the-default-domain--api-urls-used)
  - [Cypress tests](#cypress-tests)
    - [Requirements](#requirements)
    - [Setup](#setup)
  - [Cypress test dashboard](#cypress-test-dashboard)
- [Local Deployment](#local-deployment)
- [Deployment via DeployBot](#deployment-via-deploybot)
  - [Automated Builds](#automated-builds)
  - [Configuring DeployBot Environment Automated Builds](#configuring-deploybot-environment-automated-builds)
  - [Add `.env` Configuration File](#add-env-configuration-file)
  - [Set Up the Build Command](#set-up-the-build-command)
  - [Set Up and Cache Build Commands](#set-up-and-cache-build-commands)
- [Updating README Table of Contents](#updating-readme-table-of-contents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project Setup

1. Clone the project, making sure to also clone the `decathlonusa-patterns` submodule (which is checked out to the folder `/patterns` within the Shopify theme repo):
   - Optimally (on Git 2.13+ - check using `git --version`),
   ```
   git clone --recurse-submodules -j2 https://github.com/decathlon-usa/shopify-theme-decathlonusa.git
   ```
   - Alternatively (on older Git),
   ```
   git clone --recursive https://github.com/decathlon-usa/shopify-theme-decathlonusa.git
   ```
   - If you forgot the flags on first clone, run
   ```
   git submodule update --init
   ```
   - After anyone has updated the `decathlonusa-patterns` submodule within this repo and committed that change to a branch of `shopify-theme-decathlonusa`, be sure to locally run
   ```
   git submodule update
   ```
1. In Mac Terminal navigate to your project's root folder.
1. Make sure Theme Kit is installed. If it's not go to https://shopify.github.io/themekit/
1. There should be a `config.yml.sample` in the root of the project. Duplicate this file and name it `config.yml`. This will have the default api information for Shopify. If you're working on a cloned theme because multiple developers are on the project, this is where you'd update your theme id.
1. Create a copy of the `.env.sample` file making sure to rename it to `.env`. Update the environment variables removing the sample values.
1. Type the command `npm install` and press enter. This will install all node dependencies for the project.

## Development Process
1. Create a branch based off of your agency's dev branch.
1. Create a Shopify Theme for your work:
    - In the Shopify admin dashboard, go to `Sales Channels -> Online Store -> Themes`
    - Starting with a baseline theme (e.g., the one that represents your agency's dev branch, as above), select `Actions -> Duplicate`
    - When the theme is duplicating or duplicated, select `Actions -> Rename` on that new theme. For clarity, use this kind of naming pattern, or similar (add or omit what makes sense)
      ```
      DEV/<dev's initials>-<agency name or initials> <PR #>: <PR description>
      ```
    - When a theme is finished being duplicated, click `Actions` then right-click on `Preview` and click `Copy link address`
    - Paste the last, numeric part of the copied URL's query string (`preview_theme_id=###########`) into your `config.yml` (add it if it's not there):
      ```
      theme_id: "###########"
      ```
    - Optionally, save the same value in a commented line in your `config.yml` with a description. This way, you'll know what themes map to what PRs:
      ```
      # Update CSS for product tiles, PR #123: "###########"
      ```
1. Open your preview theme in the browser
    - As above, go to `Actions -> Preview`, just clicking on `Preview`
1. Run `npm run dev`, which will start Gulp and Theme Kit watchers. Note that you can also run `npm run build` to build all files, and you can run `theme deploy` to upload all files to Shopify in case your theme has gotten out of date.
1. Make changes to files. Make sure to not edit any generated/built files (See below).
1. Get a URL to put in your PR description:
    - The first option is to use your theme preview using the `preview_theme_id` query parameter. After navigating to the page you want to share, add the `preview_theme_id=###########` query parameter to the end of your URL, using the ID from step 2. This preview should work with various CORS-enabled APIs, because it uses the `testing-decathlon-usa.myshopify.com` domain.
    - The 2nd option is to create a Shared Preview URL. Within a preview, at the bottom of the screen, click on the `Share preview` button, then copy the URL. You can append paths directly onto this URL to share specific pages. Some CORS-enabled APIs may not work using a Shared Preview URL.


### File structure
This shows which files not to edit, as well as which files are built to which locations:

```sh
.
├── assets
│   │ # Most of the files in this folder can be edited, but not the ones listed below:
│   │ # Check the .gitignore to make sure you aren't editing generated ones
│   ├── built-*.css # Don't edit these, they are generated via the Gulp styles task from /styles/*/index.scss
│   ├── built-*-legacy.js # Don't edit these, they are generated for IE11 via the Gulp jsC4Scripts task from /scripts/*/index.js
│   ├── built-*.js # Don't edit these, these are generated via the Gulp jsC4Scripts task from /scripts/*/index.js
│   ├── built-chunk-*.js # Don't edit these, they are the shared chunks used by multiple bundles, and they are generated by the Gulp jsC4Scripts task
│   └── patterns-*.svg # Don't edit these, they get copied over from the patterns submodule by the Gulp patterns tasks
├── patterns # This is a submodule, so if you make changes to it, make sure to send them as PR's to the patterns repo
├── scripts
│   └── *
│       └── index.js # These are the entry files, each one of these gets built into assets/built-*.js as well as assets/built-*-legacy.js
├── snippets
│   # This folder contains liquid files to be included into other liquid files
│   # We are gradually migrating source files from this folder into snippets-src
│   # In the future, all files in this folder will be copied/built files
│   # For now, there are both built files as well as source files.
│   # Only edit a file in this folder if it does not have a corresponding file in snippets-src
│   # Don't create files in this folder. Instead create them in snippets-src
├── snippets-src
│   # All files in this folder get copied to the snippets folder by the Gulp snippets task
│   # The purpose of this directory is so that we can have a nested file structure
│   # And build tools to flatten it for Shopify
└── styles
    ├── product-page # Files in here get built to assets/built-product-page.css
    └── product-tile # Files in here get built to assets/built-product-tile.css
```

## npm scripts and Gulp tasks

This project has both Gulp tasks and npm scripts. The Gulp tasks are executed via the npm scripts.

### npm Scripts

@TODO Document all npm scripts.

| npm Script Name | Description |
|---|---|
| `npm run dev` | @TODO Add description |

### Gulp Tasks

@TODO Document all Gulp tasks.

| Gulp Task Name | Description |
|---|---|
| `snippets:clean` | Deletes generated snippets from the `snippets/` directory. |
| `snippets:copy` | Generates & copies snippets from `snippets-src/` into the `snippets/` directory. Renames files in the process (e.g. `snippets-src/some/path/hello-world.liquid` -> `snippets/some-path-hello-world.liquid`) |
| `snippets` |  Runs `snippets:clean` then `snippets:copy` in sequence. |

## Watch

Typing `npm run dev` will watch a variety of directories for changes and then perform the needed gulp task. In addition to running gulp watch it will also run Themekit. You must have Shopify Themekit installed locally and the project connected in order for this to work.

- If svgs are dropped into `src/svg/icons` sass and svg sprite will run.
- If changes are made to any files in the `src/scss/**` folder then the `gulp sass` task will run which generates the css file, combines the media queries, and then converts it into a `style.css.liquid` file.
- If changes are made to any file inside the `src/js/**` folder, `gulp uglify` will run which lints all JS files in that directory, concats and files that need it, and then minify all files.

### Testing and development CLI flags

| Environment Variable      | Description                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `DEBUG`                   | (Set `=true`) Output extra debug information using `console.debug` statements                 |
| `DISABLE_CUSTOM_CHECKOUT` | (Set `=true`) Disables Shopify Storefront API custom checkout creation                        |

## Working with Shopify snippets

For details regarding working with the `snippets/` directory files, see the [`snippets-src/` README](snippets-src/README.md). 

## Working With Shopify Assets

Files in the Shopify theme's `assets` folder need to follow some special rules.

1. Shopify processes all `.liquid`-suffixed files -- which can contain `liquid` tags and object references -- to their non-`.liquid` counterparts, processing `liquid` values and blocks along the way. Therefore, `assets` **_should never_** contain a pair of duplicate files, like `my-nifty-styles.scss` and `my-nifty-styles.scss.liquid`. Ideally, include only a `.liquid` version if you need to reference `liquid` values or use `liquid` tags. Otherwise, it is fine to include only a non-`.liquid` file. Just don't have both.
1. The `assets` folder is a flat-file directory and must remain that way. Do not attempt to create subfolders within `assets`.

## Stylesheets

⚠️ This section is out-of-date, needs to be updated! ⚠️

```
styles/
├── base
├── components
├── product-page
│   ├── components
│   ├── elements
│   └── legacy
├── utilities
└── vendor
```

## JavaScript

### Type Checking

The TypeScript language server can highlight jsdoc and type issues in JS files. In every JS file that you want checked, add `// @ts-check` as the first line. It is generally a good idea to enable checking for new JS files you create and for existing files you are updating. If you are using VSCode or another editor with TS LSP support for JS files, it will automatically start checking once you add that line. You can run `npm run type` or `npm run type:watch` to find all errors in opted-in files from the command line.

You can read up on writing type annotations [here](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc).

### Conditional polyfills via polyfill.io

We are using [polyfill.io](https://polyfill.io/v3/) to send polyfills for missing browser features to older browsers. For every feature that is requested via a query parameter, polyfill.io will send the corresponding polyfill _only_ if the requesting browser doesn't have that feature built in. The query parameter with the list of polyfilled features is in ['snippets/polyfills.liquid'](./snippets/polyfills.liquid). Additional polyfills can be added by looking at the list at https://polyfill.io/v3/url-builder/.

### JavaScript builds & optimization via Rollup

The following Decathlon USA JavaScript features are optimized and built by Rollup (see `scripts/build.js`):

- Persistent Cart
- Checkout
- Store Finder
- Product Page

The `scripts/` directory houses the source JavaScript files for these Rollup-built features. Files named `index.js` in subdirectories of `scripts/` will be assumed to be bundle entry points when you run `npm run build` or `npm run dev`. Rollup is configured to create two bundles per entry point:

#### Modern Bundle

The modern bundles are saved to `assets/built-<folder-name>.js`. These files contian modern js syntax for [ES Modules-supporting browsers](https://caniuse.com/#feat=es6-module). Shared chunks are also generated (`built-chunk-*.js`) for code which is shared between multiple entry points. The chunks are loaded at runtime via `import` statements.

#### Legacy Bundle

Bundles for older browsers are also created, and are saved to `assets/built-<folder-name>-legacy.js`. These bundles are for browsers which do not support ES modules. They do not use `import` statements, and shared code gets duplicated between bundles. Modern syntax like `async`/`await` and arrow functions are transpiled into older equivalents. The only browser that we support that does not support ES modules is IE11.

All `assets/built-*.js` files are Git-ignored.

Browsers either load the modern bundles or the legacy bundles depending on whether they support ES Modules, using the `type="module"`/`nomodule` attributes. Unfortunately, some modern browsers will still fetch the legacy bundles, as documented [here](https://caniuse.com/#feat=es6-module) and [here](https://gist.github.com/jakub-g/5fc11af85a061ca29cc84892f1059fec).

You control whether or not files are optimized for production via the `NODE_ENV` environment variable in the `.env` file. Make sure the `NODE_ENV` environment variable is set to `production` for production DeployBot environments.

| Environment Variable | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `NODE_ENV`           | Use `production` to optimize the JS builds; use `development` for local development/debugging |

## SVG Icons

There's a task in gulp to create an SVG icon sprite, and to update the src/scss/globals/\__spritename_ .scss file with the appropriate classes to call the icon. If you would like to add new icons do the following:

- To create new sprites add the name of your sprite to the gulp-config array under "sprites".
- Upload your svg icon to **/src/svg/_spritename_/** With spritename matching the name you placed in the array in gulp-config.
- Run the command **gulp sprites** in your root directory.
- To add your icon to a html document use the classes ** icon icon--_filename_ **
- If you'd like to change the css that is output into **\_icons.scss** you do so by going to **src/scss/globals/mixins/\_svg-template.scss**. The file is built using mustache templating.
- If you'd like to add additional sprites you can add them to createSprites object towards the top of the gulp file. The names you enter must match with the folder you create inside the SVG directory.
- While **npm run dev** is going dropping new svgs into the folder will update the sprite.

## Decathlon Patterns Submodule

The `decathlonusa-patterns` repository is a submodule (checked out under the path `patterns/`) of this Shopify theme repo.

**Important:** Any new `snippets/*` or `assets/*` files added to the Shopify theme repo should not be named using the `patterns-` prefix. Files named using a `patterns-` prefix will be deleted as part of the "[Updating Patterns Submodule](#updating-patterns-submodule)" flow described below.

**As a rule, avoid manually creating files with the prefix `patterns-`.**

### Updating Patterns Submodule

Do this any time updates were committed in the decathlon-patterns repo and merged into that repo's master branch.

The following happens when running the `updatePatterns` Gulp task:

- Images are copied from the `patterns/` submodule directory into the Shopify theme `assets/` directory and the filenames are prefixed with `patterns-`.
- HTML/SVG patterns are copied from the `patterns/` submodule directory into the Shopify theme `snippets/` directory and filenames are prefixed with `patterns-` as well.

Here are the steps followed to create this PR:

1. Enter the directory for the Shopify theme repo: `cd shopify-theme-decathlonusa`
1. Checkout the `cloudfour-dev` branch: `git checkout cloudfour-dev`
1. Make sure the branch is up-to-date: `git pull`
1. Checkout a new branch from there: `git checkout -b chore/update-patterns`
1. Update the patterns: `npx gulp updatePatterns`
1. Double-check that updated files appear correct (all begin with `patterns`): `git status`
1. Add modified and new files: `git add -A`
1. Commit the changes: `git commit -m "Update patterns to latest"`
1. Push to the remote: `git push -u origin chore/update-patterns`

## Product Page Fulfillment Options

If you are outside of the SF area, you can set the `OUT_OF_AREA_THRESHOLD` environment variable to a large number to make the "Pickup in store" option appear, for testing.

| Environment Variable    | Description                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `OUT_OF_AREA_THRESHOLD` | The max distance from a Decathlon store (in miles) before the "Pickup in store" option is hidden |

## Persistent Cart (PC)

The Persistent Cart feature is a combination of client-side code and a server-side application with a database, that together do the following:

1. Create an association between a customer and a cart
1. Keep a customer tracking a specific cart by using a single cart token (ID) for as long as possible
1. Reconcile cart contents for a customer, combining cart contents from before they login with their persisted cart during logged-in session.
1. Rehydrate carts from the database if Shopify expires a cart a customer has been using
1. Listen to Shopify webhooks to keep up-to-date with cart contents as well as checkout events and customer deletions

### Building the client-side Persistent Cart JS

To properly build the client-side JS for Persistent Cart make sure to set the proper environment variable values for the specific environment in the `.env` file.

For local development, use "staging" values. For staging/production (in the DeployBot environment `.env` files) use staging/production values per the environment. The `.env` file should have the following environment variables configured for a proper client-side Persistent Cart JS build:

| Environment Variable                  | Description                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                            | Use `production` to optimize the JS builds; use `development` for local development/debugging                  |
| `DECATHLON_PERSISTENT_CART_URL`       | The Decathlon USA Persistent Cart Heroku app URL                                                               |
| `STOREFRONT_API_KEY`                  | The storefront API key used by Persistent Cart                                                                 |
| `STOREFRONT_API_TEST_TIMEOUT_MINUTES` | A timeout value, in minutes, between health-check calls to the Storefront API (default fallback is 15 minutes) |

### Where can I find the Decathlon USA Persistent Cart Heroku app URL?

#### Staging URL

1. Log into https://dashboard.heroku.com/apps/persistent-cart-decathlonusa-s/settings
1. In the "**Domains and certificates**" section, look for the "**Domain**"

#### Production URL

1. Log into https://dashboard.heroku.com/apps/persistent-cart-decathlonusa-p/settings
1. In the "**Domains and certificates**" section, look for the "**Domain**"

### Where can I find the Storefront API key?

#### Staging API key

1. Log into https://testing-decathlon-usa.myshopify.com/admin/apps/private
1. Click into the "**Persistent Cart + Custom Checkout App**" private app
1. In the "**Storefront API**" section, look for the "**Storefront access token**"

#### Production API key

1. Log into https://decathlon-usa.myshopify.com/admin/apps/private
1. Click into the "**Persistent Cart + Custom Checkout App**" private app
1. In the "**Storefront API**" section, look for the "**Storefront access token**"

### Default Domains & API URLs

#### Production Default Domains & API URLs

Production Domains Default: `['www.decathlon.com']`

This can be overridden via a `PRODUCTION_DOMAINS` environment variable consisting of a comma-delimited list. Example:

```
PRODUCTION_DOMAINS='foo.com,bar.com' npm run build
```

Production API URL Default: `'https://persistent-cart-decathlonusa-p.herokuapp.com'`

This can be overridden via a `PRODUCTION_API_URL` environment. Example:

```
PRODUCTION_API_URL='foo.com' npm run build
```

#### Staging Default Domains & API URLs

Staging Domains Default: `['testing-decathlon-usa.myshopify.com']`

This can be overridden via a `STAGING_DOMAINS` environment variable consisting of a comma-delimited list. Example:

```
STAGING_DOMAINS='foo.com,bar.com' npm run build
```

Staging API URL Default: `'https://persistent-cart-decathlonusa-s.herokuapp.com'`

This can be overridden via a `STAGING_API_URL` environment. Example:

```
STAGING_API_URL='foo.com' npm run build
```

#### How are the default Domain & API URLs used?

There is a check for `window.location.hostname` to determine if the result is a "production" or "staging" domain. Based on that, the "production" or "staging" API URL will be used.

All of this logic can be overridden by using the `DECATHLON_PERSISTENT_CART_URL` environment variable as shown [above](#building-the-client-side-persistent-cart-js). The purpose of providing yet another PC App URL would be if you created a Heroku Review app, which may be setup/deployed any time a PR is made to `persistent-cart-decathlonusa`.

### Cypress tests

_Note:_ Cypress has been added to the project but no E2E tests have been written. The following documentation will be most helpful once tests are added to the project.

Cypress tests have been added to help test the Persistent Cart E2E flow.

#### Requirements

You will need a Decathlon user account to be able to add items to cart and store them in the Persistent Cart. You can create a user via the Shopify theme you are testing against.

#### Setup

Create a copy of the `.env.sample` file making sure to rename it to `.env`. Update the environment variables removing the sample values.

| Environment Variable        | Description                                                                                                                                                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SHOPIFY_PREVIEW_URL`       | The [Cypress base URL](https://docs.cypress.io/guides/references/best-practices.html#Setting-a-global-baseUrl) used by all tests. This should be a [Shopify Shared Preview URL](https://help.shopify.com/en/manual/using-themes/adding-themes#share-a-theme-preview-with-others). |
| `DEC_USERNAME`              | The username for the Decathlon test account.                                                                                                                                                                                                                                      |
| `DEC_PASSWORD`              | The password for the Decathlon test account.                                                                                                                                                                                                                                      |
| `DEC_ONE_SIZE_PRODUCT_PATH` | Some Persistent Cart tests need a product to test against. This sets the path to that product. The product must not require a size selection ("one-size" products only). See `.env.sample` file for example.                                                                      |

### Cypress test dashboard

```
npm run cypress:open
```

## Local Deployment

1. Make sure your local `.env` file has the correct environment variables (see [Building the client-side Persistent Cart JS](#building-the-client-side-persistent-cart-js))

1. Build the files:

   ```
   npm run build
   ```

1. Deploy the files from your local machine to your Shopify theme via ThemeKit:
   ```
   theme deploy
   ```

It's a good practice to deploy your local files via ThemeKit as a reset. From there, you can use the [Watch](#watch) setup to continue updating your Shopify theme as you work locally.

## Deployment via DeployBot

This project follows modern development practices by implementing a [Continuous Delivery](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) setup via DeployBot. The `staging` and agency-specific branches (e.g. `<agency-name>-dev`) are automatically deployed to Shopify themes by DeployBot. Any merges into these branches will trigger a new deployment to the appropriate Shopify themes.

The `master` branch is _not_ automatically deployed.

### Automated Builds

Automated builds have also been configured as part of the deployment via DeployBot.

This means `npm run build` is executed by DeployBot when a deployment is triggered. This allows built files to not be committed into the repository (see "[JavaScript builds & optimization via Rollup](#javascript-builds--optimization-via-rollup)").

### Configuring DeployBot Environment Automated Builds

DeployBot has ["getting started" guides](https://deploybot.com/guides-code-deployment-tools/getting-started-with-deploybot) and blog posts documenting [how to setup DeployBot environments](https://deploybot.com/blog/using-multiple-environments-to-improve-your-development-workflow). Refer to DeployBot docs as needed for general DeployBot environment setup.

In addition to general DeployBot environment setup, though, you'll also need to set up an automated build step for each new DeployBot environment.

This includes:

- [add a `.env` configuration file](#add-env-configuration-file)
- [set up the build command](#set-up-the-build-command)
- [set up and cache the build commands](#set-up-and-cache-build-commands)

<!-- <figure>
  <img src="https://user-images.githubusercontent.com/459757/56153146-55132180-5f6a-11e9-9c1b-057f4b0c30fe.png">
  <figcaption><em>Example DeployBot automated build configuration</em></figcaption>
</figure> -->

### Add `.env` Configuration File

Just as you have a local `.env` file for your environment variables, you will need to add a `.env` file to the DeployBot environment. This allows you to set up staging/production environment variable values specifically for each DeployBot environment.

- [Store and deploy configuration files through DeployBot](https://deploybot.com/blog/store-and-deploy-configuration-files-through-deploybot)

You can add a new `.env` configuration file via the "Configuration files" tab:

![Add configuration files](https://user-images.githubusercontent.com/459757/56154348-2d718880-5f6d-11e9-9bb6-329ff6f72512.png)

Then add the environment variables (see [Building the client-side Persistent Cart JS](#building-the-client-side-persistent-cart-js)):

![Add environment variables to the .env file](https://user-images.githubusercontent.com/459757/56154420-54c85580-5f6d-11e9-88c5-2274ce3e55c7.png)

### Set Up the Build Command

To allow DeployBot to automatically build source code, you tell it to run the `build` npm task. Add the following in the **Compile, compress, or minimize your code** section:

```
npm run build
```

![DeployBot will build the source files and deploy them to your server automatically.](https://user-images.githubusercontent.com/459757/56155949-f309ea80-5f70-11e9-9761-3bcc91e525e2.png)

### Set Up and Cache Build Commands

To make the deploys more efficient, take advantage of cached build commands:

> Sometimes your build script needs to install certain dependencies in order to be executed. You can do that right in the build script field, but that means every time your code is deployed the dependencies will be installed again, making the build slower.
>
> A better option is to use Cached build commands option in advanced settings. Any script placed in this field will be executed only when the following files changed in your repository: Gemfile, Gemfile.lock, package.json, gulpfile.js, Gruntfile.js, project.clj, composer.json.

- [Setting up and using Build Tools](https://support.deploybot.com/article/61-setting-up-and-using-build-tools)

Add the following commands under the **Advanced options** > **Cached build commands**:

```
nvm install
nvm use
npm ci
```

![Decathlon USA Shopify theme cached build commands](https://user-images.githubusercontent.com/459757/56155589-29933580-5f70-11e9-959c-b8104e39d05f.png)

Notice the commands include `nvm install` and `nvm use`. This works in combination with the `.nvmrc` file at the root of the project to ensure the right node versions are used by DeployBot when building the files.

## Updating README Table of Contents

The table of contents for this README was generated using [DocToc](https://github.com/thlorenz/doctoc). If new README sections are added and the table of contents needs to be updated, do not update manually, instead run the following command:

```
npx doctoc --maxlevel 4 README.md
```

## Ignore Pattern
-*/decathlon-shopify-theme/assets/built*, -*/decathlon-shopify-theme/node_modules/*, -*/decathlon-shopify-theme/cypress/*, -*/decathlon-shopify-theme/patterns/*