var mockProject1 = {
    'id': 1
};

var mockProject2 = {
    'id': 2
};

var mockProject3 = {
    'id': 3
};

angular.module('mock.project', []).service('Project', function($q) {
    var model = this;
    var defer;
    var payloadResponse = function (payload) {
        return defer.resolve({
            body: angular.toJson({
                meta: {
                    status: 'SUCCESS'
                },
                payload: payload
            })
        });
    };

    model.isDirty = false;

    model.mock = function(toMock) {
        model.id = toMock.id;
    };

    model.clearValidationResults = function () {
    };

    model.delete = function() {
        defer = $q.defer();
        payloadResponse(true);
        return defer.promise;
    };

    model.dirty = function(boolean) {
        model.isDirty = boolean;
    };

    model.reload = function() {
    };

    model.save = function() {
        defer = $q.defer();
        payloadResponse(true);
        return defer.promise;
    };

    return model;
});
