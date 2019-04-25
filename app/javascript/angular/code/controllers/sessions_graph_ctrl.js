import * as graphHighlight from "../services/google/graph_highlight";
import * as graph from "../services/graph";

function SessionsGraphCtrl(
  $scope,
  map,
  heat,
  sensors,
  $window,
  $timeout,
  singleFixedSession
) {
  $scope.$window = $window;
  $scope.isSingleSessionSelected = false;
  $scope.heat = heat;
  $scope.sensors = sensors;
  var singleSession = $scope.singleSession;

  $scope.$watch("singleSession.isSingle()", function() {
    console.log("watch - singleSession.isSingle()");
    $scope.isSingleSessionSelected = singleSession.isSingle();
  });

  $scope.$watch("singleSession.get().loaded", function() {
    console.log("watch - singleSession.get().loaded");
    if (
      $scope.isSingleSessionSelected &&
      !_.isEmpty(singleSession.measurements())
    ) {
      $scope.redraw();
    }
  });

  $scope.$watch("isSingleSessionSelected", function(isSingleSessionSelected) {
    console.log("watch - isSingleSessionSelected");
    if (!isSingleSessionSelected) {
      graphHighlight.hide();
    } else {
      $timeout(function() {
        $($window).trigger("resize");
        $scope.redraw();
      });
    }
  });

  $scope.shouldRedraw = function() {
    return singleSession.isSingle() && !!singleSession.get().loaded;
  };

  $scope.$watch(
    "heat.getValues()",
    function() {
      console.log("watch - heat.getValues()");
      if ($scope.shouldRedraw()) {
        $scope.redraw();
      }
    },
    true
  );

  $scope.redraw = function() {
    if (!singleSession.withSelectedSensor()) {
      return;
    }
    if (singleSession.isFixed())
      graph.getInitialData(sensors.anySelected(), heat, singleFixedSession);
    else
      graph.draw(
        singleSession.measurementsToTime(),
        false,
        sensors.anySelected(),
        heat
      );
  };
}
SessionsGraphCtrl.$inject = [
  "$scope",
  "map",
  "heat",
  "sensors",
  "$window",
  "$timeout",
  "singleFixedSession"
];
angular.module("aircasting").controller("SessionsGraphCtrl", SessionsGraphCtrl);
