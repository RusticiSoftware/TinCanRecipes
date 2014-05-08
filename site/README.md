Sample App for dog fooding Tin Can Recipes client APIs

Build from the root directory using `grunt`. For continuous building use `grunt watch`.

Depends on node, npm, and bower. Install additional dependencies with `npm install` and `bower install`.

All functionality is handled through 3 files as a single page app. `index.html` in this directory handles loading the requisite JS and CSS from the `assets` directory. The build process updates those asset files based on a SHA1 of their contents and sets that SHA1 in the index itself.
