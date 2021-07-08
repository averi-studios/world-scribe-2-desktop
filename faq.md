# Frequently Asked Questions

## Q: Can I import my Worlds from World Scribe for Android?

The short answer is: **No, not yet.**

Unfortunately, it's not as easy as copy-and-pasting World folders from your Android phone into World Scribe 2's "Worlds" folder. The Android app stores data in a completely different format, so Android World data would need to be _converted_ before it can be used in the World Scribe 2 app.

This conversion feature is not currently implemented in World Scribe 2, but it is high-priority on  our roadmap, as we recognize that it's a must-have feature for those of you who are using the Android app. We (the code owners) are currently working out a plan on how to implement this feature. Once it's ready, we'll share it in the [Issues page](https://github.com/averi-studios/world-scribe-2-desktop/issues) so that the community can get a sense of what needs to be done, provide feedback, and contribute to the implementation.

## Q: Why does the codebase use old/outdated dependencies? (e.g. React class components, Sequelize 4 in the server code) Can they be updated to the latest versions?

The app has been in development for more than two years. The dependency versions / conventions we used were the most widespread at the time. Due to various life circumstances that caused us to put the project on hold for long periods of time, we did not have the opportunity to gradually update dependencies.

We would certainly like to have everything up-to-date, but updating even one core dependency would require deep re-testing of the app to ensure that nothing was broken in the process. Updating dependencies is on the roadmap, but consequently it is something that will be done incrementally over the long term.

But it's not just us, the code owners, who can update dependencies; if you're a developer, you're more than welcome to contribute to this as well! Feel free to open PRs for dependency version updates. Some proof of nothing breaking (e.g. videos) would be appreciated so that we can speed up the review process.

