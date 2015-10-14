<script type="text/ng-template" id="/builder/templates/fields.html">
	<div class="lb-fields">
		<div ng-repeat="field in fields" class="lb-field">
			<div class="lb-field-label">{{field.label}}</div>
			<div ng-switch="field.type" class="lb-field-value">
				<div ng-switch-when="text">
					<input ng-model="values[field.code]" type="{{field.inputType || 'text'}}" />
				</div>
				<div ng-switch-when="textarea">
					<textarea ng-model="values[field.code]"></textarea>
				</div>
				<div ng-switch-when="select">
					<select
						ng-init="values[field.code] = values[field.code] || field.default"
						ng-model="values[field.code]"
						ng-options="option.value as option.label for option in field.options"></select>
				</div>
				<div ng-switch-when="list" class="lb-field-list">
					<div ui-sortable ng-model="values[field.code]">
						<div ng-repeat="value in values[field.code]" class="lb-field-list-item">
							<div class="lb-field-list-item-meta">
								Item #{{$index + 1}}
								<button ng-click="removeItem(values[field.code], $index)">Remove Item</button>
							</div>
							<div lb-fields-nested="field.list" values="value"></div>
						</div>
					</div>
					<div class="lb-field-list-add"><button ng-click="addItem(values, field.code)">Add Item</button></div>
				</div>
			</div>
		</div>
	</div>
</script>
