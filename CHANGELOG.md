# 0.7.0
* Update authentication endpoints to match changes in contentjet-api
* Can now create Clients for authenticating via OAuth Client Credentials flow

# 0.6.1
* Media screen layout now uses css grid

# 0.6.0
* Only admins can create projects

# 0.5.9
* Updated `moment` in response to github security vulnerability alert
* Improved color input

# 0.5.8
* Entry published field now checks for valid date

# 0.5.7
* Bugfix in ListInput

# 0.5.6
* Added dist

# 0.5.5
* LoadingSpinner now correctly appears on EntryEditor
* Added ListInput
* Removed ArrayInput

# 0.5.4
* Added description to entry type list screen
* Added asterisk to denote required fields on EntryType editor
* Added UI for disabling entry type fields
* EntryType's now ordered by name

# 0.5.3
* Improved media editor design
* Images on media editor now have a max height
* Now showing file size on media editor

# 0.5.2
* No longer get error when deleting invitations

# 0.5.1
* Fix where error was shown on field editor name field

# 0.5.0
* Added change password screen under user settings

# 0.4.2
* Now setting cache control header in server.js
* Now emitting robots.txt

# 0.4.1
* Fixed issue with images not being inserted into markdown input
* Webpack now configured to output hash in js and css filenames

# 0.4.0
* Added Dockerfile and server.js

# 0.3.0
* Added sort controls to entries screen
* Added sort controls to media screen
* Optimised 2x contentjet svgs

# 0.2.5
* Updated README
* Increased vertical padding on ConfirmModal component
* Bug fix in MarkdownInput component
* Bug fix in Entries component
* Bug fix in MediaActions

# 0.2.4
* Minor README update
* Updated `marked` package to latest version due to a securiy alert raised by Github

# 0.2.2
* Removed dist from .gitignore

# 0.2.1
* Updated `package-lock.json` and `package.json`

# 0.2.0
* WebHook and ProjectInvite endpoints are no longer paginated
* Fixed issue with web hook list showing there active status incorrectly
* Minor README tweak

# 0.1.0
* First public release
