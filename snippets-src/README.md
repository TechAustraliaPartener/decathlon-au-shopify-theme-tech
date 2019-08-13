# Snippets Source Directory

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Gulp automation](#gulp-automation)
- [Directory organization](#directory-organization)
- [Adding a new snippet](#adding-a-new-snippet)
- [Editing a legacy snippet](#editing-a-legacy-snippet)
  - [Rename the file](#rename-the-file)
  - [Update template includes](#update-template-includes)
  - [Update the `.gitignore` file](#update-the-gitignore-file)
  - [Update the `snippets:clean` Gulp task](#update-the-snippetsclean-gulp-task)
- [Updating README Table of Contents](#updating-readme-table-of-contents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview 

This directory contains the source files for contents of the [`snippets/` directory](../snippets). Eventually, all files in the `snippets/` directory will be generated from the source files in this `snippets-src/` directory.

**IMPORTANT:** All edits and new file additions should be done within this directory.

## Gulp automation

The `snippets`, `snippets:clean` and `snippets:copy` Gulp tasks are setup to automate moving and renaming the snippets from the `snippets-src/` directory into the `snippets/` directory.

Most of the time, these Gulp tasks won't need to be run manually as they are rolled into higher level scripts such as `npm run dev`.

For more details, see the [Gulp Tasks Documentation](/README.md#gulp-tasks).

## Directory organization

@TODO Add more documentation.

The following tree graph shows the directory organization:
```
snippets-src/
└── assets
    └── icons
```

Source files will be renamed via the `snippets` Gulp task to avoid naming conflicts. 

For example, the following:
```
snippets-src/some/path/hello-world.liquid
```
Will be renamed to:
```
snippets/some-path-hello-world.liquid
```

## Adding a new snippet

Follow the [directory organization](#directory-organization) documentation when adding new files into the `snippets-src/` directory.

If you need to add new directories, review the [update the `.gitignore` file](#update-the-gitignore-file) and [update the `snippets:clean` Gulp task](#update-the-snippetsclean-gulp-task) documentation.

## Editing a legacy snippet

We will be gradually moving _all_ legacy snippet files from the `snippets/` directory into this `snippets-src/` directory. 

When editing a legacy file, consider [renaming the file](#rename-the-file), [updating template includes](#update-template-includes), [updating the `.gitignore` file](#update-the-gitignore-file) and [updating the `snippets:clean` Gulp task](#update-the-snippetsclean-gulp-task).

### Rename the file

If applicable, rename the legacy file.

For example, `icon-basketball.liquid`:
```
snippets/icon-basketball.liquid
```
Should be renamed to `basketball.liquid`:
```
snippets-src/assets/icons/basketball.liquid
```

This is suggested to avoid `icons-icon` duplication when renamed via the `snippets` Gulp task (e.g. `assets-icons-icon-basketball.liquid`).

### Update template includes

If applicable, update any Liquid template `{% include 'path-name' %}` paths.

### Update the `.gitignore` file

All generated files in the `snippets/` directory should be GIT-ignored.

If applicable, update the `.gitignore` to ignore new paths as needed.

Example `.gitignore`:
```
# Built from /snippets-src/assets/**
/snippets/assets-*.liquid
```

Eventually, the `.gitignore` file can be simplified to ignore _everything_ in the `snippets/` directory since that directory will only contain generated files:
```
# Built from /snippets-src/**
/snippets/*.liquid
```

### Update the `snippets:clean` Gulp task

Until all legacy snippets have been moved into the `snippets-src/` directory, care will need to be observed when the `snippets:clean` Gulp task is executed. We do not want to have legacy snippets deleted.

If applicable, update the `snippets:clean` Gulp task to ensure only the generated files are deleted. For example, assume the following already exists in the `snippets:clean` Gulp task:
```js
[
  'snippets/assets-*.liquid' // Deletes `snippets/assets-icons-store.liquid
]
```
If you add a new directory while moving a legacy file, example: `snippets-src/foo/legacy-file.liquid`, then you'd want to ensure to also delete its generated files: 
```js
[
  'snippets/assets-*.liquid', // Deletes `snippets/assets-icons-store.liquid
  'snippets/foo-*.liquid' // Deletes `snippets/foo-legacy-file.liquid
]
```

Eventually, the `snippets:clean` Gulp task can be simplified to delete _everything_ in the `snippets/` directory since it will only contain generated files:
```js
[
  'snippets/*.liquid'
]
```

## Updating README Table of Contents

The table of contents for this README was generated using [DocToc](https://github.com/thlorenz/doctoc). If new README sections are added or if headings are edited, do not update the table of contents manually, instead run the following command:

```
npx doctoc --maxlevel 4 snippets-src/README.md
```
