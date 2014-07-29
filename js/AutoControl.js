define([
    'underscore', 'react',
    './controls/KendoText',
    './controls/MultilineText',
    './controls/SwitchBox',
    './controls/KendoNumber',
    './controls/KendoDatetime',
    './controls/KendoDate',
    './controls/KendoTime',
    './controls/KendoComboBox',
    './ImmutableOptimizations'
], function (_, React, KendoText, MultilineText, SwitchBox, KendoNumber, KendoDatetime, KendoDate, KendoTime, KendoComboBox,
             ImmutableOptimizations) {
    'use strict';

    var TYPE_TO_CONTROL = {
        'text' : KendoText,
        'text:multiLine' : MultilineText,
        'number' : KendoNumber,
        'date' : KendoDate,
        'datetime' : KendoDatetime,
        'time' : KendoTime,
        'boolean' : SwitchBox
    };
    var CONTROL_PROPS = ['key', 'id', 'value', 'onChange', 'isValid', 'disabled', 'noControl'];

    var AutoControl = React.createClass({
        mixins: [ImmutableOptimizations(['onChange', 'dataSource'])],

        statics: {
            controlForField: function (fieldInfo) {
                var dataType = fieldInfo.dataType;

                if (fieldInfo.options) {
                    return KendoComboBox;
                }
                if (fieldInfo.multiLine) {
                    dataType = dataType + ':multiLine';
                }

                return TYPE_TO_CONTROL[dataType];
            }
        },

        getDefaultProps: function () {
            return {
                key: undefined,
                value: undefined,
                onChange: undefined,
                dataSource: undefined, // optional, usually comes as fieldInfo.options.dataSource. Only use here if the fieldInfo is stored in react state and you don't want to put a DataSource in react state.
                id: undefined,
                fieldInfo: undefined,
                isValid: [true, ''],
                disabled: false,
                readonly: false,
                noControl: false,
                controlForField: AutoControl.controlForField
            };
        },

        render: function () {
            var fieldInfo = this.props.fieldInfo;
            var Control = this.props.controlForField(fieldInfo) || AutoControl.controlForField(fieldInfo);
            var controlProps = _.pick(this.props, CONTROL_PROPS);

            controlProps.name = fieldInfo.name; // to help with debugging in the presence of asynchronous rendering

            // Add placeholder text
            controlProps.placeholder = fieldInfo.placeholder;

            // pass through format prop for controls that use it
            controlProps.format = fieldInfo.format;

            // Either fieldInfo or parent component can specify readonly status
            controlProps.readonly = this.props.readonly || fieldInfo.readOnly;

            // Add in some constraints from typeInfo
            controlProps.min = fieldInfo.minValue;
            controlProps.max = fieldInfo.maxValue;
            controlProps.step = fieldInfo.stepValue;
            controlProps.minLength = fieldInfo.minLength;
            controlProps.maxLength = fieldInfo.maxLength;
            controlProps.isPassword = fieldInfo.isPassword;

            if (fieldInfo.options) {
                controlProps.dataSource = this.props.dataSource || fieldInfo.options.dataSource;
                controlProps.valueField = fieldInfo.options.metadata.idProperty;
                controlProps.displayField = fieldInfo.options.metadata.nameProperty;
            }

            return Control(controlProps);
        }
    });

    return AutoControl;
});

/*
    fieldInfo looks like this:

{
    "name": "tmfItemId",
    "label": "ID",
    "dataType": "text",
    "placeholder": "100.02",
    "helpText": "Unique identifier for the List Item (####.##)",
    "array": false,
    "readonly": false,
    "required": true,
    "multiLine": false,
    "options": null,
    "maxLength": 32,
    "minLength": 32,
    "pattern": "^[a-zA-Z0-9]{1,5}\\.[a-zA-Z0-9]{1,3}$",
    "maxValue": null,
    "minValue": null,
    "decimals": 0,
    "stepValue": 1.0
}
*/
