/*angular.module('MyApp').directive('ngScrollBottom', function () {
  return {
    scope: {
      ngScrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('ngScrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})*/