## Angular2 Express Starter
### Rules for developer ###

1. Never push sources to git with errors on console and browser. Delete node_modules folder before you make your commits.
2. If you push errors or do deliver incomplete task then your work time will be paused until you finish and fix this problem
3. The application should be always tested in Browser(Chrome, Mozilla and IE). In the end of your work the developed application should work in dev and prod modus

### Install dependencies ###
npm install

### start server ###
npm run develop

###  Applciation url: http://localhost:3000 ###
```

### Development
Uncomment in public/index.html:

```html
<script src="assets/js/systemjs.config.js"></script>
<script>
    System.import('app').catch(function(err) { console.error(err); });
</script>
```

Comment out
```html
<!-- Production mod -->
<script src="js/bundle.min.js"></script>
```