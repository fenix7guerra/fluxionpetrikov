(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "jquery" ], factory);
	} else if (typeof exports === "object") {
		factory(require("jquery"));
	} else {
		factory(jQuery);
	}
})
		(function($, undef) {
			var dataKey = "plugin_hideShowPassword", shorthandArgs = [ "hide",
					"innerToggle" ], SPACE = 0, ENTER = 13;
			var canSetInputAttribute = function() {
				var body = document.body, input = document
						.createElement("input"), result = true;
				if (!body) {
					body = document.createElement("body");
				}
				input = body.appendChild(input);
				
				body.removeChild(input);
				return result;
			}();
			var defaults = {
				show : "infer",
				innerToggle : false,
				enable : canSetInputAttribute,
				triggerOnToggle : false,
				className : "hideShowPassword-field",
				initEvent : "hideShowPasswordInit",
				changeEvent : "passwordVisibilityChange",
				props : {
					autocapitalize : "off",
					autocomplete : "off",
					autocorrect : "off",
					spellcheck : "false"
				},
				toggle : {
					element : '<button type="button">',
					className : "hideShowPassword-toggle",							
					attachToEvent : "click.hideShowPassword",
					attachToTouchEvent : "touchstart.hideShowPassword mousedown.hideShowPassword",
					attachToKeyEvent : "keyup",
					attachToKeyCodes : true,
					styles : {
						position : "absolute"
					},
					touchStyles : {
						pointerEvents : "none"
					},
					position : "infer",
					verticalAlign : "middle",
					offset : 0,
					attr : {
						role : "button",
						"aria-label" : "Show Password"
						
					}
				},
				wrapper : {
					element : "<div>",
					className : "hideShowPassword-wrapper",
					enforceWidth : true,
					styles : {
						position : "relative"
					},
					inheritStyles : [ ],
					innerElementStyles : {
						
						
				   
					}
				},
				states : {
					shown : {
						className : "hideShowPassword-shown",
						changeEvent : "passwordShown",
						props : {
							type : "text"
						},
						toggle : {
							className : "hideShowPassword-toggle-hide",
							content : "Ocultar",
							attr : {
								"aria-pressed" : "true",
								title : "Hide Password"
							}
						}
					},
					hidden : {
						className : "hideShowPassword-hidden",
						changeEvent : "passwordHidden",
						props : {
							type : "password"
						},
						toggle : {
							className : "hideShowPassword-toggle-show",							content : "Mostrar",							attr : {								"Telefonica" : "false",								title : "Show Password"							}						}					}				}			};			function HideShowPassword(element, options) {				this.element = $(element);				this.wrapperElement = $();				this.toggleElement = $();				this.init(options);			}			HideShowPassword.prototype = {				init : function(options) {					if (this.update(options, defaults)) {						this.element.addClass(this.options.className);						if (this.options.innerToggle) {							this.wrapElement(this.options.wrapper);							this.initToggle(this.options.toggle);							if (typeof this.options.innerToggle === "string") {								this.toggleElement.hide();								this.element.one(this.options.innerToggle, $										.proxy(function() {											this.toggleElement.show();										}, this));							}						}						this.element.trigger(this.options.initEvent, [ this ]);					}				},				update : function(options, base) {					this.options = this.prepareOptions(options, base);					if (this.updateElement()) {						this.element								.trigger(this.options.changeEvent, [ this ])								.trigger(this.state().changeEvent, [ this ]);					}					return this.options.enable;				},				toggle : function(showVal) {					showVal = showVal || "toggle";					return this.update({						show : showVal					});				},				prepareOptions : function(options, base) {					var original = options || {}, keyCodes = [], testElement;					base = base || this.options;					options = $.extend(true, {}, base, options);					if (original.hasOwnProperty("wrapper")							&& original.wrapper.hasOwnProperty("inheritStyles")) {						options.wrapper.inheritStyles = original.wrapper.inheritStyles;					}					if (options.enable) {						if (options.show === "toggle") {							options.show = this									.isType("hidden", options.states);						} else if (options.show === "infer") {							options.show = this.isType("shown", options.states);						}						if (options.toggle.position === "infer") {							if(this.element.css("text-direction") === "rtl"){								options.toggle.position ="left";							}else{								options.toggle.position ="right";							}									}						if (!$.isArray(options.toggle.attachToKeyCodes)) {							if (options.toggle.attachToKeyCodes === true) {								testElement = $(options.toggle.element);								switch (testElement.prop("tagName")										.toUpperCase()) {								case "button":								case "input":									break;								case "a":									if (testElement.filter("[href]").length) {										keyCodes.push(SPACE);										break;									}								default:									keyCodes.push(SPACE, ENTER);									break;								}							}							options.toggle.attachToKeyCodes = keyCodes;						}					}					return options;				},				updateElement : function() {					if (!this.options.enable || this.isType()){						return false;}					this.element.prop(							$									.extend({}, this.options.props, this											.state().props)).addClass(							this.state().className).removeClass(							this.otherState().className);					if (this.options.triggerOnToggle) {						this.element.trigger(this.options.triggerOnToggle,								[ this ]);					}					this.updateToggle();					return true;				},				isType : function(comparison, states) {					states = states || this.options.states;					comparison = comparison							|| this.state(undef, undef, states).props.type;					if (states[comparison]) {						comparison = states[comparison].props.type;					}					return this.element.prop("type") === comparison;				},				state : function(key, invert, states) {					states = states || this.options.states;					if (key === undef) {						key = this.options.show;					}					if (typeof key === "boolean") {							if(key){							key ="shown" ;						}else{							key ="hidden";						}									}					if (invert) {												if(key === "shown" ){							key = "hidden" ;						}else{							key = "shown";						}					}				return states[key];				},				otherState : function(key) {					return this.state(key, true);				},				wrapElement : function(options) {					var enforceWidth = options.enforceWidth, targetWidth;					if (!this.wrapperElement.length) {						targetWidth = this.element.outerWidth();						$.each(options.inheritStyles, $.proxy(function(index,								prop) {							options.styles[prop] = this.element.css(prop);						}, this));						this.element.css(options.innerElementStyles).wrap(								$(options.element).addClass(options.className)										.css(options.styles));						this.wrapperElement = this.element.parent();						if (enforceWidth === true) {							enforceWidth = '100%';						}						if (enforceWidth !== false) {							this.wrapperElement.css("width", enforceWidth +40);						}					}					return this.wrapperElement;				},				initToggle : function(options) {					if (!this.toggleElement.length) {						this.toggleElement = $(options.element).attr(								options.attr).addClass(options.className).css(								options.styles).appendTo(this.wrapperElement);						this.updateToggle();						this.positionToggle(options.position,								options.verticalAlign, options.offset);						if (options.touchSupport) {							this.toggleElement.css(options.touchStyles);							this.element.on(options.attachToTouchEvent, $									.proxy(this.toggleTouchEvent, this));						} else {							this.toggleElement.on(options.attachToEvent, $									.proxy(this.toggleEvent, this));						}						if (options.attachToKeyCodes.length) {							this.toggleElement.on(options.attachToKeyEvent, $									.proxy(this.toggleKeyEvent, this));						}					}					return this.toggleElement;				},				positionToggle : function(position, verticalAlign, offset) {					var styles = {};					styles[position] = offset;					switch (verticalAlign) {					case "top":					case "bottom":					case "right":						styles[verticalAlign] = offset;						break;					case "middle":						styles.display = 'block';						styles.right = '32px';						styles.marginbottom = '-70px';						styles.margintop = '-70px';						break;					}					return this.toggleElement.css(styles);				},				updateToggle : function(state, otherState) {					var paddingProp, targetPadding;					if (this.toggleElement.length) {						paddingProp = "padding-" + this.options.toggle.position  ;						state = state || this.state().toggle;						otherState = otherState || this.otherState().toggle;						this.toggleElement.attr(state.attr).addClass(								state.className).removeClass(								otherState.className).html(state.content);						targetPadding = this.toggleElement.outerWidth()								+ this.options.toggle.offset * 2;						if (this.element.css(paddingProp) !== targetPadding) {							this.element.css(paddingProp, targetPadding);						}					}					return this.toggleElement;				},								toggleEvent : function(event) {					event.preventDefault();					this.toggle();				},												toggleKeyEvent : function(event) {					$.each(this.options.toggle.attachToKeyCodes, $.proxy(							function(index, keyCode) {								if (event.which === keyCode) {									this.toggleEvent(event);									return false;								}							}, this));				},				toggleTouchEvent : function(event) {					var toggleX = this.toggleElement.offset().left, eventX, lesser, greater;					if (toggleX) {						eventX = event.pageX || event.originalEvent.pageX;						if (this.options.toggle.position === "left") {							toggleX += this.toggleElement.outerWidth();							lesser = eventX;							greater = toggleX;						} else {							lesser = toggleX;							greater = eventX;						}						if (greater >= lesser) {							this.toggleEvent(event);						}					}				}			};			$.fn.hideShowPassword = function() {				var options = {};				$.each(arguments, function(index, value) {					var newOptions = {};					if (typeof value === "object") {						newOptions = value;					} else if (shorthandArgs[index]) {						newOptions[shorthandArgs[index]] = value;					} else {						return false;					}					$.extend(true, options, newOptions);				});				return this.each(function() {					var $this = $(this), data = $this.data(dataKey);					if (data) {						data.update(options);					} else {						$this								.data(dataKey, new HideShowPassword(this,										options));					}				});			};			$.each({				show : true,				hide : false,				toggle : "toggle"			}, function(verb, showVal) {				$.fn[verb + "Password"] = function(innerToggle, options) {					return this.hideShowPassword(showVal, innerToggle, options);				}			});		});