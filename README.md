# Create Relative File

Create new files relative to the path of the active document.

![Demo](https://github.com/joshmu/vscode-create-relative-file/blob/main/demo.gif?raw=true)

I prefer to keep my hands on the keyboard but hate having to remember a full path when creating files. This vscode plugin solves this by allowing the user to create files relative to the active document they are currently working in.

## Features

Via the command prompt search for: `Create Relative File`

Create 1 or more files by seperating with an empty space or comma.

> `newFile1.js newFile2.js ../somewhereElse/newFile3.js`

If a new folder path is specified this will also be created.

> `../newFolder1/newFile1.js`

If input has no extension or a trailing forward slash then create a folder instead.

> `newFolder/newFolder2`

Add multiple files under specified path (emmet style):

> `../newFolder/newFile1.js+newFile2.js+newFile3.js`

If the input is prefixed with a forward slash, then the workspace base path is used. This will also occur by default if no active document is open.

> `/test.config.js`

If files or folders already exist they will not be overwritten.

### If you enjoy this plugin go smack a ⭐️ on it @ [Github](https://github.com/joshmu/vscode-create-relative-file)
