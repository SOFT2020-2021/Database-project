### Setting up environment
IDE vscode
code conventions are a plugins: eslint, prettier
code will be written in english, be it variablenaes or comments


module exports should include file level functions in case there is multiple exports 
require statements should be placed at the top of the file

```js
module.exports = {
    func1,
    func2,
    ...
}
``` 

setting up postgres you need a user 
to run rabbitmq run: <br />
<br />
<b>
docker run -d --hostname haroldjcastillo --name rabbit-server -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin2017 -p 5672:5672 -p 15672:15672 rabbitmq:3-management
</b>
