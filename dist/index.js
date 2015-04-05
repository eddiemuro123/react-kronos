// Generated by CoffeeScript 1.9.1
'use strict';
var Calendar, Keys, Kronos, Levels, React, Types, Units, getPropsAndAttach, getStyle, jss, moment, ref;

React = require('react');

moment = require('moment-range');

jss = require('jss');

jss.use(require('jss-nested'));

jss.use(require('jss-camel-case'));

jss.use(require('jss-vendor-prefixer'));

jss.use(require('jss-px'));

ref = require('./constants'), Keys = ref.Keys, Levels = ref.Levels, Units = ref.Units, Types = ref.Types;

Calendar = require('./calendar');

getPropsAndAttach = require('./react-hoc-jss');

getStyle = require('./styles');

Kronos = React.createClass({
  displayName: 'Kronos',
  render: function() {
    return React.createElement("div", {
      "className": this.props.classes.kronos
    }, React.createElement("input", {
      "type": 'text',
      "ref": 'input',
      "value": this.state.input,
      "onClick": ((function(_this) {
        return function() {
          return _this.toggle(true);
        };
      })(this)),
      "onFocus": ((function(_this) {
        return function() {
          return _this.toggle(true);
        };
      })(this)),
      "onBlur": this.onBlur,
      "onKeyDown": ((function(_this) {
        return function(e) {
          return _this.onKeyDown(e.keyCode);
        };
      })(this)),
      "onChange": this.onChange,
      "placeholder": this.props.placeholder,
      "className": this.props.classes.input
    }), this.state.visible && React.createElement(Calendar, {
      "datetime": this.state.datetime || moment(),
      "onSelect": this.onSelect,
      "above": ((function(_this) {
        return function(bool) {
          return _this.above = bool;
        };
      })(this)),
      "level": this.state.level,
      "setLevel": ((function(_this) {
        return function(level) {
          return _this.setState({
            level: level
          });
        };
      })(this))
    }));
  },
  getInitialState: function() {
    return {
      datetime: this.getDateTimeInput().datetime,
      input: this.getDateTimeInput().input,
      type: this.getDateTimeInput().type,
      visible: false,
      level: this.getDefaultLevel()
    };
  },
  getDateTimeInput: function(props) {
    var datetime, isoRegex, prop, type;
    if (props == null) {
      props = this.props;
    }
    prop = props.date || props.time || null;
    datetime = this.parse(prop);
    isoRegex = /((\d{4}\-\d\d\-\d\d)[tT]([\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))/;
    type = (function() {
      switch (typeof prop) {
        case 'object':
          if (moment.isDate(prop)) {
            return Types.JS_DATE;
          } else if (moment.isMoment(prop)) {
            return Types.MOMENT;
          } else {
            return null;
          }
          break;
        case 'string':
          if (prop.match(isoRegex)) {
            return Types.ISO;
          } else {
            return Types.STRING;
          }
      }
    })();
    return {
      datetime: datetime,
      input: datetime.format(this.format(props)) || null,
      type: type
    };
  },
  getDefaultLevel: function() {
    if (this.props.date) {
      return Units.DAY;
    } else if (this.props.time) {
      return Units.HOUR;
    } else {
      return null;
    }
  },
  format: function(props) {
    if (props == null) {
      props = this.props;
    }
    if (props.format) {
      return props.format;
    } else if (props.date) {
      return 'MM-DD-YYYY';
    } else if (props.time) {
      return 'h:mm a';
    } else {
      return null;
    }
  },
  toggle: function(visible) {
    if (visible == null) {
      visible = !this.state.visible;
    }
    if (visible !== this.state.visible) {
      return this.setState({
        visible: visible
      });
    }
  },
  parse: function(input) {
    var parsing, ref1, test;
    parsing = moment(input, this.format(), true);
    if (!parsing.isValid()) {
      test = new Date(input);
      if (isNaN(test.getTime())) {
        test = ((ref1 = this.state) != null ? ref1.datetime : void 0) ? this.state.datetime : moment();
      }
      parsing = moment(test);
    }
    return parsing;
  },
  save: function(saving) {
    var datetime;
    datetime = this.state.datetime;
    if (this.props.date) {
      saving.hours(datetime.hours());
      saving.minutes(datetime.minutes());
    }
    if (this.props.time) {
      saving.date(datetime.date());
      saving.month(datetime.month());
      saving.year(datetime.year());
    }
    this.setState({
      datetime: saving,
      input: saving.format(this.format())
    });
    return this.commit(saving);
  },
  commit: function(datetime) {
    var base, result, returnAs;
    returnAs = this.props.returnAs || this.state.type;
    result = (function() {
      switch (returnAs) {
        case Types.ISO:
          return datetime.toISOString();
        case Types.JS_DATE:
          return datetime.toDate();
        case Types.MOMENT:
          return datetime;
        case Types.STRING:
          return datetime.format(this.format());
      }
    }).call(this);
    return typeof (base = this.props).onChange === "function" ? base.onChange(result) : void 0;
  },
  onChange: function(e) {
    var datetime, input;
    input = e.target.value;
    datetime = moment(input, this.format(), true);
    if (datetime.isValid()) {
      return this.save(datetime);
    } else {
      return this.setState({
        input: input
      });
    }
  },
  onSelect: function(datetime, close) {
    this.setState({
      visible: this.props.closeOnSelect && close ? !this.state.visible : this.state.visible
    });
    return this.save(datetime);
  },
  onBlur: function() {
    var datetime;
    if (this.above) {
      React.findDOMNode(this.refs.input).focus();
    } else {
      if (this.props.closeOnBlur) {
        this.toggle(false);
      }
    }
    if (this.state.input === this.state.datetime.format(this.format())) {

    } else {
      datetime = this.parse(this.state.input);
      return this.save(datetime);
    }
  },
  onKeyDown: function(code) {
    var datetime, lvl;
    datetime = this.state.datetime || moment();
    lvl = Levels[this.state.level];
    switch (code) {
      case Keys.UP:
        return this.onSelect(datetime.subtract(lvl.key.span, lvl.key.unit));
      case Keys.DOWN:
        return this.onSelect(datetime.add(lvl.key.span, lvl.key.unit));
      case Keys.ENTER:
        if (lvl.down) {
          return this.setState({
            level: lvl.down
          });
        } else {
          if (this.state.input === datetime.format(this.format())) {
            return this.toggle();
          } else {
            if (!this.state.visible) {
              this.toggle(true);
            }
            datetime = this.parse(this.state.input);
            return this.save(datetime);
          }
        }
    }
  },
  above: false,
  propTypes: {
    date: React.PropTypes.any,
    time: React.PropTypes.any,
    format: React.PropTypes.string,
    onChange: React.PropTypes.func,
    returnAs: React.PropTypes.oneOf([Types.ISO, Types.JS_DATE, Types.MOMENT, Types.STRING]),
    closeOnSelect: React.PropTypes.bool,
    closeOnBlur: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      closeOnSelect: true,
      closeOnBlur: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props !== nextProps) {
      return this.setState({
        datetime: this.getDateTimeInput(nextProps).datetime,
        input: this.getDateTimeInput(nextProps).input
      });
    }
  }
});

module.exports = getPropsAndAttach(Kronos, function(props) {
  return getStyle('index', props);
});
