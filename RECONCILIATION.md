# Reconciliaion Notes 

This document is made for Decathlon AU developers to have a reference about the app files that they need to commit to the repo and which files they can ignore because they are automatically injected by Shopify apps.abs


App-related items to commit:

#### [Store locator](https://github.com/DecathlonDigitalAU/decathlon-au-shopify-theme/commit/23ab52e9b2fc6662f21d03fdb9d179f450ce57e0)
- sca.api.storelocator.css
- sca.storelocator.css
- sca.storelocator_scripttag.js
- sca.storelocator.liquid
- page.sca-storelocator.json

Note: If a file has a `sca` keyword, check it as it might be related to the store locator app.

#### Algolia

- assets/algolia_config.js.liquid


Apart from these app related items, make sure to review all the files downloaded during reconciliation to make sure we are capturing every relevant changes from the latest published theme. 
