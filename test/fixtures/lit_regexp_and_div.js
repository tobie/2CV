/*!
 *  script.aculo.us version 2.0.0_a1
 *  (c) 2005-2009 Thomas Fuchs
 *
 *  script.aculo.us is freely distributable under the terms of an MIT-style license.
 *----------------------------------------------------------------------------------*/




var s2 = {
  Version: '2.0.0_a1',

  Extensions: {}
};

s2.css = {
  PROPERTY_MAP: {
    backgroundColor: 'color',
    borderBottomColor: 'color',
    borderBottomWidth: 'length',
    borderLeftColor: 'color',
    borderLeftWidth: 'length',
    borderRightColor: 'color',
    borderRightWidth: 'length',
    borderSpacing: 'length',
    borderTopColor: 'color',
    borderTopWidth: 'length',
    bottom: 'length',
    color: 'color',
    fontSize: 'length',
    fontWeight: 'integer',
    height: 'length',
    left: 'length',
    letterSpacing: 'length',
    lineHeight: 'length',
    marginBottom: 'length',
    marginLeft: 'length',
    marginRight: 'length',
    marginTop: 'length',
    maxHeight: 'length',
    maxWidth: 'length',
    minHeight: 'length',
    minWidth: 'length',
    opacity: 'number',
    outlineColor: 'color',
    outlineOffset: 'length',
    outlineWidth: 'length',
    paddingBottom: 'length',
    paddingLeft: 'length',
    paddingRight: 'length',
    paddingTop: 'length',
    right: 'length',
    textIndent: 'length',
    top: 'length',
    width: 'length',
    wordSpacing: 'length',
    zIndex: 'integer',
    zoom: 'number'
  },

  LENGTH: /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/,

  NUMBER: /([\+-]*\d+\.?\d*)/,

  __parseStyleElement: document.createElement('div'),

  parseStyle: function(styleString) {
    s2.css.__parseStyleElement.innerHTML = '<div style="' + styleString + '"></div>';
    var style = s2.css.__parseStyleElement.childNodes[0].style, styleRules = {};

    s2.css.NUMERIC_PROPERTIES.each( function(property){
      if (style[property]) styleRules[property] = style[property];
    });

    s2.css.COLOR_PROPERTIES.each( function(property){
      if (style[property]) styleRules[property] = s2.css.colorFromString(style[property]);
    });

    if (Prototype.Browser.IE && styleString.include('opacity'))
      styleRules.opacity = styleString.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1];

    return styleRules;
  },

  normalizeColor: function(color) {
    if (!color || color == 'rgba(0, 0, 0, 0)' || color == 'transparent') color = '#ffffff';
    color = s2.css.colorFromString(color);
    return [
      parseInt(color.slice(1,3),16), parseInt(color.slice(3,5),16), parseInt(color.slice(5,7),16)
    ];
  },

  colorFromString: function(color) {
    var value = '#', cols, i;
    if (color.slice(0,4) == 'rgb(') {
      cols = color.slice(4,color.length-1).split(',');
      i=3; while(i--) value += parseInt(cols[2-i]).toColorPart();
    } else {
      if (color.slice(0,1) == '#') {
        if (color.length==4) for(i=1;i<4;i++) value += (color.charAt(i) + color.charAt(i)).toLowerCase();
        if (color.length==7) value = color.toLowerCase();
      }
    }
    return (value.length==7 ? value : (arguments[1] || value));
  },

  interpolateColor: function(from, to, position){
    from = s2.css.normalizeColor(from);
    to = s2.css.normalizeColor(to);

    return '#' + [0,1,2].map(function(index){
      return Math.max(Math.min(from[index].tween(to[index], position).round(), 255), 0).toColorPart();
    }).join('');
  },

  interpolateNumber: function(from, to, position){
    return parseFloat((from||0).tween(to, position).toFixed(3));
  },

  interpolateLength: function(from, to, position){
    if(!from) from = '0'+to.gsub(s2.css.NUMBER,'');
    to.scan(s2.css.NUMBER, function(match){ to = parseFloat(match[1]); });
    return from.gsub(s2.css.NUMBER, function(match){
      return parseFloat(parseFloat(match[1]).tween(to, position).toFixed(3)).toString();
    });
  },

  interpolateInteger: function(from, to, position){
    return parseInt(from).tween(to, position).round();
  },

  interpolate: function(property, from, to, position){
    return s2.css['interpolate'+s2.css.PROPERTY_MAP[property.camelize()].capitalize()](from, to, position);
  },

  ElementMethods: {
    getStyles: function(element) {
      var css = document.defaultView.getComputedStyle($(element), null);
      return s2.css.PROPERTIES.inject({ }, function(styles, property) {
        styles[property] = css[property];
        return styles;
      });
    }
  }
};

s2.css.PROPERTIES = [];
for(property in s2.css.PROPERTY_MAP) s2.css.PROPERTIES.push(property);

s2.css.NUMERIC_PROPERTIES = s2.css.PROPERTIES.findAll(function(property){ return !property.endsWith('olor') });
s2.css.COLOR_PROPERTIES   = s2.css.PROPERTIES.findAll(function(property){ return property.endsWith('olor') });

if (!(document.defaultView && document.defaultView.getComputedStyle)) {
  s2.css.ElementMethods.getStyles = function(element) {
    element = $(element);
    var css = element.currentStyle, styles;
    styles = s2.css.PROPERTIES.inject({ }, function(hash, property) {
      hash[property] = css[property];
      return hash;
    });
    if (!styles.opacity) styles.opacity = element.getOpacity();
    return styles;
  };
};

Element.addMethods(s2.css.ElementMethods);

s2.fx = (function(){
  var queues = [], globalQueue,
    heartbeat, activeEffects = 0;

  function beatOnDemand(dir){
    heartbeat[(activeEffects += dir) > 0 ? 'start' : 'stop']();
  }

  function renderQueues(){
    queues.invoke('render', heartbeat.getTimestamp());
  }

  function initialize(initialHeartbeat){
    if(globalQueue) return;
    queues.push(globalQueue = new s2.fx.Queue());
    s2.fx.DefaultOptions.queue = globalQueue;
    heartbeat = initialHeartbeat || new s2.fx.Heartbeat();

    document
      .observe('effect:heartbeat', renderQueues)
      .observe('effect:queued',    beatOnDemand.curry(1))
      .observe('effect:dequeued',  beatOnDemand.curry(-1));
  }

  return {
    initialize: initialize,
    getQueues: function(){ return queues; },
    addQueue: function(queue){ queues.push(queue); },
    getHeartbeat: function(){ return heartbeat; },
    setHeartbeat: function(newHeartbeat){
      heartbeat = newHeartbeat;
    }
  }
})();

Object.extend(s2.fx, {
  DefaultOptions: {
    transition: 'sinusoidal',
    position:   'parallel',
    fps:        60,
    duration:   .2
  },

  elementDoesNotExistError: {
    name: 'ElementDoesNotExistError',
    message: 'The specified DOM element does not exist, but is required for this effect to operate'
  },

  parseOptions: function(options) {
    if (Object.isNumber(options))
      options = { duration: options };
    else if (Object.isFunction(options))
      options = { after: options };
    else if (Object.isString(options))
      options = { duration: options == 'slow' ? 1 : options == 'fast' ? .1 : .2 };

    return options;
  }
});

s2.fx.Base = Class.create({
  initialize: function(options) {
    s2.fx.initialize();
    this.updateWithoutWrappers = this.update;

    if(options && options.queue && !s2.fx.getQueues().include(options.queue))
      s2.fx.addQueue(options.queue);

    this.setOptions(options);
    this.duration = this.options.duration*1000;
    this.state = 'idle';

    ['after','before'].each(function(method) {
      this[method] = function(method) {
        method(this);
        return this;
      }
    }, this);
  },

  setOptions: function(options) {
    options = s2.fx.parseOptions(options);

    if (!this.options) {
      this.options = Object.extend(Object.extend({},s2.fx.DefaultOptions), options);
      if(options.tween) this.options.transition = options.tween;
    }

    if (this.options.beforeUpdate || this.options.afterUpdate) {
      this.update = this.updateWithoutWrappers.wrap( function(proceed,position){
        if (this.options.beforeUpdate) this.options.beforeUpdate(this, position);
        proceed(position);
        if (this.options.afterUpdate) this.options.afterUpdate(this, position);
      }.bind(this));
    }
    if(this.options.transition === false)
      this.options.transition = s2.fx.Transitions.linear;
    this.options.transition = Object.propertize(this.options.transition, s2.fx.Transitions);
  },

  play: function(options) {
    this.setOptions(options);
    this.frameCount = 0;
    this.options.queue.add(this);
    this.maxFrames = this.options.fps * this.duration / 1000;
    return this;
  },

  render: function(timestamp) {
    if (timestamp >= this.startsAt) {
      if (this.state == 'idle') {
        if (this.options.before) this.options.before(this);
        if (this.setup) this.setup();
        this.state = 'running';
        this.update(this.options.transition(0));
        this.frameCount++;
        return this;
      }
      if (timestamp >= this.endsAt && !(this.state == 'finished')) {
        this.update(this.options.transition(1));
        if (this.teardown) this.teardown();
        if (this.options.after) this.options.after(this);
        this.state = 'finished';
      } else if (this.state == 'running') {
        var position = 1 - (this.endsAt - timestamp) / this.duration;
        if ((this.maxFrames * position).floor() > this.frameCount) {
          this.update(this.options.transition(position));
          this.frameCount++;
        }
      }
    }
    return this;
  },

  cancel: function(after) {
    if(!this.state == 'running') return;
    if (this.teardown) this.teardown();
    if (after && this.options.after) this.options.after(this);
    this.state = 'finished';
  },

  finish: function(after) {
    if(!this.state == 'running') return;
    this.update(this.options.transition(1));
    this.cancel(true);
  },

  inspect: function() {
    return '#<s2.fx:' + [this.state, this.startsAt, this.endsAt].inspect() + '>';
  }
});

s2.fx.Element = Class.create(s2.fx.Base, {
  initialize: function($super, element, options) {
    if(!(this.element = $(element)))
      throw(s2.fx.elementDoesNotExistError);
    this.operators = [];
    return $super(options);
  },

  animate: function() {
    var args = $A(arguments), operator =  args.shift();
    operator = operator.charAt(0).toUpperCase() + operator.substring(1);
    this.operators.push(new s2.fx.Operators[operator](this, args[0], args[1] || {}));
  },

  play: function($super, element, options) {
    if (element) this.element = $(element);
    return $super(options);
  },

  update: function(position) {
    this.operators.invoke('render', position);
  }
});
s2.fx.Heartbeat = Class.create({
  initialize: function(options) {
    this.options = Object.extend({
      framerate: Prototype.Browser.MobileSafari ? 20 : 60
    }, options);
    this.beat = this.beat.bind(this);
  },

  start: function() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval =
      setInterval(this.beat, 1000/this.options.framerate);
    this.updateTimestamp();
  },

  stop: function() {
    if (!this.heartbeatInterval) return;
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
    this.timestamp = null;
  },

  beat: function() {
    this.updateTimestamp();
    document.fire('effect:heartbeat');
  },

  getTimestamp: function() {
    return this.timestamp || this.generateTimestamp();
  },

  generateTimestamp: function() {
    return new Date().getTime();
  },

  updateTimestamp: function() {
    this.timestamp = this.generateTimestamp();
  }
});
s2.fx.Queue = (function(){
  return function(){
    var effects = [];

    function getEffects(){
      return effects;
    }

    function active(){
      return effects.length > 0;
    }

    function add(effect){
      calculateTiming(effect);
      effects.push(effect);
      document.fire('effect:queued', this);
      return this;
    }

    function remove(effect){
      effects = effects.without(effect);
      delete effect;
      document.fire('effect:dequeued', this);
      return this;
    }

    function render(timestamp){
      effects.invoke('render', timestamp);
      effects.select(function(effect) {
        return effect.state == 'finished';
      }).each(remove);
      return this;
    }

    function calculateTiming(effect){
      var position = effect.options.position || 'parallel',
        startsAt = s2.fx.getHeartbeat().getTimestamp();

      if (position == 'end')
        startsAt = effects.without(effect).pluck('endsAt').max() || startsAt;

      effect.startsAt =
        startsAt + (effect.options.delay || 0) * 1000;
      effect.endsAt =
        effect.startsAt + (effect.options.duration || 1) * 1000;
    }

    Object.extend(this, {
      getEffects: getEffects,
      active: active,
      add: add,
      remove: remove,
      render: render
    });
  }
})();

s2.fx.Attribute = Class.create(s2.fx.Base, {
  initialize: function($super, object, from, to, options, method) {
    object = Object.isString(object) ? $(object) : object;

    this.method = Object.isFunction(method) ? method.bind(object) :
      Object.isFunction(object[method]) ? object[method].bind(object) :
      function(value) { object[method] = value };

    this.to = to;
    this.from = from;

    return $super(options);
  },

  update: function(position) {
    this.method(this.from.tween(this.to, position));
  }
});
s2.fx.Style = Class.create(s2.fx.Element, {
  setup: function() {
    this.animate('style', this.element, { style: this.options.style });
  }
});
s2.fx.Operators = { };

s2.fx.Operators.Base = Class.create({
  initialize: function(effect, object, options) {
    this.effect = effect;
    this.object = object;
    this.options = Object.extend({
      transition: Prototype.K
    }, options);
  },

  inspect: function() {
    return "#<s2.fx.Operators.Base:" + this.lastValue + ">";
  },

  setup: function() {
  },

  valueAt: function(position) {
  },

  applyValue: function(value) {
  },

  render: function(position) {
    var value = this.valueAt(this.options.transition(position));
    this.applyValue(value);
    this.lastValue = value;
  }
});

s2.fx.Operators.Style = Class.create(s2.fx.Operators.Base, {
  initialize: function($super, effect, object, options) {
    $super(effect, object, options);
    this.element = $(this.object);

    this.style = Object.isString(this.options.style) ?
      s2.css.parseStyle(this.options.style) : this.options.style;

    this.tweens = [];
    for(var item in this.style){
      var property = item.underscore().dasherize(),
        from = this.element.getStyle(property), to = this.style[item];
      if(from!=to)
        this.tweens.push([
          property, s2.css.interpolate.curry(property, from, to),
          item in this.options.propertyTransitions ?
            Object.propertize(this.options.propertyTransitions[item], s2.fx.Transitions) : Prototype.K
        ]);
    }
  },

  valueAt: function(position) {
    return this.tweens.map( function(tween){
      return tween[0]+':'+tween[1](tween[2](position));
    }).join(';')
  },

  applyValue: function(value) {
    if(this.currentStyle == value) return;
    this.element.setStyle(value);
    this.currentStyle = value;
  }
});

s2.fx.Morph = Class.create(s2.fx.Element, {
  setup: function() {
    if (this.options.change)
      this.setupWrappers();
    else if (this.options.style)
      this.animate('style', this.destinationElement || this.element, {
        style: this.options.style,
        propertyTransitions: this.options.propertyTransitions || { }
      });
  },

  teardown: function() {
    if (this.options.change)
      this.teardownWrappers();
  },

  setupWrappers: function() {
    var elementFloat = this.element.getStyle("float"),
      sourceHeight, sourceWidth,
      destinationHeight, destinationWidth,
      maxHeight;

    this.transitionElement = new Element('div').setStyle({ position: "relative", overflow: "hidden", 'float': elementFloat });
    this.element.setStyle({ 'float': "none" }).insert({ before: this.transitionElement });

    this.sourceElementWrapper = this.element.cloneWithoutIDs().wrap('div');
    this.destinationElementWrapper = this.element.wrap('div');

    this.transitionElement.insert(this.sourceElementWrapper).insert(this.destinationElementWrapper);

    sourceHeight = this.sourceElementWrapper.getHeight();
    sourceWidth = this.sourceElementWrapper.getWidth();

    this.options.change();

    destinationHeight = this.destinationElementWrapper.getHeight();
    destinationWidth  = this.destinationElementWrapper.getWidth();

    this.outerWrapper = new Element("div");
    this.transitionElement.insert({ before: this.outerWrapper });
    this.outerWrapper.setStyle({
      overflow: "hidden", height: sourceHeight + "px", width: sourceWidth + "px"
    }).appendChild(this.transitionElement);

    maxHeight = Math.max(destinationHeight, sourceHeight), maxWidth = Math.max(destinationWidth, sourceWidth);

    this.transitionElement.setStyle({ height: sourceHeight + "px", width: sourceWidth + "px" });
    this.sourceElementWrapper.setStyle({ position: "absolute", height: maxHeight + "px", width: maxWidth + "px", top: 0, left: 0 });
    this.destinationElementWrapper.setStyle({ position: "absolute", height: maxHeight + "px", width: maxWidth + "px", top: 0, left: 0, opacity: 0, zIndex: 2000 });

    this.outerWrapper.insert({ before: this.transitionElement }).remove();

    this.animate('style', this.transitionElement, { style: 'height:' + destinationHeight + 'px; width:' + destinationWidth + 'px' });
    this.animate('style', this.destinationElementWrapper, { style: 'opacity: 1.0' });
  },

  teardownWrappers: function() {
    var destinationElement = this.destinationElementWrapper.down();

    if (destinationElement)
      this.transitionElement.insert({ before: destinationElement });

    this.transitionElement.remove();
  }
});
s2.fx.Parallel = Class.create(s2.fx.Base, {
  initialize: function($super, effects, options) {
    this.effects = effects || [];
    return $super(options || {});
  },

  setup: function() {
    this.effects.invoke('setup');
  },

  update: function(position) {
    this.effects.invoke('update', position);
  }
});

s2.fx.Operators.Scroll = Class.create(s2.fx.Operators.Base, {
  initialize: function($super, effect, object, options) {
    $super(effect, object, options);
    this.start = object.scrollTop;
    this.end = this.options.scrollTo;
  },

  valueAt: function(position) {
    return this.start + ((this.end - this.start)*position);
  },

  applyValue: function(value){
    this.object.scrollTop = value.round();
  }
});

s2.fx.Scroll = Class.create(s2.fx.Element, {
  setup: function() {
    this.animate('scroll', this.element, { scrollTo: this.options.to });
  }
});


s2.fx.Transitions = {

  linear: Prototype.K,

  sinusoidal: function(pos) {
    return (-Math.cos(pos*Math.PI)/2) + 0.5;
  },

  reverse: function(pos) {
    return 1 - pos;
  },

  mirror: function(pos, transition) {
    transition = transition || s2.fx.Transitions.sinusoidal;
    if(pos<0.5)
      return transition(pos*2);
    else
      return transition(1-(pos-0.5)*2);
  },

  flicker: function(pos) {
    var pos = pos + (Math.random()-0.5)/5;
    return s2.fx.Transitions.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
  },

  wobble: function(pos) {
    return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
  },

  pulse: function(pos, pulses) {
    return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
  },

  blink: function(pos, blinks) {
    return Math.round(pos*(blinks||5)) % 2;
  },

  spring: function(pos) {
    return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
  },

  none: Prototype.K.curry(0),

  full: Prototype.K.curry(1)
};


/*!
 *  TERMS OF USE - EASING EQUATIONS
 *  Open source under the BSD License.
 *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
 */

Object.extend(s2.fx.Transitions, {
  easeInQuad: function(pos){
     return Math.pow(pos, 2);
  },

  easeOutQuad: function(pos){
    return -(Math.pow((pos-1), 2) -1);
  },

  easeInOutQuad: function(pos){
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
    return -0.5 * ((pos-=2)*pos - 2);
  },

  easeInCubic: function(pos){
    return Math.pow(pos, 3);
  },

  easeOutCubic: function(pos){
    return (Math.pow((pos-1), 3) +1);
  },

  easeInOutCubic: function(pos){
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
    return 0.5 * (Math.pow((pos-2),3) + 2);
  },

  easeInQuart: function(pos){
    return Math.pow(pos, 4);
  },

  easeOutQuart: function(pos){
    return -(Math.pow((pos-1), 4) -1)
  },

  easeInOutQuart: function(pos){
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
  },

  easeInQuint: function(pos){
    return Math.pow(pos, 5);
  },

  easeOutQuint: function(pos){
    return (Math.pow((pos-1), 5) +1);
  },

  easeInOutQuint: function(pos){
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
    return 0.5 * (Math.pow((pos-2),5) + 2);
  },

  easeInSine: function(pos){
    return -Math.cos(pos * (Math.PI/2)) + 1;
  },

  easeOutSine: function(pos){
    return Math.sin(pos * (Math.PI/2));
  },

  easeInOutSine: function(pos){
    return (-.5 * (Math.cos(Math.PI*pos) -1));
  },

  easeInExpo: function(pos){
    return (pos==0) ? 0 : Math.pow(2, 10 * (pos - 1));
  },

  easeOutExpo: function(pos){
    return (pos==1) ? 1 : -Math.pow(2, -10 * pos) + 1;
  },

  easeInOutExpo: function(pos){
    if(pos==0) return 0;
    if(pos==1) return 1;
    if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
  },

  easeInCirc: function(pos){
    return -(Math.sqrt(1 - (pos*pos)) - 1);
  },

  easeOutCirc: function(pos){
    return Math.sqrt(1 - Math.pow((pos-1), 2))
  },

  easeInOutCirc: function(pos){
    if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
    return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
  },

  easeOutBounce: function(pos){
    if ((pos) < (1/2.75)) {
      return (7.5625*pos*pos);
    } else if (pos < (2/2.75)) {
      return (7.5625*(pos-=(1.5/2.75))*pos + .75);
    } else if (pos < (2.5/2.75)) {
      return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
    } else {
      return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
    }
  },

  easeInBack: function(pos){
    var s = 1.70158;
    return (pos)*pos*((s+1)*pos - s);
  },

  easeOutBack: function(pos){
    var s = 1.70158;
    return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
  },

  easeInOutBack: function(pos){
    var s = 1.70158;
    if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
    return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
  },

  elastic: function(pos) {
    return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
  },

  swingFromTo: function(pos) {
    var s = 1.70158;
    return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
      0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
  },

  swingFrom: function(pos) {
    var s = 1.70158;
    return pos*pos*((s+1)*pos - s);
  },

  swingTo: function(pos) {
    var s = 1.70158;
    return (pos-=1)*pos*((s+1)*pos + s) + 1;
  },

  bounce: function(pos) {
    if (pos < (1/2.75)) {
        return (7.5625*pos*pos);
    } else if (pos < (2/2.75)) {
        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
    } else if (pos < (2.5/2.75)) {
        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
    } else {
        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
    }
  },

  bouncePast: function(pos) {
    if (pos < (1/2.75)) {
        return (7.5625*pos*pos);
    } else if (pos < (2/2.75)) {
        return 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75);
    } else if (pos < (2.5/2.75)) {
        return 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375);
    } else {
        return 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375);
    }
  },

  easeFromTo: function(pos) {
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
  },

  easeFrom: function(pos) {
    return Math.pow(pos,4);
  },

  easeTo: function(pos) {
    return Math.pow(pos,0.25);
  }
});

Function.prototype.optionize = function(){
  var self = this, argumentNames = self.argumentNames(), optionIndex = argumentNames.length - 1,
    method = function(){
    var args = $A(arguments), options = typeof args.last() == 'object' ? args.pop() : {},
      prefilledArgs = (optionIndex == 0 ? [] :
        ((args.length > 0 ? args : [null]).inGroupsOf(optionIndex).flatten())).concat(options);
    return self.apply(this, prefilledArgs);
  };
  method.argumentNames = function(){ return argumentNames };
  return method;
};


Number.prototype.tween = function(target, position){
  return this + (target-this) * position;
};

Object.propertize = function(property, object){
  return Object.isString(property) ? object[property] : property;
};
Element.__scrollTo = Element.scrollTo;
Element.addMethods({
  scrollTo: function(element, to, options){
    if(arguments.length == 1) return Element.__scrollTo(element);
    new s2.fx.Scroll(element, Object.extend(options || {}, { to: to })).play();
    return element;
  }
});

Element.addMethods({
  effect: function(element, effect, options){
    if (Object.isFunction(effect))
      effect = new effect(element, options);
    else if (Object.isString(effect))
      effect = new s2.fx[effect.capitalize()](element, options);
    effect.play(element, options);
    return element;
  },

  morph: function(element, style, options){
    options = s2.fx.parseOptions(options);
    if(!options.queue){
      options.queue = element.retrieve('s2.fx.Queue');
      if(!options.queue)
        element.store('s2.fx.Queue', options.queue = new s2.fx.Queue());
    }
    if(!options.position) options.position = 'end';
    return element.effect('morph', Object.extend(options, {style: style}));
  }.optionize(),

  appear: function(element, options){
    return element.effect('morph', Object.extend({
      before: function(){ element.show().setStyle({opacity: 0}); },
      style:  'opacity:1'
    }, options));
  },

  fade: function(element, options){
    return element.effect(Effect.Morph, Object.extend({
      style: 'opacity:0',
      after: element.hide.bind(element)
    }, options));
  },

  cloneWithoutIDs: function(element) {
    element = $(element);
    var clone = element.cloneNode(true);
    clone.id = '';
    $(clone).select('*[id]').each(function(e) { e.id = ''; });
    return clone;
  }
});


s2.viewportOverlay = function(){
  var viewport = document.viewport.getDimensions(),
    offsets = document.viewport.getScrollOffsets();
  return new Element('div').setStyle({
    position: 'absolute',
    left: offsets.left + 'px', top: offsets.top + 'px',
    width: viewport.width + 'px', height: viewport.height + 'px'
  });
};
