# nlw-01
Project coded during the first 'Next Level Week'

 ![Ecoleta](/img/00_ecoleta.gif)
Hey if you arrived here, I would like to invite you to try this code by yourself, look the info below:

More information about the project, check [here](https://nextlevelweek.com/)

Here you gonna find three projects, see the main folders:

```file
.
├── .gitignore
├── mobile
├── server
├── web-app
``` 

So, now you can go to any the command  line and type some characters:
# Server Stuff
Start by the server project, type:
```bash
cd server
npm install
```
It'll install all dependencies, so take a cup of coffee and wait! 😊.
With everything in place type:
It will start an SQLite database and will seed some data.
```bash
npm run knex:migrate
npm run knex:seed
```
Now we just need to start the server, type:
```base
npm run dev
```
If you would like to try some calls you can use REST files inside of `http` folder, I recommend installing a VSCode Extention called [REST Client](https://github.com/Huachao/vscode-restclient.git).

# Web Stuff
Now let's work with the web project, type:
- Pay attention in your current path, if you are in the `server` folder, you need to go back by typing `cd ..` ;
```bash
cd web-app
npm install
```
The only thing that you need to do is start the project, type:
```bash
npm start
```

# Mobile Stuff
Finally, last but not least, is the mobile project, here we gonna have a little bit more work, but you'll gonna rock it 😉 !
- Again check if you are in the `server` or `web-app` folder, you need to go back by typing `cd ..`:
```bash
cd mobile
npm install
npm install expo-cli --global
```
Here we are using [Expo](https://expo.io/), a framework and a platform for universal React applications.
Now let's start the project, type:
```bash
expo start
```
You gonna need to install the `Expo` app in your phone [here](https://expo.io/learn) you gonna find some help.

And that is it! 😁
Have fun!!
