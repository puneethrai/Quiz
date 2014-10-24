define(function () {
    var DataLayer = {

        _connection: null,
        _currentIndex: 0,
        _db: null,
        /*
         * ENUM for db properties
         */
        PROPERTIES: {
            dbName: 'quiz',
            dbVersion: '',
            dbDescription: 'Quiz wizard',
            dbSize: 200000
        },
        //Database Queries List
        QUERIES: {
            //Create
            createTableQuiz: "CREATE TABLE IF NOT EXISTS QUIZ( id INTEGER PRIMARY KEY AUTOINCREMENT, testID INTEGER, input, attempts INTEGER, totalattempt INTEGER, result )",
            //Insert
            insertIntoQuiz: 'INSERT INTO QUIZ(id,testID,input,attempts,totalattempt, result) VALUES (NULL,"',
            //update
            updateQuiz: "UPDATE QUIZ SET testID='--T--',input='--I--',attempts='--A--',totalattempt='--TT--',result='--R--' WHERE id=?",
            //Drop
            dropQuizTable: " DROP TABLE IF EXISTS QUIZ",
            //get
            selectAllFromQuiz: 'SELECT * FROM QUIZ ORDER BY testID',
            //Search
            searchContact: "SELECT * FROM OTRANSACTION WHERE name LIKE '--S--%' OR mobileNo LIKE '--S--%' OR workNo LIKE '--S--%' OR homeNo LIKE '--S--%' OR avataruri LIKE '--S--%' OR email LIKE '--S--%' OR homeAdd LIKE '--S--%' OR workAdd LIKE '--S--%'  ORDER BY jid",
            searchExistingID: "SELECT * FROM QUIZ WHERE testID = ?",
            //Delete
            deleteQuiz: "DELETE FROM QUIZ WHERE id = ?"
        },
        initialize: function (searchFor) {
            /*jslint unparam:true*/
            var self = this,
                defer = $.Deferred();
            if (!self._db) {
                //Open the database with the properties listed in the ENUM
                self._db = window.openDatabase(this.PROPERTIES.dbName, this.PROPERTIES.dbVersion, this.PROPERTIES.dbDescription, this.PROPERTIES.dbSize);
                if (self._db) {
                    //self._executeSql(self.QUERIES.dropQuizTable, null, function () {
                        self._executeSql(self.QUERIES.createTableQuiz, null, function () {
                            defer.resolve();
                        }, function () {
                            defer.reject();
                        });
                    //});
                }
            }
            return defer.promise();
        },
        getAllQuiz: function () {

            var self = this,
                defer = $.Deferred();
            if (self._db) {
                self._executeSql(self.QUERIES.selectAllFromQuiz, null, function (tx, transactions) {
                    /*jslint unparam:true*/
                    var tempModels = [],
                        transactionsIndex = 0;
                    for (transactionsIndex = 0; transactionsIndex < transactions.rows.length; transactionsIndex++) {
                        defer.notify(transactions.rows.item(transactionsIndex));
                        tempModels.push(transactions.rows.item(transactionsIndex));
                    }
                    defer.resolve(tempModels);
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        getQuizByTestID: function (testID) {
            var self = this,
                defer = $.Deferred();
            if (self._db) {
                self._executeSql(self.QUERIES.searchExistingID, [testID], function (tx, quizs) {
                    /*jslint unparam:true*/
                    if (quizs.rows.length === 1) {
                        defer.resolve(quizs.rows.item(0));
                    } else {
                        defer.reject();
                    }
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();

        },
        addQuiz: function (quizData) {

            var self = this,
                defer = $.Deferred(),
                SQL = "",
                id = [];
            if (quizData.id) {
                SQL = self.QUERIES.updateQuiz.replace("--T--", quizData.testID)
                    .replace("--I--", quizData.input)
                    .replace("--A--", quizData.attempts)
                    .replace("--TT--", quizData.totalattempt)
                    .replace("--R--", "none");
                id = [quizData.id];
            } else {
                SQL = self.QUERIES.insertIntoQuiz + quizData.testID + "\",'" + quizData.input + "',\"" + quizData.attempts + '","' + quizData.totalattempt + '","' + "blah" + '")';
            }
            quizData.id = quizData.id || "NULL";
            if (self._db) {
                self._executeSql(SQL, id, function (tx, transactions) {
                    /*jslint unparam:true*/
                    if (transactions.rows.length > 0) {
                        defer.resolve(transactions.rows.item(0));
                    } else if(id.length === 0){
                        //New entry
                        defer.resolve(transactions.insertId);
                    } else {
                        defer.resolve();
                    }
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        removeQuiz: function (id) {

            var self = this,
                defer = $.Deferred();
            self._executeSql(self.QUERIES.deleteQuiz, [id], function (tx, transactions) {
                /*jslint unparam:true*/
                defer.resolve();
            }, function () {
                defer.reject();
            });
            return defer.promise();
        },
        _executeSql: function (SQL, params, successCallback, errorCallback, options) {
            var self = this;
            var success = function (tx, result) {
                self._logger(SQL + (params || "--No prams--") + " - finished", "DEBUG", "_executeSql");
                if (successCallback) {
                    successCallback(tx, result);
                }
            };
            var error = function (tx, error) {
                self._logger(SQL + (params || "--No prams--") + " - error: " + error.message, "DEBUG", "_executeSql");
                if (errorCallback) {
                    return errorCallback(tx, error);
                }
            };

            if (options && options.transaction) {
                options.transaction.executeSql(SQL, params, success, error);
            } else {
                this._db.transaction(function (tx) {
                    tx.executeSql(SQL, params, success, error);
                });
            }
        },

        /*
         * @function: _logger
         * @description: logging function for Telephony router module
         * @params: message {String}: Message to log
         * @params: type {String}: Type of log
         * Optional params
         * @params: functionName {String}: Name of the function
         * @params: fileName {String}: File Name
         */
        _logger: function (message, logType, functionName, fileName) {
            /*jslint unparam:true*/
            if (!functionName && arguments.callee && arguments.callee.caller) {
                //unable to get caller name since it may not be named function call
                functionName = arguments.callee.caller.name || arguments.callee.caller.toString();
            }
            console.log(message);
            /*app.context.notify(app.Events.Log,_.extend({
                message      : message,
                fileName     : fileName||"contact-abstraction",
                functionName : functionName,
                type         : logType
            },app.context.getSettings()));*/
        },
    };
    return DataLayer;
});