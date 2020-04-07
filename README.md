
# Timber Gulp Starter Theme
A fast, easy way to get started on a custom Wordpress theme.

## Dependencies
- Timber - [https://wordpress.org/plugins/timber-library/](https://wordpress.org/plugins/timber-library/)

## Setting up the Development Environment

For a development environment, feel free to use whatever you want. You could use [MAMP](https://www.mamp.info/en/mamp/), [XAMPP](https://www.apachefriends.org/index.html), Flywheel's [Local](https://localwp.com/), a Docker container, or a Vagrant setup like [vccw](http://vccw.cc/) or [VVV](https://varyingvagrantvagrants.org/).

Additionally, ensure that the appropriate PHP code linters are installed. This project uses PHP_CodeSniffer along with Wordpress code sniffs.

1. Make sure you have Composer installed.
2. Install PHP_CodeSniffer globally via Composer:
`composer global require "squizlabs/php_codesniffer=*"`
3. Install phpcodesniffer-composer-installer to sort out the PHPCS 'installed_paths' automatically:
`composer global require "dealerdirect/phpcodesniffer-composer-installer"`
4. Install the Wordpress code sniffs:
`composer global require "wp-coding-standards/wpcs"`
5. Confirm that both PHP_CodeSniffer and the Wordpress code sniffs are installed:
`phpcs -i`

## Setting up the Theme on Your Development Environment

1. Clone the repository on your development machine using git.
2. In the gulpfile.babel.js, under the "serve" task, make sure that the proxy and port match with whatever setup you have (e.g. localhost, vhost, etc.).

## Installing the Theme on Your Wordpress Website

Install this theme as you would any other, and be sure the Timber plugin is activated. But hey, let's break it down into some bullets:

1. Make sure you have installed the plugin for the [Timber Library](https://wordpress.org/plugins/timber-library/) (and Advanced Custom Fields - they [play quite nicely](https://timber.github.io/docs/guides/acf-cookbook/#nav) together). 
2. Download the zip for this theme (or clone it) and move it to `wp-content/themes` in your WordPress installation. 
3. Rename the folder to something that makes sense for your website (generally no spaces and all lowercase). You could keep the name `timber-starter-theme` but the point of a starter theme is to make it your own!
4. Activate the theme in Appearance >  Themes.
5. Do your thing!

## What's here?

`static/` is where you can keep your static front-end scripts, styles, or images. In other words, your Sass files, JS files, fonts, and SVGs would live here.

`templates/` contains all of your Twig templates. These pretty much correspond one-to-one with the PHP files that respond to the WordPress template hierarchy. At the end of each PHP template, you'll notice a `Timber::render()` function whose first parameter is the Twig file where that data (or `$context`) will be used. Just an FYI.

`bin/` and `tests/` ... basically don't worry about (or remove) these unless you know what they are and want to.

## Other Resources

The [main Timber Wiki](https://github.com/jarednova/timber/wiki) is super great, so reference those often. Also, check out these articles and projects for more info:

* [This branch](https://github.com/laras126/timber-starter-theme/tree/tackle-box) of the starter theme has some more example code with ACF and a slightly different set up.
* [Twig for Timber Cheatsheet](http://notlaura.com/the-twig-for-timber-cheatsheet/)
* [Timber and Twig Reignited My Love for WordPress](https://css-tricks.com/timber-and-twig-reignited-my-love-for-wordpress/) on CSS-Tricks
* [A real live Timber theme](https://github.com/laras126/yuling-theme).
* [Timber Video Tutorials](http://timber.github.io/timber/#video-tutorials) and [an incomplete set of screencasts](https://www.youtube.com/playlist?list=PLuIlodXmVQ6pkqWyR6mtQ5gQZ6BrnuFx-) for building a Timber theme from scratch.

