# Acronymu
A tray desktop app the helps you find the acronym meaning from the clipboard.

[Download for Windows][win-download]

[win-download]: https://github.com/rFarinha/Acronymu/releases/download/v0.1.1-alpha/Acronymu.Setup.0.1.1.exe

## How it works

1. Copy an acronym to clipboard
2. App will read clipboard and search the meaning in a TXT file with all your acronyms
2. If App finds the acronym, a notification will appear with the meaning

![Image of Notification](/resources/img/notification_readme.png)

## Features
1. Create multiple lists and change between them easily
2. Add acronyms easily with automated sorting
3. Possible to choose a google drive folder to connect an acronym list with multiple team members

![Image of Tray](/resources/img/tray_readme.png)

## Install
Clone the GitHub repository and intall all dependencies
```shell
   git clone https://github.com/rFarinha/Acronymu.git
   npm install 
``` 
Run the code with
```shell
   npm run start
```
Or run the code with nodemon with
```shell
   npm run watch
```
The tray icon should appear
