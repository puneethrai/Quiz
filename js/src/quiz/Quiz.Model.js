define(['data'], function (DataLayer) {

    var QuizModel = Backbone.Model.extend({
        defaults: function () {
            return {
                totalattempt: 0,
                attempts: 0,
                testID: 0,
                input: "",
            };
        },
        fetch: function (options) {
        	var self = this;
            DataLayer.getQuizByTestID(this.get("testID")).done(function (data) {
                self.set(data);
                if (options.success) {
                    options.success(self.toJSON());
                }
            }).fail(function () {
                if (options.onError) {
                    options.onError(self.toJSON());
                }
            });
        },
        save: function () {
        	var self = this;
            DataLayer.addQuiz(this.toJSON()).done(function(id) {
            	if(self.isNew()) {
            		self.set("id", id);
            	}
            });
        }
    });
    return QuizModel;
});