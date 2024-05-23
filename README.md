![B2B Edition Open source Buyer Portal](https://storage.googleapis.com/bigcommerce-developers/images/B2B-edition-1024x683.jpg)

# B2B Edition: Open source Buyer Portal

The Buyer Portal is a frontend application built using [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/), and [Vite]().

By choosing to build on top of the open source Buyer Portal, 

you'll have access to build on our B2B buyer portal application backed by a robust set of SaaS APIs. 
You can get straight to work building for your unique B2B business cases.


[🚀 B2B Edition platform](https://www.bigcommerce.com/solutions/b2b-ecommerce-platform/)

[🤗 BigCommerce developer community](https://developer.bigcommerce.com/community)

[📝 B2B Edition docs](https://developer.bigcommerce.com/docs/b2b-edition) 



## Getting started

lorem ipsum

### Prerequisites

* A [BigCommerce store]() or [developer sandbox]() with the B2B Edition app installed
* Access to the store control panel
* Node.js >=18.0.0. We recommend installing with [nvm](https://github.com/nvm-sh/nvm).
* This guide uses `yarn` to manage packages. You can use your package manager of choice.

```shell
nvm install 18
nvm use 18
npm i -g yarn
```

## Store control panel configuration

1. In the store control panel, go the [B2B Edition app dashboard]() and select **Storefronts** in the sidebar menu.

![B2B Edition app sidebar menu with the Storefronts item circled](https://storage.googleapis.com/bigcommerce-production-dev-center/images/b2b/b2b-edition-app-sidebar-menu.png)

2. Enable B2B Edition on the desired storefront channel or channels. To inquire about activating multi-storefront support, email us at [b2b@bigcommerce.com](mailto:b2b@bigcommerce.com).

![B2B Edition app storefront settings menu showing B2B enabled on 2 storefront channels](https://storage.googleapis.com/bigcommerce-production-dev-center/images/b2b/b2b-edition-app-storefront-settings.png)

## Dev server configuration

1. Clone the project to your local environment:

```bash
git clone git@github.com:bigcommerce/b2b-buyer-portal.git && cd b2b-buyer-portal
```

2. Install dependencies using `yarn`.
3. Copy environment variables: `cp apps/storefront/.env-example apps/storefront/.env`.
4. Update the following values in `.env`:

- `VITE_CHANNEL_ID`: The ID of the channel to use for the storefront.
- `VITE_STORE_HASH`: The hash of the store to use for the storefront.
- `VITE_ASSETS_ABSOLUTE_PATH`: For deployment, set this to the absolute path of the hosted compiled assets.

Environment variables have been updated so you can run your UI directly into production storefronts.

6. If linters aren't functional, run `yarn prepare` first.
7. Start the development server: `yarn RUN dev`.

## Update storefront scripts

1. Activate store channel in the Channels Manager.
2. Configure header and footer scripts:

- Navigate to Channels Manager -> Scripts.
- Add two scripts (e.g., B2BEdition-header, B2BEdition-footer). Ensure you set the correct port for your localhost in the script URLs.
- Edit the header script:

```html
<script>
  {{#if customer.id}}
  {{#contains page_type "account"}}
  var b2bHideBodyStyle = document.createElement('style');
  b2bHideBodyStyle.id = 'b2b-account-page-hide-body';
  b2bHideBodyStyle.innerHTML = 'body { display: none !important }';
  document.head.appendChild(b2bHideBodyStyle);
  {{/contains}}
  {{/if}}

  // preload the vite server for local development
  fetch("http://localhost:3001/");
</script>
<script type="module">
  import RefreshRuntime from 'http://localhost:3001/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:3001/@vite/client"></script>
<script
  type="module"
  src="http://localhost:3001/index.html?html-proxy&index=0.js"
></script>
```

- Edit the footer script:

```html
<script type="module" src="http://localhost:3001/src/main.ts"></script>
```

5. Visit the storefront and attempt to sign in.

## Debugging

3. Verify correct values in the .env file, especially the client_id for the draft app.

4. For local debugging, set VITE_LOCAL_DEBUG to false in .env.

6. For cross-origin issues, update URL variables in .env to use the tunnel URL with HTTPS.

- **Cross-Origin Issues:** If you encounter cross-origin issues, ensure you have the correct URLs in your `.env` file and verify that your store's origin URL is allowed. You can use a tunnel service like [ngrok](https://ngrok.com/) to expose your local server to the internet.
- **Environment Variables:** Ensure you have the correct environment variables set in your `.env` file. These variables are used to configure your application for different environments.
- **Header and Footer Scripts:** Ensure you have the correct header and footer scripts set in your BigCommerce store. These scripts are used to load your application into the storefront.
- **Build Errors:** If you encounter build errors, ensure you have the correct dependencies installed and that your project is set up correctly. You can run `yarn prepare` to ensure all dependencies are installed and up to date.

## 🚀 Tech stack and tooling

- **Monorepo Management:** Turborepo
- **Type System:** TypeScript
- **Frontend Library:** React 18
- 
- **Build Tool:** Vite
- **Linting:** ESLint
- **Commit Standards:** commitlint
- **Git Workflow Tools:** Husky, lint-staged
- **UI Framework:** MUI 5
- **Routing:** React Router 6
- 
## 📦 Workspaces

- **Application:** `/apps/storefront` - A next-gen B2B Edition storefront application.
  - You can run multiple apps concurrently via turborepo [tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks).
- **Packages:**
  - `/packages/eslint-config-b3` - Shared ESLint configurations.
  - `/packages/tsconfig` - Shared TypeScript configurations.
  - `/packages/ui` - A collection of UI components built by B3.
  - `/packages/store` - A collection of shared store logic.
  - `/packages/b3global` - A collection of shared global logic.

## Deployment

Building your buyer portal application requires you to run the `yarn build:production` command. This command will generate a `dist` folder in the `apps/storefront` directory and inside an `assets` folder containing the compiled assets.

**_Before building, make sure you have updated your `VITE_ASSETS_ABSOLUTE_PATH` variable pointing to where the assets folder is hosted as we'll be using this to generate the correct asset paths for the application when its mounted._**

Once you have uploaded the contents of the `dist` folder to your hosting provider, you'll have to create a footer script in your BigCommerce storefront that points to the built files generated in the `dist` folder. The contents of the script are the same as the footer script B2B Edition installs in your store, but with the updated paths. It should look something like this:

```html
<script>
  window.b3CheckoutConfig = {
    routes: {
      dashboard: '/account.php?action=order_status',
    },
  }
  window.B3 = {
    setting: {
      store_hash: '<YOUR_STORE_HASH>',
      channel_id: '<YOUR_CHANNEL_ID>',
      b2b_url: 'https://api-b2b.bigcommerce.com',
      captcha_setkey: '6LdGN_sgAAAAAGYFg1lmVoakQ8QXxbhWqZ1GpYaJ',
    },
    'dom.checkoutRegisterParentElement': '#checkout-app',
    'dom.registerElement':
      '[href^="/login.php"], #checkout-customer-login, [href="/login.php"] .navUser-item-loginLabel, #checkout-customer-returning .form-legend-container [href="#"]',
    'dom.openB3Checkout': 'checkout-customer-continue',
    before_login_goto_page: '/account.php?action=order_status',
    checkout_super_clear_session: 'true',
    'dom.navUserLoginElement': '.navUser-item.navUser-item--account',
  }
</script>
<script
  type="module"
  crossorigin=""
  src="<YOUR_APP_URL_HERE>/index.*.js"
></script>
<script
  nomodule=""
  crossorigin=""
  src="<YOUR_APP_URL_HERE>/polyfills-legacy.*.js"
></script>
<script
  nomodule=""
  crossorigin=""
  src="<YOUR_APP_URL_HERE>/index-legacy.*.js"
></script>
```

Replace `<YOUR_APP_URL_HERE>` with the URL where your build is hosted, `<YOUR_STORE_HASH>` and `<YOUR_CHANNEL_ID>` with its respective values. Replace the `*` in the file names with the generated hash from the build step.

Also, you'll have to input the following header script:

```html
<script>
  var b2bHideBodyStyle = document.createElement('style')
  b2bHideBodyStyle.id = 'b2b-account-page-hide-body'
  const removeCart = () => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.id = 'b2bPermissions-cartElement-id'
    style.innerHTML =
      '[href="/cart.php"], #form-action-addToCart, [data-button-type="add-cart"], .button--cardAdd, .card-figcaption-button, [data-emthemesmodez-cart-item-add], .add-to-cart-button { display: none !important }'
    document.getElementsByTagName('head').item(0).appendChild(style)
  }
  removeCart()
</script>
```

## 🤝 Contribution

We 💖 your contributions! If you'd like to contribute code, open a PR that meets the linting and commit message standards that our tooling provides.

## 📞 Contact & Support

For queries, issues, or support, reach out to us at [b2b@bigcommerce.com](mailto:b2b@bigcommerce.com).

For help implementing the buyer portal, you can [raise an issue](https://github.com/bigcommerce/b2b-buyer-portal/issues) or [open a pull request](https://github.com/bigcommerce/b2b-buyer-portal/pulls) at [https://github.com/bigcommerce/b2b-buyer-portal](https://github.com/bigcommerce/b2b-buyer-portal). You can also join the [BigCommerce developer community](https://developer.bigcommerce.com/community).
