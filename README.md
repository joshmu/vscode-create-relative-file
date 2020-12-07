# Create Relative File

Create new files relative to the path of the active document.

![](https://github.com/joshmu/vscode-create-relative-file/blob/main/demo.gif)

I prefer to keep my hands on the keyboard but hate having to remember a full path when creating files. This vscode plugin solves this by allowing the user to create files relative to the active document they are currently working in.

## Features

Via the command prompt search for: `Create Relative File`

Create 1 or more files by seperating with an empty space or comma.

> `newFile1.js newFile2.js ../somewhereElse/newFile3.js`

If a new folder path is specified this will also be created.

> `../newFolder1/newFile1.js`

If input has no extension or a trailing forward slash then create a folder instead.

> `newFolder/newFolder2`

Relative path will default to current workspace when there is no active document.
If files or folders exist they will not be overwritten.

## Roadmap

Add multiple files under specified path (emmet style):

> `../newFolder/newFile1.js+newFile2.js+newFile3.js`

### If you enjoy this plugin go smack a ⭐️ on it @ [Github](https://github.com/joshmu/vscode-create-relative-file)
