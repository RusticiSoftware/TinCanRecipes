### About

This repository contains the core Recipes client JavaScript API implementation, a video Recipe API implementation, a checklist Recipe API implementation, and a stateless website that leverages the various APIs. Given configuration of an LRS and optionally checklist data, the site application provides a way to leverage the API implmentations by sending statements and using the document APIs made available by the LRS.

### Configuration

In the `site/` directory there is a `config.js.template` file. Copy it to `config.js`, then set the LRS connection properties and some checklist data.

### Development

You need Node.js, npm, and bower installed before running the following steps.

After a fresh clone:

    cd base;
    npm install;
    sudo npm link;
    grunt;
    cd ../checklist;
    npm link tincan-recipes;
    npm install;
    sudo npm link;
    grunt;
    cd ../video;
    npm link tincan-recipes;
    npm install;
    sudo npm link;
    grunt;
    cd ../site;
    npm link tincan-recipes;
    npm link tincan-recipes-checklist;
    npm link tincan-recipes-video;
    npm install;
    bower install;
    grunt;

If you are going to do development on TinCanJS at the same time, you will need to `npm link` in 'tincanjs' in the `base/` directory.

    cd /path/to/TinCanJS.git;
    sudo npm link;
    cd base;
    npm link tincanjs;

Make sure to do the site configuration.
