#
# Makefile for EpicEditor
#
# This build requires the following packages
# - UglifyJS: https://github.com/mishoo/UglifyJS
# - JSHint: https://github.com/jshint/node-jshint
#

NO_COLOR	= \033[0m
YELLOW	= \033[33;01m
MAGENTA	= \033[35;01m

#
# NOTES:
# - EpicShowdown is being treated like an external module for now
#   since it's doesn't care for the opinion of JSHint
# - The fullscreen module currently relies on the comma operator
#   JSHint does not support this at the moment but it's supposed to
#   be added: https://github.com/jshint/jshint-next/issues/1.
#   Rather than refactor this code, fullscreen is excluded from
#   the linter for now
#
# TODO:
# - Consider extracting and extending EE helper methods/modules, and
#   licences rather than hacking around license/JSHint issues
# - Run JSHint on fullscreen once comma operator is added to JSHint
#   or removed from fullscreen
# - Pull in EpicEditor-Flavored-Markdown as git-submodule (EpicShowdown)?
# - Create docs task to generate README-based gh-pages/index and zip
#   folders for easy download so content can be managed in one place
#

#
# BUILD EPICEDITOR
#
build:
	@echo "$(YELLOW)\nEpicEditor!\n------------$(NO_COLOR)"
	@echo "$(MAGENTA)* Create target dir...$(NO_COLOR)"
	mkdir -p epiceditor/js

	@echo "$(MAGENTA)* Run JSHint on EE core code and rm tmp...$(NO_COLOR)"
	cat src/intro.js src/editor.js src/outro.js > src/epiceditor.tmp.js
	jshint src/epiceditor.tmp.js --config ./lib/jshint.json
	rm src/epiceditor.tmp.js

	@echo "$(MAGENTA)* Uglify modules...$(NO_COLOR)"
	uglifyjs src/epicshowdown.js > src/epicshowdown.min.js
	uglifyjs src/fullscreen.js > src/fullscreen.min.js
	uglifyjs -nc src/editor.js > src/editor.min.js

	@echo "$(MAGENTA)* Build EpicEditor...$(NO_COLOR)"
	cat src/intro.js src/epicshowdown.min.js src/fullscreen.js src/editor.js src/outro.js > epiceditor/js/epiceditor.js
	cat src/intro.js src/epicshowdown.min.js src/fullscreen.min.js src/editor.min.js src/outro.js > epiceditor/js/epiceditor.min.js

	@echo "$(MAGENTA)* Clean up...$(NO_COLOR)"
	rm src/editor.min.js src/epicshowdown.min.js src/fullscreen.min.js

	@echo "\n$(MAGENTA)OK!$(NO_COLOR)"

.PHONY: all build
