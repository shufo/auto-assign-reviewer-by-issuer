![CI](https://github.com/shufo/auto-assign-reviewer-by-issuer/workflows/CI/badge.svg)

# Auto Assign Reviewer By Issuer

Automatically assigns reviewers based on pull request issuer

## Configuration

create configuration file

`.github/reviewers.yml`

```yaml
---
# issuer: reviewer
shufo:
  - shufo2
# you can set multiple reviewers
smith:
  - user1
  - user2
# you can use regexp to match issuer
john.*:
  - foo
  - bar
# fallback
.*:
  - foo
```

create action file

`.github/workflows/auto-assign.yml`

```yaml
name: "Auto Assign"
on:
  pull_request:
    types: [opened]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
    - uses: shufo/auto-assign-reviewer-by-issuer@v1.0.0
      with:
        config: '.github/reviewers.yml'
        token: ${{ secrets.GITHUB_TOKEN }}
```

## Example

![image](https://user-images.githubusercontent.com/1641039/78471193-71573200-776a-11ea-9b40-810c2d63270e.png)
