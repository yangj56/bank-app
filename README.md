# Simple Banking System

A command-line application for simple banking system.

## Explaination of Design

- The program is created using NodeJS 22, if you dont have node install you can run the docker commands to get it running locally (command is at the bottom of this README.md)
- Typescript is used to improve code readability and type safety
- Question prompt is using promise to improve readability and callback hell
- Design behind this is to keep the code small and modular so I can reuse the function easily
- Validator helps to improve reduce and each validator can be tested to ensure all the invalid inputs are not allow to proceed
- HashMap and sorted array is used to ensure order and faster look up
- File naming convention is standardize with kebab case
- Function naming convention is Pascal case
- Variable naming convention is camel case
- Lint and prettier formatting ensure code quality is uphold
- SonarJS ensure clean code and no bad coding practices
- Husky is used to ensure code is committed with not failed tests and it also passes lint and audit checks
- Folders
  - entities are created to provide code structure and enforce OOP standards
  - utils consist of helper functions that can help me generate, format or validate that are not dependent on business logics
  - config consist of folder-wide configuration can you change easily without going through every file to change it
  - error consist of list of errors which are extended from base error class, this will help me check which error it is by checking its instance of
  - **tests** consist of all the tests in the application, each test covers all the edge cases and error cases

## Features

- Create transaction for different accounts with desposit and withdraw capabilities
- Add interest rules
- Calculate monthly interest earn from the deposit balance

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Testing**: Jest
- **Code Quality**:
  - ESLint for linting
  - Prettier for code formatting
  - Husky for pre-commit hooks (test, lint and audit)

## Development Practices

- Clean Code principles
- Smaller functions to reduce cognitive complexity
- SOLID design principles
- Modular code structure
- Test-Driven Development (TDD)
  - Comprehensive unit tests
  - Integration tests
  - High test coverage

## Production Readiness

1. Code Quality

   - Linting with ESLint
   - Automated testing in pre-commit hooks
   - Code formatting with Prettier
   - JSDoc to document utility functions
   - SonarJS to provide clean code by detecting bugs and suspicious patterns

2. Build Optimization

   - Minification and uglification
   - Comment removal for production builds

3. Deployment
   - Dockerized application
   - Environment-based configurations
   - Cross-platform compatibility

## Assumptions & Limitations

1. **Input Constraints**

   - Transaction must be added in ascending dates
   - RuleId cannot be duplicated

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Build the application:

```bash
npm run build
```

3. Start the application:

```bash
npm start
```

4. Start the application locally:

```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t banking-app .
```

2. Run the container:

```bash
docker run -it banking-app
```
