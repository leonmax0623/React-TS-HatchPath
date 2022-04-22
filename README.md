# Setup

Create a `.env` file with the same fields in the `.env.example`. The API key can be found in the firebase project settings, this should not be committed to git. The fontawesome token can be found in the fontawesome console.

# Dotenv

The recommended way is to install the dotenv plugin with oh-my-zsh.

Alternatively, you can install `npm i -g dotenv-cli`, when you need to install, you can run `dotenv -e .env npm i`

# Running

Most of the time `npm run dev` is the command to use for local development. If there is a need to connect to the remote resources such as for testing or debugging, then run `npm run dev:remote`

Linting can be done by running `npm run lint`. This should ideally also be checked before committing to check that no linting problems exist.

# File structure

## Components

This is the folder for all reusable or atomic components. They are split into the following categories:

- common - the core set of UI components such as buttons, inputs, etc.
- features - components related to specific features of the app
- forms - all the forms that exist in the app
- hoc - any higher-order components that are needed
- layouts - wrapping components and containers

## Pages

Following the next.js routing method, each page is a file or a directory.

## Public

Public resources, mostly consisting of images. Prefer SVG's whenever possible.

## Styles

Global stylesheets that affect the entire app.

## Types

Types

## Util

Utility functions and tools

# Palette

Instead of using Storybook or similar solutions, this palette setup is a lightweight alternative. All components in `components/common/*` should contain a `.palette.tsx` component that "showcases" that component.

When running locally, the palette can be accessed by going to the `/palette` route
