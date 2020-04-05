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
    types: [assigned]

jobs:
  'assign reviewer':
    runs-on: ubuntu-latest
    steps:
    - uses: shufo/auto-assign-reviewer-by-issuer@v1.0.0
      with:
        config: '.github/reviewers.yml'
        token: ${{ secrets.GITHUB_TOKEN }}
```

## Example

![image](https://user-images.githubusercontent.com/1641039/78450313-b753bd80-76b8-11ea-9a25-0d6bcf858227.png)
