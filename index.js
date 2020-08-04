const core = require("@actions/core");
const github = require("@actions/github");
const context = github.context;
const request = require('request-promise');
const { parseConfig, hasAssignee, getReviewers } = require("./lib/util");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = core.getInput("token", { required: true });
    const configPath = core.getInput("config");
    const octokit = new github.GitHub(token);
    var configContent;

    console.log(`Attempting to read config from ${configPath}`);

    if (configPath.startsWith("http")) {
      console.log(`Reading config from URL`);

      try {
        const response = await got(configPath);
        console.log(response.body.url);
        console.log(response.body.explanation);

        configContent = response.body;
      } catch (error) {
        console.log(error.response.body);
      }
    } else {
      console.log(`Reading config from local path`);
      configContent = await fetchContent(octokit, configPath);
    }

    const config = parseConfig(configContent);

    core.debug("config");
    core.debug(JSON.stringify(config));

    const issuer = context.payload.pull_request.user.login;

    if (hasAssignee(config, issuer)) {
      let reviewers = getReviewers(config, issuer);
      assignReviewers(octokit, reviewers);
    }
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
