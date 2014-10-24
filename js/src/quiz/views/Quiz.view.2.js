define(['templates', './Quiz.view.Abstraction'], function (templates, QuizAbstraction) {
    var quiz2 = QuizAbstraction.extend({
        totalattempt: 2,
        testID: 2,
        state: false,
        inputs: [{
            type: "input",
            title: "Value of x at line 4",
            value: ""
        }, {
            type: "input",
            title: "Value of x at line 6",
            value: ""
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
                success: function (data) {
                    self.renderView(data);
                },
                onError: function (data) {
                    self.renderView({});
                }
            });
            return self;
        },
        renderView: function (data) {
            var self = this,
                input = {};
            self.$el.html(this.template({
                title: "Scope",
                description: "What is the x variable at each line?" + "<code>" + "<pre>var <var>x</var>=0;</pre> " + "<pre>function test(){</pre> " + "<pre>   var <var>x</var>=5;</pre> " + "<pre>   x+=1;</pre> " + "<pre>}</pre> " + "<pre>x;</pre> " + "</code>",
                inputs: self.inputs,
                testID: self.testID,
                feedback: "Variable scoping takes first from function and then from global",
                attempts: self.model.get("attempts"),
                totalattempt: self.totalattempt
            }));
            $("#" + self.options.parentDiv).append(self.$el);
            if (data.input) {
                input = JSON.parse(data.input);
                self.$el.find("input")[0].value = input["1"];
                self.$el.find("input")[1].value = input["2"];
            }
            self._onValidate();
            return self;
        },
        onCheck: function () {
            var attempts = 0;
            if (!this.state) {
                if (this._onValidateInput()) {
                    attempts = this.model.get("attempts") + 1;
                    this.model.set({
                        input: JSON.stringify({
                            1: this.$el.find("input")[0].value.trim(),
                            2: this.$el.find("input")[1].value.trim()
                        }),
                        attempts: attempts
                    });
                    this._onValidate();
                    this.model.save();
                } else {
                    alert("Type your answer");
                }
            }
        },
        _onValidate: function () {
            var self = this;
            if (this._onValidateInput()) {
                if (parseInt(this.$el.find("input")[0].value.trim(), 10) === 6 && parseInt(this.$el.find("input")[1].value.trim(), 10) === 0) {
                    this.$el.find(".panel").removeClass("panel-default panel-danger").addClass("panel-success");
                    this.$el.find(".dummySubmit").attr("disabled", "disabled");
                    this.state = true;
                } else {
                    this.$el.find(".panel").removeClass("panel-default panel-success").addClass("panel-danger");
                    this.state = false;
                }
            }

            if (self.model.get("attempts") >= self.model.get("totalattempt")) {
                this.$el.find(".dummySubmit").attr("disabled", "disabled");
                this.state = true;
            }
            this._renderAttempts();
            return false;
        },
        _onValidateInput: function () {
            return this.$el.find("input")[0].value.trim() !== "" && this.$el.find("input")[1].value.trim() !== "";
        },
    });
    return quiz2;
});