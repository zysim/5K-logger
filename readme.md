# Tracker

## Intro

Hello and welcome to the Tracker app. This logs my 5K lap times. It uses React, Laravel 5.7, and CouchDB. What do you mean that is overkill.

## A Priori

This uses:

-   [React](http://reactjs.org/) at the front;
-   [Laravel 5.7](https://laravel.com/) at the back; and
-   [Couch](https://couchdb.apache.org/) for data

This app uses [Laravel's Homestead](https://laravel.com/docs/5.7/homestead) too, which involves installing a VM provider too; that doc page lists which ones you can get.

## Installation

I mean, why would you wanna work on this but sure:

> If you really know what you're doing you can tweak the installation steps I'm about to describe.

I installed Homestead as a global package in my machine. [Read the docs](https://laravel.com/docs/5.7/homestead) if you'd like to install Laravel directly in the project.

After installing and configuring Homestead and VirtualBox (and additionally, going through "Accessing Homestead Globally" in [this chapter](https://laravel.com/docs/5.7/homestead#daily-usage)), run these in the terminal:

```
$ git clone <this/repo.git> && cd <this/repo>
$ homestead up
$ homestead ssh
vagrant@homestead:~$ cd code // or your equivalent folder
vagrant@homestead:~/code$ php artisan preset react
vagrant@homestead:~/code$ composer install
vagrant@homestead:~/code$ npm install
```

**TL;DR:**

1. Install and configure Homestead and VirtualBox
1. Clone this repo and cd into it
1. `homestead up`
1. `homestead ssh` into the VM
1. `php artisan preset react`
1. `composer install`
1. `npm install`

## Working the Front

> If this is a fresh install, remember to run `php artisan preset react` in a terminal. This replaces the original Vue scaffolding to a React one.

Open up `resources/assets/js/app.js` and `resources/assets/js/components/Main.js` to learn how a React component gets tied into the overall shebang. Laravel+React uses [Laravel Mix](https://laravel.com/docs/5.7/mix) to work, so read that link. In particular, [this tiny section in the page](https://laravel.com/docs/5.7/mix#react).

Once you have that sorted out, go do your React-ing. Then run either `npm run dev` or `npm run watch` to compile.

React won't update unless you run `npm run dev`. So don't keep refreshing your browser wondering why your new component isn't rendering. Don't be me.

**TL;DR** `npm run dev`&nbsp;/&nbsp;`npm run watch` every time before refreshing your browser

## TODO

-   Make adding run times work
-   Literally everything else
-   Finish this README (you know this won't happen)
-   Eat dinner
