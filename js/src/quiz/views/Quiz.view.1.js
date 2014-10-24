define(['templates', './Quiz.view.Abstraction'], function (templates, QuizAbstraction) {
    var quiz1 = QuizAbstraction.extend({
        totalattempt: 3,
        testID: 1,
        state: false,
        inputs: [{
            type: "radio",
            title: "Weakly typed , Script",
            value: "scriptwt"
        }, {
            type: "radio",
            title: "Strongly typed, Script",
            value: "scriptst"
        }],
        initialize: function initialize(options) {
            this.options = options;
            this.template = templates.get('quiz', 'quiz');
        },
        events: {
            "click .dummySubmit": "onCheck"
        },
        render: function render() {
            var self = this;
            this.model.set({
                testID: self.testID,
                totalattempt: self.totalattempt,
                testID: self.testID,

            });
            this.model.fetch({
                success: function(data){
                    self.renderView(data);
                },
                onError: function (data) {
                    self.renderView({});
                }
            });
            return self;
        },
        renderView: function (data) {
            var self = this;
            self.$el.html(this.template({
                title: "Basic",
                description: "What is Javascript?",
                inputs: self.inputs,
                testID: self.testID,
                feedback: "Javascript is a Weakly typed script!!!!Simple, because you can assign any type of variable to var e.g<code> <kdb>var x= '' </kdb>or <kdb>var x= 2</kdb> </code>",
                attempts: self.model.get("attempts"),
                totalattempt: self.totalattempt
            }));
            $("#" + self.options.parentDiv).append(self.$el);
            self.$el.find("input[value=" + data.input + "]").attr("checked", "checked");
            self._onValidate();
            self.$el.find(".panel-collapse").addClass("in");
            return self;
        },
        onCheck: function () {
            var attempts = 0;
            if (!this.state) {
                if (this.$el.find("input:checked").length > 0) {
                    attempts = this.model.get("attempts") + 1;
                    this.model.set({
                        input: this.$el.find("input:checked").val(),
                        attempts: attempts
                    });
                    this._onValidate();
                    this.model.save();
                } else {
                    alert("select one value");
                }
            }
        },
        _onValidate: function () {
            var self = this;
            if (this.$el.find("input:checked").length > 0) {
                if (this.$el.find("input:checked").val() === "scriptwt") {
                    this.$el.find(".panel").removeClass("panel-default panel-danger").addClass("panel-success");
                    this.$el.find(".dummySubmit").attr("disabled", "disabled");
                    this.state = true;
                } else {
                    this.$el.find(".panel").removeClass("panel-default panel-success").addClass("panel-danger");
                    this.state = false;
                }
            }

            if (self.model.get("attempts")  >= self.model.get("totalattempt")) {
                this.$el.find(".dummySubmit").attr("disabled", "disabled");
                this.state = true;
            }
            this._renderAttempts();
            return false;
        },
    });
    return quiz1;
});