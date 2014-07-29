/** @jsx React.DOM */
define([
    'underscore', 'react', './FormField', './AutoControl', './ImmutableOptimizations'
], function (_, React, FormField, AutoControl, ImmutableOptimizations) {
    'use strict';


    var AutoField = React.createClass({
        mixins: [ImmutableOptimizations(['onChange', 'dataSource'])],

        getDefaultProps: function () {
            return {
                fieldInfo: undefined,
                layout: undefined,
                value: undefined,
                onChange: undefined,
                isValid: [true, ''],
                dataSource: undefined,
                noControl: undefined
            };
        },

        render: function () {
            return (
                <FormField fieldInfo={this.props.fieldInfo} isValid={this.props.isValid} layout={this.props.layout}>
                    <AutoControl
                        key={this.props.key}
                        fieldInfo={this.props.fieldInfo}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        dataSource={this.props.dataSource || undefined}
                        noControl={this.props.noControl} />
                </FormField>
            );
        }
    });


    return AutoField;
});