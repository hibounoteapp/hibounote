# Shape the Future of Infinite Thinking!

Hibounote is an open-source project. I really apreciate any effort on it. Below are the guidelines to get started.

## Technology Stack
Hibounote is built using Angular. The back-end (not builded yet) that will record the user login and board data will be probably builded in Node.js with MongoDB.

Libraries we use
 - SASS;
 - Tailwind;
 - Angular Material;
 - [Jsplumb](https://jsplumbtoolkit.com/community);
 - [Panzoom](https://github.com/timmywil/panzoom);

### Dependencies
To be able to start development on Hibounote, make sure you have the following prerequisites installed:
- Node (v18.20 or higher)
- NPM (v10 or higher)
- Angular (v18)

## Development

1. Clone the repository and install dependencies:
```
git clone https://github.com/gustavofdasilva/hibounote.git
cd hibounote
npm install
```
<br>

2. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
```
ng serve
```
The development environment should now be set up.
<br>

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io/latest/index.html).

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
<br>

## Raising Pull Requests

- Please keep the PR's small and focused on one thing
- Please follow the format of creating branches
  - feature/[feature name]: This branch should contain changes for a specific feature
    - Example: feature/dark-mode
  - bugfix/[bug name]: This branch should contain only bug fixes for a specific bug
    - Example bugfix/bug-1
