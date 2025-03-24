# Contributing to AIBridge

Thank you for your interest in contributing to AIBridge! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. **Fork the repository**: Start by forking the repository to your GitHub account.

2. **Clone the fork**: Clone your fork to your local machine.
   ```
   git clone https://github.com/yourusername/aibridge.git
   cd aibridge
   ```

3. **Install dependencies**: We use pnpm as our package manager.
   ```
   pnpm install
   ```

4. **Set up development environment**: Make sure your development environment is properly configured.
   ```
   pnpm dev
   ```

## Development Workflow

1. **Create a branch**: Create a branch for your work with a descriptive name.
   ```
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**: Implement your changes while following our coding standards.

3. **Test your changes**: Ensure your changes pass all tests.
   ```
   pnpm test
   ```

4. **Lint your code**: Make sure your code follows our linting rules.
   ```
   pnpm lint
   ```

5. **Commit changes**: Commit your changes with descriptive messages.
   ```
   git commit -m "feat: add new feature"
   ```
   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

6. **Push to GitHub**: Push your changes to your fork.
   ```
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**: Submit a PR from your branch to our main repository.

## Coding Standards

- Follow the established code style (enforced by ESLint and Prettier)
- Write comprehensive tests for new features
- Write meaningful commit messages following Conventional Commits
- Keep PRs focused on a single issue for easier review

## Project Structure

Please make sure you understand our project structure before contributing:

```
/
├── apps/
│   ├── web/                   # Frontend application
│   ├── api/                   # API server
│   └── docs/                  # Documentation site
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── config/                # Shared configuration
│   ├── schema/                # Data schemas and validation
│   └── utils/                 # Shared utilities
```

## Bug Reports and Feature Requests

If you find a bug or have a feature request, please open an issue on our GitHub repository. Make sure to:

1. Check if the issue already exists
2. Use a clear and descriptive title
3. Provide detailed steps to reproduce bugs
4. Include relevant details about your environment

## Pull Request Process

1. Ensure your PR includes tests if adding new functionality
2. Update documentation if necessary
3. Make sure your code passes all CI checks
4. Get your PR reviewed by at least one maintainer
5. Once approved, a maintainer will merge your PR

## License

By contributing to AIBridge, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 