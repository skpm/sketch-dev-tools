<h1 align="center">Sketch DevTools</h1>

<div align="center">
  <img src="https://user-images.githubusercontent.com/3254314/32320758-1dc414d8-bfbf-11e7-9282-1d57fc53874d.png" />
</div>
<br />
<div align="center">
  <strong>See your plugin logs, inspect the state of Sketch documents, explore actions, and more.</strong>
</div>

## Installation

### From a release (simplest)

* [Download](https://github.com/skpm/sketch-dev-tools/releases/latest) the latest release of the plugin
* Un-zip
* Double-click on the sketch plugin

### From the sources

* Clone the repo
* Install the dependencies (`npm install`)
* Build (`npm run build`)
* Double-click on plugin.sketchplugin

## Usage

If you want to show some proper logs in the DevTools, you need to use `console` (as apposed to `log` directly). `console` is polyfilled by [`skpm`](https://github.com/skpm/skpm) automatically.

You might notice performance issues when the debugger is opened, that's because it's listening to all actions.

## Contributing

Lots of room for improvement, let's build it together :) Check out the [issues](https://github.com/skpm/sketch-dev-tools/issues) and pick one!

## License

MIT


