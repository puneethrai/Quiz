define([], function () {
    var QuizAbstraction = Backbone.View.extend({
        _renderAttempts: function () {
            var self = this;
            self.$el.find(".dummyAttempts").html(self.model.get("attempts") + "/" + self.model.get("totalattempt"));
            if (this.state) {
                self.$el.find(".dummyFeedback").removeClass("hide").fadeIn();
            }
        }
    });
    return QuizAbstraction;
});