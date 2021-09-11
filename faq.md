# Frequently Asked Questions

## Q: Can I import my Worlds from World Scribe for Android?

The short answer is: **No, not yet.**

Unfortunately, it's not as easy as copy-and-pasting World folders from your Android phone into World Scribe 2's "Worlds" folder. The Android app stores data in a completely different format, so Android World data would need to be _converted_ before it can be used in the World Scribe 2 app.

This conversion feature is not currently implemented in World Scribe 2, but it is high-priority on  our roadmap, as we recognize that it's a must-have feature for those of you who are using the Android app. We (the code owners) are currently working out a plan on how to implement this feature. If you're a developer, you can read and discuss our plan [here](https://github.com/averi-studios/world-scribe-2-desktop/issues/18).

## Q: How do I share / backup my Worlds?

Even though World Scribe 2 doesn't have the "Backup to Dropbox/Nextcloud" from the Android app, preparing your Worlds for back-ups and sharing is still easy!

1. In the app, go to the "Worlds" page.
2. Beside the "My Worlds" title, click on the blue folder icon. This will open file explorer to the location where your Worlds' data are stored. Each of your Worlds has its own folder here.
3. For each World that you want to share or backup, **zip** the matching folder of the same name. [Here's a guide on how to zip files](https://www.passfab.com/zip/how-to-zip-a-file.html).
4. Upload the zip file to Dropbox, Nextcloud, an email addressed to the person you want to share with, etc.

To restore a backup, simply unzip the zip file and copy the resulting folder into the "WorldScribe" app folder.

## Q: Why does the codebase use old/outdated dependencies? (e.g. React class components, Sequelize 4 in the server code) Can they be updated to the latest versions?

The app has been in development for more than two years. The dependency versions / conventions we used were the most widespread at the time. Due to various life circumstances that caused us to put the project on hold for long periods of time, we did not have the opportunity to gradually update dependencies.

We would certainly like to have everything up-to-date, but updating even one core dependency would require deep re-testing of the app to ensure that nothing was broken in the process. Updating dependencies is on the roadmap, but consequently it is something that will be done incrementally over the long term.

But it's not just us, the code owners, who can update dependencies; if you're a developer, you're more than welcome to contribute to this as well! Feel free to open PRs for dependency version updates. Some proof of nothing breaking (e.g. videos) would be appreciated so that we can speed up the review process.

