# ExoLoader Mod Templater

A web-based tool for creating custom content for [ExoLoader mod](https://github.com/Pandemonium14/ExoLoader) to add your characters, stories, etc. to the game "I Was a Teenage Exocolonist".

The main goal is to simplify JSON file creation, file naming and location, especially for characters (since there are so many configuration options for those).

Supports around 90% of ExoLoader's capabilities, has import & export, pregeneration of character cards following base game's pattern, pregeneration of character story templates and story patches.

You do not need to have artwork - export generates placeholder PNG files when no artwork is provided, so you can playtest stories and general flow and replace PNG files with actual art later.

## Getting Started

1. Click "New Project" to start (or you can import [Demo mod](https://github.com/saerielle/ExoLoader-Demo-Mod) to see what's what)
2. Bootstrap your content (or just poke around and see what's what lol)
3. Export and install (export generates a template of README for mods with installation instructions)

## Notes

- All data is stored locally on your PC. Clearing your browser's site data may delete your projects. IndexedDB can also be cleared if your hard drive/browser is running out of storage, but it's quite rare.
- While there is minimal syntax highlighting support for editing stories and story patches in the tool, it's recommended to use VSCode (or other text editor) instead for writing and editing these files. VSCode has an extension to highlight Exoscript syntax.
- While ExoLoader supports adding animated map sprites for the characters, setting them up is not supported in this tool
- ScriptExtensions from ExoLoader is not supported (that's currently only special memory flags like Tammy's Confidence that gets displayed in the stories when they increase/decrease), it sounds simply to add those here, but I completely forgot about them until the last moment
