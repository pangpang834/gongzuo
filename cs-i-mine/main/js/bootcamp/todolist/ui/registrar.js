goog.provide('wap.bootcamp.todolist.ui.Registrar');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
wap.bootcamp.todolist.ui.Registrar = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  /**
   * @type {Element}
   * @private
   */
  this.$text_ = null;
  
  /**
   * @type {Element}
   * @private
   */
  this.$addButton_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.enabled_ = false;
};
goog.inherits(wap.bootcamp.todolist.ui.Registrar, goog.ui.Component);


/**
 * @type {string}
 */
wap.bootcamp.todolist.ui.Registrar.CSS_CLASS = goog.getCssName('registrar');


/**
 * @enum {string}
 */
wap.bootcamp.todolist.ui.Registrar.CSS_CLASSES = {
  TEXT: goog.getCssName('registrar-text'),
  ADD_BUTTON: goog.getCssName('registrar-add-button'),
  DISABLED: goog.getCssName('registrar-disabled')
};

/** @override */
wap.bootcamp.todolist.ui.Registrar.prototype.canDecorate = function($element) {
  return (
      goog.base(this, 'canDecorate', $element) &&
      goog.dom.classlist.contains($element, wap.bootcamp.todolist.ui.Registrar.CSS_CLASS) &&
      Boolean(this.findTextElement_($element)) &&
      Boolean(this.findAddButtonElement_($element))
  );
};

/** @override */
wap.bootcamp.todolist.ui.Registrar.prototype.decorateInternal = function($element) {
  goog.base(this, 'decorateInternal', $element);
  this.$text_ = this.findTextElement_($element);
  this.$addButton_ = this.findAddButtonElement_($element);
  this.enabled_ = !goog.dom.classlist.contains(
      $element, wap.bootcamp.todolist.ui.Registrar.CSS_CLASSES.DISABLED);
};


/** @override */
wap.bootcamp.todolist.ui.Registrar.prototype.disposeInternal = function() {
  this.$text_ = null;
  this.$addButton_ = null;
  this.enabled_ = false;
  goog.base(this, 'disposeInternal');
};


/** @override */
wap.bootcamp.todolist.ui.Registrar.prototype.enterDocument = function() {
  goog.base(this,'enterDocument');
  this.getHandler().listen(
      this.$addButton_,
      goog.events.EventType.CLICK,
      this.fireAddEvent_
  );
};

/**
 * @param {Element} $element
 * @return {Element}
 * @private
 */
wap.bootcamp.todolist.ui.Registrar.prototype.findTextElement_ = function($element) {
  return this.getDomHelper().getElementByClass(
    wap.bootcamp.todolist.ui.Registrar.CSS_CLASSES.TEXT, $element);
};

/**
 * @param {Element} $element
 * @return {Element}
 * @private
 */
wap.bootcamp.todolist.ui.Registrar.prototype.findAddButtonElement_ = function($element) {
  return this.getDomHelper().getElementByClass(
    wap.bootcamp.todolist.ui.Registrar.CSS_CLASSES.ADD_BUTTON, $element);
};

/**
 * @param {goog.events.Event} event
 * @private
 */
wap.bootcamp.todolist.ui.Registrar.prototype.fireAddEvent_ = function(event) {
  var addEvent=new wap.bootcamp.todolist.ui.Registrar.AddEvent(this.$text_.value);
  if(this.dispatchEvent(addEvent)){
    this.$text_.value="";
  }
};


/**
 * @enum {string}
 */
wap.bootcamp.todolist.ui.Registrar.EventType = {
  ADD: goog.events.getUniqueId('registrar-add')
};


/**
 * @param {string} text
 * @constructor
 * @extends {goog.events.Event}
 */
wap.bootcamp.todolist.ui.Registrar.AddEvent = function(text) {
  goog.base(this, wap.bootcamp.todolist.ui.Registrar.EventType.ADD);
  this.text = text;
};
goog.inherits(wap.bootcamp.todolist.ui.Registrar.AddEvent, goog.events.Event);

/**
 * @return {boolean}
 */
wap.bootcamp.todolist.ui.Registrar.prototype.isEnabled = function() {
  return this.enabled_;
};


/**
 * @param {boolean} enabled
 */
wap.bootcamp.todolist.ui.Registrar.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.$text_.disabled = !enabled;
  this.$addButton_.disabled = !enabled;
  goog.dom.classlist.enable(this.getElement(),
      wap.bootcamp.todolist.ui.Registrar.CSS_CLASSES.DISABLED, !enabled);
};
