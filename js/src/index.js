require.config({
    urlArgs: 'cb=' + Math.random(), //Comment this line if running in production environment
    /*
     * Let's define short alias for commonly used AMD libraries and name-spaces. Using
     * these alias, we do not need to specify lengthy paths, when referring a child
     * files. We will 'import' these scripts, using the alias, later in our application.
     */
    paths: {
        // requirejs domReady plugin to know when DOM is ready
        domReady: "../lib/domReady",
        //UI Handlers              
        templates: "./templates-handler",
        //Abstraction layer
        data: './data-abstraction',
    }
});
define(function(require){
    var domReady = require('domReady'),
        DataLayer = require('data'),
        templates = require('templates'),
        QuizRouter = require('./quiz/Quiz.Router');
    domReady(function(){
        DataLayer.initialize().done(function() {
            templates.load({
                names: ['quiz'],
                modulePath: 'js/src/quiz',
                templatePath: 'templates',
                moduleName : 'quiz'
            }, function () {
                quiz = new QuizRouter();
            });
        });
    });
});
var app = {
};