# 0006. Public repository and MIT license

- Status: accepted
- Date: 2026-11-10

## Context

In order to enhance the learning experience, repository must offer as many features as possible which could be encountered in professional work, without introducing additional costs. Public repositories on GitHub offer a reasonable set of free features. At the moment, there is only one developer and the project will most likely not gather attention from wider audience. The application will host personal data and it might become a public service later.

## Decision

The repository is public on GitHub and licensed under MIT.

The decision for the repository to be public is influenced by cost conservation. Unlike private GitHub repositories, public repositories offer free branch protection, code scanning (CodeQL), secret scanning and rulesets.

MIT license is selected as a default. Since the project does not have strong commercial aspirations, any benefit that other people can draw from it is an added plus.

## Alternatives considered

- Private + GitHub pro: code stays hidden with all of the features utilised by the public free plan, but costs are introduced.
- Private without GitHub pro: code stays hidden, but rules aren't enforced and some of the features are lost.
- AGPL-3.0: could prevent closed copies. Reuse is welcome anyway.
- No license: nobody could legally use the project.

## Consequences

- Codebase is public which mandates careful secret handling.
- No personal data should be present.
- Free security tooling, free CI minutes.
- Other people can interact with the repo.
- Anyone can use the code commercially.

## Revisit if

- GitHub changes what the free plan offers.
- Project gains commercial intent.
- Other people start contributing.
