### Commits
* Please ensure that commits are descriptive and are free of any obvious grammatical errors.

### Pull Requests
* Please follow the syntax of `closes #issuenumber: description` when submitting pull requests.
* Please write a brief description of the pull request in the comments section
* Please request a reviewer upon submitting pull request.
* When in doubt, follow [GitHub's Guidelines](https://github.com/blog/1943-how-to-write-the-perfect-pull-request)

### Run Configurations in IntelliJ IDEA
The default run configurations are committed to the repository, so when you clone and import the
project into IntelliJ, you should get the run configurations right off the bat.
The only additional change that needs to be made is for the Mocha "Run Tests" configuration.
It needs to run "npm run build" before launching the tests. For some reason, this bit of
information doesn't save with the rest of the run configuration data.

If you want to change customize any of the run configurations, please copy it into a
run configuration with a different name rather than changing the one committed to the repository.
