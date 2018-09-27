# Contributing

The following is a set of guidelines for contributing to @tshio/react-packages. Please spend several minutes in reading these guidelines before you create an issue or pull request.
We are open to, and grateful for, any contributions made by the community.

## Open Development

All work on @tshio/react-packages happens directly on [GitHub](https://github.com/TheSoftwareHouse/react-packages). Both core team members and external contributors send pull requests which go through the same review process.

## Bugs

We are using [GitHub Issues](https://github.com/TheSoftwareHouse/react-packages/issues) for bug tracing.

Before opening an issue, please search the issue tracker to make sure your issue hasn’t already been reported.

## Proposing a Change

We encourage you to open issues to discuss improvements, architecture, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.
If you intend to change one of the package or provide new one, please create a feature request issue.

## Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Please ask first before embarking on any significant pull request (e.g. implementing features, refactoring code, fixing bugs), otherwise you risk spending a lot of time working on something that the project's developers might not want to merge into the project.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take over it but you should still leave a comment.

## Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we’ll try to get back to you as soon as possible. We may suggest some changes or improvements.

**Before submitting a pull request**, please make sure the following is done:

1. Fork the repository.
1. Run `yarn` in the repository root.
1. Run `yarn bootstrap` in the repository root.
1. Make your proposed changes to the repository.
1. If you’ve fixed a bug or added code that should be tested, add tests!
1. Run `yarn test` to verify all test cases pass.
1. Make sure your code is formatted using prettier. Tip: Prettier runs automatically when you `git commit`.
1. Run `yarn flow` to verify all flow typings are correct.

## Development Workflow

After cloning @tshio/react-packages, run `yarn` to fetch its dependencies. Then, you can run several commands:

1. `yarn bootstrap` installs all of packages dependencies.
1. `yarn test` checks the tests.
1. `yarn flow` checks the code typings.
