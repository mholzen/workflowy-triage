default:
    @just --list

install:
    node bin/install.mjs

uninstall:
    node bin/install.mjs uninstall

release bump="patch":
    npm version {{bump}}
    git push && git push --tags

publish:
    npm publish
