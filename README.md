[![npm version](https://badge.fury.io/js/%40ciklum-digital%2Fcra-template-typescript-redux.svg)](https://badge.fury.io/js/%40ciklum-digital%2Fcra-template-typescript-redux)

# A quick start Redux + TypeScript Create React App template

An opinionated quick start [Create React App](https://github.com/facebook/create-react-app) (CRA) _template_ with configured **Redux**, **TypeScript**, **React Router**, **Enzyme** and custom **ESlint** configuration.

Original Create React App README available [here](./README_CRA.md)

## Usage

```bash
npx create-react-app your-project-name --template @ciklum-digital/cra-template-typescript-redux
```

Or

```bash
yarn create react-app your-project-name --template @ciklum-digital/cra-template-typescript-redux
```

`npx` command installs the most recent stable version of CRA from npm.

`--template` parameter points to this template, note that `cra-template-` prefix is omitted.

## Scripts

In the project directory, you can run:

- `yarn start` - runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- `yarn test` - launches the test runner in the interactive watch mode.

- `yarn build` - builds the app for production to the `build` folder.

- `yarn eject` - exposes content of `react-script` package

- `yarn lint` - lints project files according to eslint rules, see below.

- `yarn fix` - same as `yarn lint`, but also fixes errors, when possible.


## Redux configuration

The template provides basic Redux configuration with [feature based](https://redux.js.org/style-guide/style-guide/#structure-files-as-feature-folders-or-ducks) folder structure. You can use [Redux devtools browser extension](http://extension.remotedev.io/). Sample feature included in `src/features` folder, note technology agnostic `features` folder name. Based on Redux maintainers recommendation.

## Testing

Testing is done with [Enzyme](https://airbnb.io/enzyme/).

## [Prettier](https://prettier.io/)

I added `prettier` to force consistent formatting. Don't like trailing semicolons? Feel free to [tweak prettier rules](https://prettier.io/docs/en/configuration.html) inside `.prettierrc` file to match your code style.

## Eslint configurations

The template extends CRA ESLint rules with a custom set, tailored for the reasonable and clean development process.

Eslint rules are commented for your convenience feel free to tweak or remove them inside `.eslintrc`. No judgment.
