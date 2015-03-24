EspadonApp.directive('resize', function($window) {
    return {
        link: function ($scope, element, attrs) {

        	element.height($window.innerHeight);

            angular.element($window).bind('resize', function() {
                element.height($window.innerHeight);
            });
        }
    };
});