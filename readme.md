# Tracker

## Intro

Hello and welcome to the Tracker app. This logs my 5K lap times. It uses React, Laravel 6.0, and CouchDB. What do you mean that is overkill.

## A Priori

This uses:

-   [React](http://reactjs.org/) at the front;
-   [Laravel 6.0](https://laravel.com/) at the back; and
-   [MySQL](https://mysql.com/) for data

This app uses [Laravel's Homestead](https://laravel.com/master/homestead) too, which involves installing a VM provider; that doc page lists which ones you can get.

## Installation

I mean, why would you wanna work on this but sure:

> If you really know what you're doing you can tweak the installation steps I'm about to describe.

After installing and configuring Homestead and VirtualBox (and additionally, going through "Accessing Homestead Globally" in [this chapter](https://laravel.com/docs/master/homestead#daily-usage)), run these in the terminal:

```
$ git clone <this/repo.git> && cd <this/repo>
$ mv .Homestead.yaml.example .Homestead.yaml
$ mv .env.example .env
$ composer install
$ npm i
$ vagrant up
$ vagrant ssh
```

## Working the Front

Open up `resources/assets/js/app.js` and `resources/assets/js/components/Main.js` to learn how a React component gets tied into the overall shebang. Laravel+React uses [Laravel Mix](https://laravel.com/docs/master/mix) to work, so read that link. In particular, [this tiny section in the page](https://laravel.com/docs/master/mix#react).

Once you have that sorted out, go do your React-ing. Then run either `npm run dev` or `npm run watch` to compile.

React won't update unless you run `npm run dev`. So don't keep refreshing your browser wondering why your new component isn't rendering. Don't be me.

**TL;DR** `npm run dev`&nbsp;/&nbsp;`npm run watch` every time before refreshing your browser

## TODO

-   Restructure laptimes listing in TimeList
-   Make update time docs work
-   Literally everything else
-   Finish this README (you know this won't happen)
-   Eat dinner
