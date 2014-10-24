define(['data','./views', './Quiz.Model'], function(DataLayer,views, Model){
    var QuizRouter =  Backbone.Router.extend({
        initialize : function initialize (argument) {
            var self = this;
            this.viewsInstance = [];

            DataLayer.getAllQuiz().done(function(Quizs){
                if(!Backbone.History.started){
                    Backbone.history.start();
                }
                Backbone.history.navigate("start",{
                    trigger: true,
                    replace:true
                });
            });
        },
        routes: {
            start: "onStart"
        },
        onStart : function onTransaction (argument) {
            var viewsIndex = 0;
            for (viewsIndex = views.length - 1; viewsIndex>= 0; viewsIndex--) {
                this.viewsInstance.push(new views[viewsIndex]({
                    parentDiv:"Dynamic",
                    model: new Model()
                }).render());
            };
        }
    });
    return QuizRouter;
})