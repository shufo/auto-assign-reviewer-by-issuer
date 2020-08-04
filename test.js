const core = require("@actions/core");
const github = require("@actions/github");
const context = github.context;
const got = require('got');
const { parseConfig, hasAssignee, getReviewers } = require("./lib/util");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const configPath = 'https://featureflag.dev.rewind.io/github-actions/pr-reviewers.yml\?Expires\=1988064000\&Signature\=MftiuwfCd9TwVBBmNvoTEWJ6F5nU5m\~coAebRzkLjv7fUdumGY6pTMu\~v6PzVlw0WsNmSdYiprtAJP9OPiAb5Y87ChfbRgYk4119DV\~wblax46qAgrued84kjftZvRe8mzlG8LMVVeBFsmjdtjAQxID\~5ly8t\~aRWl4WyydMPc1\~QSar91bYrK1E7udJlMx5pjnrJe\~\~LXU3T4K0fOIwii0Y6595lfKnhYAVkZ\~1zSHG2jZwcuBa4ecsfFUDduKmxyR6Kbj9wCRH7dWOs-2er9fIuGOlOS1ub7yzWpNFHmRRmiNK9FZpBCnHXlxLEoJWv5p2IKM34\~BrvPf9iCGebg__\&Key-Pair-Id\=APKAITBPJX5PPRQMPTRQ';
    var configContent;

    console.log(`Attempting to read config from ${configPath}`);

    if (configPath.startsWith("http")) {
      console.log(`Reading config from URL`);

      (async () => {
        try {
            const response = await got(configPath);
            console.log(response.body);
            configContent = response.body;
        } catch (error) {
            console.log(error.response.body);
        }
      })();
    }

    //const config = parseConfig(configContent);

    //core.debug("config");
    //core.debug(JSON.stringify(config));

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function assignReviewers(octokit, reviewers) {
  await octokit.pulls.createReviewRequest({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number,
    reviewers: reviewers,
  });
}

async function fetchContent(client, repoPath) {
  const response = await client.repos.getContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: repoPath,
    ref: github.context.sha,
  });

  return Buffer.from(response.data.content, response.data.encoding).toString();
}

run();
