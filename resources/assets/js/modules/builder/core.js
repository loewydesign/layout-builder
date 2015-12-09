(function(angular) {
	var app = window.layoutBuilder,
		module = app.modules.builder = angular.module('lb.builder', [
			'ui.bootstrap',
			'ui.sortable',
			'lb.fields'
		]);

	module.run(['lb.fields.config', function(lbFieldsConfig) {
		lbFieldsConfig.uploadUrl = app.ROUTE_URL;
	}]);
	
	
	// custom filter to convert breakpoints string to html column classes.
	module.filter('bpClass', function() {
		return function(bps) {
			var
				r = new RegExp("(?:"+ app.COL_BPS.join('|') +")\-?(?:push|pull|offset)?\-(?:[0-9]+)", "g")
				m = bps ? bps.match(r) : null;
				
			if (m && m.length)
			{
				return 'col-' + m.join(' col-');
			}
			
			// invalid breakpoints given, default to col-sm-12 class.
			return 'col-sm-12';
		};
	});

	function mainController($scope, $http, locale)
	{
		$scope.id = app.load.id;
		$scope.meta = app.load.meta || {};
		$scope.metaFields = app.load.metaFields || [];

		$scope.languages = locale.getLanguages();
		$scope.language = locale.getCurrentLanguage();

		$scope.$watch('language', function(newValue, oldValue) {
			if (newValue !== oldValue)
			{
				locale.setCurrentLanguage(newValue);
			}
		});

		/**
		 * $scope.state // state stack for undo/redo
		 *   state 3
		 *   state 2
		 *   state 1
		 *   state 0 i.e. current state // data for current stat
		 *     rows // list of rows OR elements
		 *       row/elem 0
		 *       row/elem 1  <-----------------------------------------------------------+
		 *         cols // list of columns                                               |
		 *           col 0                                                               |
		 *           col 1                                                               |
		 *             rows // list of rows OR elements in a column                      |
		 *               row/elem 1                                                      |
		 *               row/elem 2 // a row would have the same structure as above   >--+
		 *               row/elem 3
		 *                 type // "row" or "<element_type>", where <element_type> is the actual element type
		 *                 data // data mapped by language
		 *                   en
		 *                   es
		 *                   de
		 *                     foo // data value in particular language
		 *                     bar
		 *                     baz
		 *                   ...
		 */
		var initialState = app.load.state;

		if (!initialState ||
			typeof initialState !== 'object' ||
			Object.prototype.toString.call(initialState.rows) !== '[object Array]')
		{
			initialState = {
				rows: []
			};
		}
		
		// 2015/12/01
		//     - The column breakpoint configuration is updated to a single text field (from
		//       two dropdowns) to allow multiple breakpoint classes. 
		(function(state) {
			var _updateBreakpoints = function(rows) {
				for (var i = 0, n = rows.length; i < n; i++)
				{
					var cols = rows[i].cols || [], 
						col, 
						bp, 
						size,
						new_bp;
					
					for (var j = 0, m = cols.length; j < m; j++)
					{
						col = cols[j];
						
						// check and convert old 'bp' and 'size' data to new breakpoint format
						if (typeof col.bp !== 'undefined' && typeof col.size !== 'undefined')
						{
							bp = col.bp || '';
							size = parseInt(col.size || '', 10) || 0;
							// default
							new_bp = 'sm-6';
							
							if (bp && jQuery.inArray(bp, app.COL_BPS) >= 0 && size && jQuery.inArray(size, app.COL_SIZES))
							{
								new_bp = bp + '-' + size;
							}
							
							delete col.size;
							delete col.bp;
							
							col.bps = new_bp;
							
							if (col.rows)
							{
								_updateBreakpoints(col.rows);
							}
						}
					}
				}
			};
			
			_updateBreakpoints(state.rows);
		})(initialState);
		

		// stack of states in newest to oldest order
		$scope.states = [initialState];
		$scope.state = initialState;

		$scope.pushState = function() {
			// push a copy of the current state one behind the current state
			$scope.states.splice(1, 0, angular.copy($scope.state));
		};

		$scope.popState = function() {
			if ($scope.states.length <= 1)
			{
				return;
			}
			$scope.states.pop();
			$scope.state = $scope.states[$scope.states.length - 1];
		};

		$scope.save = function() {
			$scope.saving = true;

			$http({
				method: 'POST',
				url: app.ROUTE_URL,
				data: {
					action: 'save',
					id: $scope.id,
					meta: $scope.meta,
					state: $scope.state
				}
			}).then(function(resp) {
				$scope.id = resp.data.id;
			}).catch(function(error) {
				alert('Oops, something went wrong! Please try again. Error: ' + error);
			}).finally(function() {
				$scope.saving = false;
			});
		};
	}

	module.controller('MainController', mainController, [
		'$scope',
		'$http',
		'locale'
	]);
})(angular);
