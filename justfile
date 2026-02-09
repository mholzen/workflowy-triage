default:
    @just --list

install:
    node bin/install.mjs

uninstall:
    node bin/install.mjs uninstall

publish:
    npm publish
