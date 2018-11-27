var mockUserRepo1 = {
    'HashMap': {
        '0': {
            "uin": "123456789",
            "lastName": "Daniels",
            "firstName": "Jack",
            "role": "ROLE_ADMIN"
        },
        '1': {
            "uin": "987654321",
            "lastName": "Daniels",
            "firstName": "Jill",
            "role": "ROLE_USER"
        },
        '2': {
            "uin": "192837465",
            "lastName": "Smith",
            "firstName": "Jacob",
            "role": "ROLE_USER"
        }
    }
};

var mockUserRepo2 = {
    'HashMap': {
        '0': {
            "uin": "321654987",
            "lastName": "Daniels",
            "firstName": "John",
            "role": "ROLE_ADMIN"
        },
        '1': {
            "uin": "789456123",
            "lastName": "Daniels",
            "firstName": "Joann",
            "role": "ROLE_USER"
        },
        '2': {
            "uin": "564738291",
            "lastName": "Smith",
            "firstName": "Joseph",
            "role": "ROLE_USER"
        }
    }
};

var mockUserRepo3 = {
    'HashMap': {
        '0': {
            "uin": "111111111",
            "lastName": "User1",
            "firstName": "Test",
            "role": "ROLE_ADMIN"
        },
        '1': {
            "uin": "222222222",
            "lastName": "User2",
            "firstName": "Test",
            "role": "ROLE_USER"
        },
        '2': {
            "uin": "333333333",
            "lastName": "User3",
            "firstName": "Test",
            "role": "ROLE_USER"
        }
    }
};

angular.module('mock.userRepo', []).service('UserRepo', function ($q) {
    var repo = this;
    var defer;
    var validations = {};
    var validationResults = {};
    var originalList;

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

    var messageResponse = function (message) {
        return defer.resolve({
            body: angular.toJson({
                meta: {
                    status: 'SUCCESS',
                    message: message
                }
            })
        });
    };

    repo.mockedList = [];

    repo.mock = function(toMock) {
        repo.mockedList = [];
        originalList = [];

        if (toMock.HashMap) {
            for (var i in toMock.HashMap) {
                repo.mockedList.push(toMock.HashMap[i]);
                originalList.push(toMock.HashMap[i]);
            }
        }
    };

    repo.mock(mockUserRepo1);

    repo.add = function (modelJson) {
        if (!repo.contains(modelJson)) {
            repo.mockedList.push(modelJson);
        }
    };

    repo.addAll = function (modelJsons) {
        for (var i in modelJsons) {
            repo.add(modelJsons[i]);
        }
    };

    repo.clearValidationResults = function () {
        validationResults = {};
    };

    repo.create = function (model) {
        defer = $q.defer();
        model.id = repo.mockedList.length + 1;
        repo.mockedList.push(angular.copy(model));
        payloadResponse(model);
        return defer.promise;
    };

    repo.contains = function (model) {
        var found = false;
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id === model.id) {
                found = true;
                break;
            }
        }
        return found;
    };

    repo.count = function () {
        return repo.mockedList.length;
    };

    repo.delete = function (model) {
        defer = $q.defer();
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id === model.id) {
                repo.mockedList.splice(i, 1);
                break;
            }
        }
        payloadResponse();
        return defer.promise;
    };

    repo.deleteById = function (id) {
        defer = $q.defer();
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id === id) {
                repo.mockedList.splice(i, 1);
                break;
            }
        }
        payloadResponse();
        return defer.promise;
    };

    repo.findById = function (id) {
        var found;
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id == id) {
                found = angular.copy(repo.mockedList[i]);
            }
        }
        return found;
    };

    repo.getAll = function () {
        return angular.copy(repo.mockedList);
    };

    repo.getAllByRole = function (role) {
        var found;
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].role == role) {
                found = angular.copy(repo.mockedList[i]);
                break;
            }
        }

        return found;
    };

    repo.getAllFiltered = function(predicate) {
        var data = repo.mockedList;
        var filteredData = [];
        // TODO
        return filteredData;
    };

    repo.getAssignableUsers = function (roles) {
        var payload = {};
        defer = $q.defer();
        // TODO
        payloadResponse(payload);
        return defer.promise;
    };

    repo.getContents = function () {
        return angular.copy(repo.mockedList);
    };

    repo.getEntityName = function () {
        return "UserRepo";
    };

    repo.getValidations = function () {
        return angular.copy(validations);
    };

    repo.getValidationResults = function () {
        return angular.copy(validationResults);
    };

    repo.listen = function (cbOrActionOrActionArray, cb) {
        // TODO
    };

    repo.ready = function () {
        defer = $q.defer();
        payloadResponse();
        return defer.promise;
    };

    repo.remove = function (modelToRemove) {
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id === modelToRemove.id) {
                repo.mockedList.splice(i, 1);
                break;
            }
        }
    };

    repo.reset = function () {
        defer = $q.defer();
        repo.mockedList = repo.originalList;
        payloadResponse();
        return defer.promise;
    };

    repo.save = function (model) {
        defer = $q.defer();
        // TODO
        payloadResponse({});
        return defer.promise;
    };

    repo.saveAll = function () {
        angular.forEach(repo.mockedList, function (model) {
            repo.save(model);
        });
    };

    repo.setToDelete = function (id) {
        // TODO
    };
    repo.setToUpdate = function (id) {
        // TODO
    };

    repo.unshift = function (modelJson) {
        // TODO
    };

    repo.update = function (model) {
        defer = $q.defer();
        var updated;
        for (var i in repo.mockedList) {
            if (repo.mockedList[i].id === model.id) {
                updated = angular.copy(repo.mockedList[i]);
                angular.extend(updated, model);
                break;
            }
        }
        payloadResponse(updated);
        return defer.promise;
    };

    return repo;
});
