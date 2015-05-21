# Yeoman generator for BridgePhase

This will serve as a scaffolding generator for BridgePhase projects. To use these locally, clone the repository and navigate to one of the `generator-*` folders. From there, execute:

`npm install`

followed by

`npm link`

These command will allow you to use these modules locally without having to worry about them being registered in the global NPM registry (**TODO:** _this will follow soon_)

You will need Node.js, NPM (bundled with Node.js), and Yeoman to use the generators. Yeoman can be installed by running:

`npm install -g yeoman`

When you want to scaffold a new project, all you need to do is navigate to a new directory and run:

`yo <generator_name>` for example: `yo bridgephase-javastarter`

The `<generator_name>` comes from after the word `generator-` of the `generator-*` folder.
