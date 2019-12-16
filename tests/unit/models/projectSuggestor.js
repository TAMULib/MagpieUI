describe('model: ProjectSuggestor', function () {
  var model, rootScope, scope, WsApi;

  beforeEach(function() {
    module('core');
    module('metadataTool');
    module('mock.wsApi');

    inject(function ($rootScope, ProjectSuggestor, _WsApi_) {
      rootScope = $rootScope;
      scope = $rootScope.$new();

      WsApi = _WsApi_;

      model = angular.extend(new ProjectSuggestor(), dataProjectSuggestor1);
    });
  });

  describe('Is the model defined', function () {
    it('should be defined', function () {
      expect(model).toBeDefined();
    });
  });
});
