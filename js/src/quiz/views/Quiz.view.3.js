define(['templates', './Quiz.view.Abstraction'], function (templates, QuizAbstraction) {
    var quiz3 = QuizAbstraction.extend({
        totalattempt: 2,
        testID: 3,
        state: false,
        inputs: [{
            type: "input",
            title: "Value of x at line 3 of first code",
            value: ""
        }, {
            type: "input",
            title: "Value of y at line 6 of second code",
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
                title: "Hoisting and Functions",
                description: "What is the value of x and y variable for below code?" + 
                "<code>" + 
                    "<pre>1)var <var>x</var>=0;</pre> " +
                    "<pre>function test(){</pre> " +
                    "<pre>   //value of x at this point</pre> " +
                    "<pre>   var <var>x</var>=5;</pre> " +
                    "<pre>}</pre> " +
                "</code>" +
                "<code>" + 
                    "<pre>2)var <var>add</var>=function(){</pre> " +
                    "<pre>  return function mul(a,b){</pre> " +
                    "<pre>    return <var>a*b</var>;</pre> " +
                    "<pre>  }</pre> " +
                    "<pre>}</pre> " +
                    "<pre>var y = add()(2,3);</pre> " +
                "</code>",
                inputs: self.inputs,
                testID: self.testID,
                feedback: "Hoisting is a Javascript mechanism were-in it looks ahead of a function or file for global scope and declares the variable at the beginning of function/page so for first one it is undefined since it is only declared and not defined. For second problem a function can return anything including another function (Another way encapsulation!!!) , Hence for second one answer is 6",
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
                if (this.$el.find("input")[0].value.trim() === "undefined" && parseInt(this.$el.find("input")[1].value.trim(), 10) === 6) {
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
    return quiz3;
});