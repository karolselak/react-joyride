'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _class,_temp;var _react=require('react');var _react2=_interopRequireDefault(_react);var _scroll=require('scroll');var _scroll2=_interopRequireDefault(_scroll);var _reactAutobind=require('react-autobind');var _reactAutobind2=_interopRequireDefault(_reactAutobind);var _nestedProperty=require('nested-property');var _nestedProperty2=_interopRequireDefault(_nestedProperty);var _utils=require('./utils');var _Beacon=require('./Beacon');var _Beacon2=_interopRequireDefault(_Beacon);var _Tooltip=require('./Tooltip');var _Tooltip2=_interopRequireDefault(_Tooltip);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var defaultState={index:0,play:false,showTooltip:false,xPos:-1000,yPos:-1000,skipped:false};var listeners={tooltips:{}};var isTouch=false;if(typeof window!=='undefined'){isTouch='ontouchstart'in window||navigator.msMaxTouchPoints;}var Joyride=(_temp=_class=function(_React$Component){_inherits(Joyride,_React$Component);function Joyride(props){_classCallCheck(this,Joyride);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(Joyride).call(this,props));(0,_reactAutobind2.default)(_this);_this.state=defaultState;return _this;}_createClass(Joyride,[{key:'componentDidMount',value:function componentDidMount(){var _this2=this;var props=this.props;this.logger('joyride:initialized',[props]);if(props.resizeDebounce){(function(){var timeoutId=void 0;listeners.resize=function(){clearTimeout(timeoutId);timeoutId=setTimeout(function(){timeoutId=null;_this2.calcPlacement();},props.resizeDebounceDelay);};})();}else{listeners.resize=function(){_this2.calcPlacement();};}window.addEventListener('resize',listeners.resize);if(props.keyboardNavigation&&props.type==='continuous'){listeners.keyboard=this.onKeyboardNavigation;document.body.addEventListener('keydown',listeners.keyboard);}}},{key:'componentWillReceiveProps',value:function componentWillReceiveProps(nextProps){var props=this.props;this.logger('joyride:willReceiveProps',[nextProps]);if(nextProps.steps.length!==props.steps.length){this.logger('joyride:changedSteps',[nextProps.steps]);if(!nextProps.steps.length){this.reset();}else if(nextProps.run){this.reset(true);}}if(!props.run&&nextProps.run&&nextProps.steps.length){this.start();}else if(props.run&&nextProps.run===false){this.stop();}if(!listeners.keyboard&&(!props.keyboardNavigation&&nextProps.keyboardNavigation||props.keyboardNavigation)&&nextProps.type==='continuous'){listeners.keyboard=this.onKeyboardNavigation;document.body.addEventListener('keydown',listeners.keyboard);}else if(listeners.keyboard&&props.keyboardNavigation&&(!nextProps.keyboardNavigation||nextProps.type!=='continuous')){document.body.removeEventListener('keydown',listeners.keyboard);delete listeners.keyboard;}}},{key:'componentDidUpdate',value:function componentDidUpdate(prevProps,prevState){var state=this.state;var props=this.props;if(state.xPos<0){this.calcPlacement();}if(state.play&&props.scrollToSteps&&(props.scrollToFirstStep||state.index>0||prevState.index>state.index)){_scroll2.default.top((0,_utils.getRootEl)(),this.getScrollTop());}}},{key:'componentWillUnmount',value:function componentWillUnmount(){window.removeEventListener('resize',listeners.resize);if(listeners.keyboard){document.body.removeEventListener('keydown',listeners.keyboard);}if(Object.keys(listeners.tooltips).length){Object.keys(listeners.tooltips).forEach(function(key){document.querySelector(key).removeEventListener(listeners.tooltips[key].event,listeners.tooltips[key].cb);delete listeners.tooltips[key];});}}/**
   * Starts the tour
   *
   * @param {boolean} [autorun]- Starts with the first tooltip opened
   */},{key:'start',value:function start(autorun){var _this3=this;var autoStart=autorun===true;this.logger('joyride:start',['autorun:',autoStart]);this.setState({play:true},function(){if(autoStart){_this3.toggleTooltip(true);}});}/**
   * Stop the tour
   */},{key:'stop',value:function stop(){this.logger('joyride:stop');this.setState({showTooltip:false,play:false});}/**
   * Reset Tour
   *
   * @param {boolean} [restart] - Starts the new tour right away
   */},{key:'reset',value:function reset(restart){var shouldRestart=restart===true;var newState=JSON.parse(JSON.stringify(defaultState));newState.play=shouldRestart;this.logger('joyride:reset',['restart:',shouldRestart]);// Force a re-render if necessary
if(shouldRestart&&this.state.play===shouldRestart&&this.state.index===0){this.forceUpdate();}this.setState(newState);}/**
   * Retrieve the current progress of your tour
   *
   * @returns {{index: (number|*), percentageComplete: number, step: (object|null)}}
   */},{key:'getProgress',value:function getProgress(){var state=this.state;var props=this.props;this.logger('joyride:getProgress',['steps:',props.steps]);return{index:state.index,percentageComplete:parseFloat((state.index/props.steps.length*100).toFixed(2).replace('.00','')),step:props.steps[state.index]};}/**
   * Parse the incoming steps
   *
   * @param {Array|Object} steps
   * @returns {Array}
   */},{key:'parseSteps',value:function parseSteps(steps){var _this4=this;var newSteps=[];var tmpSteps=[];var el=void 0;if(Array.isArray(steps)){steps.forEach(function(s){if(s instanceof Object){tmpSteps.push(s);}});}else{tmpSteps=[steps];}tmpSteps.forEach(function(s){if(s.selector.dataset&&s.selector.dataset.reactid){s.selector='[data-reactid="'+s.selector.dataset.reactid+'"]';console.warn('Deprecation warning: React 15.0 removed reactid. Update your code.');//eslint-disable-line no-console
}else if(s.selector.dataset){console.error('Unsupported error: React 15.0+ don\'t write reactid to the DOM anymore, please use a plain class in your step.',s);//eslint-disable-line no-console
if(s.selector.className){s.selector='.'+s.selector.className.replace(' ','.');}}el=document.querySelector(s.selector);s.position=s.position||'top';if(el&&el.offsetParent){newSteps.push(s);}else{_this4.logger('joyride:parseSteps',['Element not rendered in the DOM. Skipped..',s],true);}});return newSteps;}/**
   * Add Tooltip events
   *
   * @param {Object} data
   */},{key:'addTooltip',value:function addTooltip(data){var parseData=this.parseSteps(data);var newData=void 0;var el=void 0;var eventType=void 0;var key=void 0;this.logger('joyride:addTooltip',['data:',data]);if(parseData.length){newData=parseData[0];key=newData.trigger||newData.selector;el=document.querySelector(key);eventType=newData.event||'click';}if(!el){return;}el.setAttribute('data-tooltip',JSON.stringify(data));if(eventType==='hover'&&!isTouch){listeners.tooltips[key]={event:'mouseenter',cb:this.onClickStandaloneTrigger};listeners.tooltips[key+'mouseleave']={event:'mouseleave',cb:this.onClickStandaloneTrigger};listeners.tooltips[key+'click']={event:'click',cb:function cb(e){e.preventDefault();}};el.addEventListener('mouseenter',listeners.tooltips[key].cb);el.addEventListener('mouseleave',listeners.tooltips[key+'mouseleave'].cb);el.addEventListener('click',listeners.tooltips[key+'click'].cb);}else{listeners.tooltips[key]={event:'click',cb:this.onClickStandaloneTrigger};el.addEventListener('click',listeners.tooltips[key].cb);}}/**
   * Log method calls if debug is enabled
   *
   * @private
   * @param {string} type
   * @param {string|Array} [msg]
   * @param {boolean} [warn]
   */},{key:'logger',value:function logger(type,msg,warn){var logger=warn?console.warn||console.error:console.log;//eslint-disable-line no-console
if(this.props.debug){console.log('%c'+type,'color: #760bc5; font-weight: bold; font-size: 12px;');//eslint-disable-line no-console
if(msg){logger.apply(console,msg);}}}/**
   * Get an element actual dimensions with margin
   *
   * @private
   * @param {String|Element} el - Element node or selector
   * @returns {{height: number, width: number}}
   */},{key:'getElementDimensions',value:function getElementDimensions(el){// Get the DOM Node if you pass in a string
var newEl=typeof el==='string'?document.querySelector(el):el;var styles=window.getComputedStyle(newEl);var height=newEl.clientHeight+parseInt(styles.marginTop,10)+parseInt(styles.marginBottom,10);var width=newEl.clientWidth+parseInt(styles.marginLeft,10)+parseInt(styles.marginRight,10);return{height:height,width:width};}/**
   * Get the scrollTop position
   *
   * @private
   * @returns {number}
   */},{key:'getScrollTop',value:function getScrollTop(){var state=this.state;var props=this.props;var step=props.steps[state.index];var target=document.querySelector(step.selector);if(!target){return 0;}var rect=target.getBoundingClientRect();var targetTop=rect.top+(window.pageYOffset||document.documentElement.scrollTop);var position=this.calcPosition(step);var scrollTo=0;if(/^top/.test(position)){scrollTo=Math.floor(state.yPos-props.scrollOffset);}else if(/^bottom|^left|^right/.test(position)){scrollTo=Math.floor(targetTop-props.scrollOffset);}return scrollTo;}/**
   * Keydown event listener
   *
   * @private
   * @param {Event} e - Keyboard event
   */},{key:'onKeyboardNavigation',value:function onKeyboardNavigation(e){var state=this.state;var props=this.props;var intKey=window.Event?e.which:e.keyCode;var hasSteps=void 0;if(state.showTooltip){if([32,38,40].indexOf(intKey)>-1){e.preventDefault();}if(intKey===27){this.toggleTooltip(false,state.index+1,'esc');}else if([13,32].indexOf(intKey)>-1){hasSteps=Boolean(props.steps[state.index+1]);this.toggleTooltip(hasSteps,state.index+1,'next');}}}/**
   * Tooltip event listener
   *
   * @private
   * @param {Event} e - Click event
   */},{key:'onClickStandaloneTrigger',value:function onClickStandaloneTrigger(e){e.preventDefault();var tooltip=e.currentTarget.dataset.tooltip;if(tooltip){tooltip=JSON.parse(tooltip);if(!this.state.tooltip||this.state.tooltip.selector!==tooltip.selector){this.setState({previousPlay:this.state.previousPlay!==undefined?this.state.previousPlay:this.state.play,play:false,showTooltip:false,tooltip:tooltip,xPos:-1000,yPos:-1000});}else{document.querySelector('.joyride-tooltip__close').click();}}}/**
   * Beacon click event listener
   *
   * @private
   * @param {Event} e - Click event
   */},{key:'onClickBeacon',value:function onClickBeacon(e){e.preventDefault();var state=this.state;var props=this.props;if(typeof props.callback==='function'){props.callback({action:'beacon',type:'step:before',step:props.steps[state.index]});}this.toggleTooltip(true,state.index);}/**
   * Tooltip click event listener
   *
   * @private
   * @param {Event} e - Click event
   */},{key:'onClickTooltip',value:function onClickTooltip(e){var state=this.state;var props=this.props;var el=e.currentTarget.className.indexOf('joyride-')===0&&e.currentTarget.tagName==='A'?e.currentTarget:e.target;var type=el.dataset.type;if(el.className.indexOf('joyride-')===0){e.preventDefault();e.stopPropagation();var tooltip=document.querySelector('.joyride-tooltip');var newIndex=state.index+(type==='back'?-1:1);if(type==='skip'){this.setState({skipped:true});newIndex=props.steps.length+1;}if(tooltip.classList.contains('joyride-tooltip--standalone')){this.setState({play:this.state.previousPlay,previousPlay:undefined,tooltip:undefined,xPos:-1000,yPos:-1000});}else if(type){this.toggleTooltip(['continuous','guided'].indexOf(props.type)>-1&&['close','skip'].indexOf(type)===-1&&Boolean(props.steps[newIndex]),newIndex,type);}if(e.target.className==='joyride-overlay'){if(typeof props.callback==='function'){props.callback({action:'click',type:'overlay',step:props.steps[state.index]});}}}}/**
   * Toggle Tooltip's visibility
   *
   * @private
   * @param {Boolean} show - Render the tooltip or the beacon
   * @param {Number} [index] - The tour's new index
   * @param {string} [action]
   */},{key:'toggleTooltip',value:function toggleTooltip(show,index,action){var _this5=this;var props=this.props;var newIndex=index!==undefined?index:this.state.index;this.setState({play:props.steps[newIndex]?this.state.play:false,showTooltip:show,index:newIndex,xPos:-1000,yPos:-1000},function(){var lastIndex=action==='back'?newIndex+1:newIndex-1;if(action&&props.steps[lastIndex]){if(typeof props.stepCallback==='function'){// Deprecated
props.stepCallback(props.steps[lastIndex]);}if(typeof props.callback==='function'){props.callback({action:action,type:'step:after',step:props.steps[lastIndex]});}}if(props.steps.length&&!props.steps[newIndex]){if(typeof props.completeCallback==='function'){// Deprecated
props.completeCallback(props.steps,_this5.state.skipped);}if(typeof props.callback==='function'){props.callback({action:action,type:'finished',steps:props.steps,skipped:_this5.state.skipped});}}});}/**
   * Position absolute elements next to its target
   *
   * @private
   */},{key:'calcPlacement',value:function calcPlacement(){var state=this.state;var props=this.props;var step=state.tooltip?state.tooltip:props.steps[state.index]||{};var showTooltip=state.tooltip?true:state.showTooltip;var target=document.querySelector(step.selector);var placement={x:-1000,y:-1000};this.logger('joyride:calcPlacement',['step:',step]);if(!target){return;}if(step&&(state.tooltip||state.play&&props.steps[state.index])){var offsetX=_nestedProperty2.default.get(step,'style.beacon.offsetX')||0;var offsetY=_nestedProperty2.default.get(step,'style.beacon.offsetY')||0;var position=this.calcPosition(step);var body=document.body.getBoundingClientRect();var component=this.getElementDimensions(showTooltip?'.joyride-tooltip':'.joyride-beacon');var rect=target.getBoundingClientRect();// Calculate x position
if(/^left/.test(position)){placement.x=rect.left-(showTooltip?component.width+props.tooltipOffset:component.width/2+offsetX);}else if(/^right/.test(position)){placement.x=rect.left+rect.width-(showTooltip?-props.tooltipOffset:component.width/2-offsetX);}else{placement.x=rect.left+(rect.width/2-component.width/2);}// Calculate y position
if(/^top/.test(position)){placement.y=rect.top-body.top-(showTooltip?component.height+props.tooltipOffset:component.height/2+offsetY);}else if(/^bottom/.test(position)){placement.y=rect.top-body.top+(rect.height-(showTooltip?-props.tooltipOffset:component.height/2-offsetY));}else{placement.y=rect.top-body.top;}if(/^bottom|^top/.test(position)){if(/left/.test(position)){placement.x=rect.left-(showTooltip?props.tooltipOffset:component.width/2);}else if(/right/.test(position)){placement.x=rect.left+(rect.width-(showTooltip?component.width-props.tooltipOffset:component.width/2));}}this.setState({xPos:this.preventWindowOverflow(Math.ceil(placement.x),'x',component.width,component.height),yPos:this.preventWindowOverflow(Math.ceil(placement.y),'y',component.width,component.height),position:position});}}/**
   * Update position for small screens.
   *
   * @private
   * @param {Object} step
   *
   * @returns {string}
   */},{key:'calcPosition',value:function calcPosition(step){var props=this.props;var showTooltip=this.state.tooltip?true:this.state.showTooltip;var body=document.body.getBoundingClientRect();var target=document.querySelector(step.selector);var component=this.getElementDimensions(showTooltip?'.joyride-tooltip':'.joyride-beacon');if(!target){this.logger('joyride:calcPosition',['step:',step,'target:','NO TARGET'],true);return'top';}var rect=target.getBoundingClientRect();var position=step.position;if(/^left/.test(position)&&rect.left-(component.width+props.tooltipOffset)<0){position='top';}else if(/^right/.test(position)&&rect.left+rect.width+(component.width+props.tooltipOffset)>body.width){position='bottom';}this.logger('joyride:calcPosition',['step:',step,'target:',position]);return position;}/**
   * Prevent tooltip to render outside the window
   *
   * @private
   * @param {Number} value - The axis position
   * @param {String} axis - The Axis X or Y
   * @param {Number} elWidth - The target element width
   * @param {Number} elHeight - The target element height
   * @returns {Number}
   */},{key:'preventWindowOverflow',value:function preventWindowOverflow(value,axis,elWidth,elHeight){var winWidth=window.innerWidth;var body=document.body;var html=document.documentElement;var docHeight=Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);var newValue=value;if(axis==='x'){if(value+elWidth>=winWidth){newValue=winWidth-elWidth-15;}else if(value<15){newValue=15;}}else if(axis==='y'){if(value+elHeight>=docHeight){newValue=docHeight-elHeight-15;}else if(value<15){newValue=15;}}return newValue;}/**
   * Create a React Element
   *
   * @private
   * @returns {*}
   */},{key:'createComponent',value:function createComponent(){var state=this.state;var props=this.props;var currentStep=_extends({},state.tooltip||props.steps[state.index]);var target=currentStep&&currentStep.selector?document.querySelector(currentStep.selector):null;var cssPosition=target?target.style.position:null;var showOverlay=state.tooltip?false:props.showOverlay;var buttons={primary:props.locale.close};var component=void 0;if(!target){this.logger('joyride:createComponent:'+(state.xPos<0?'pre-render':'render'),['component:',state.showTooltip||state.tooltip?'Tooltip':'Beacon','step:',currentStep],true);return false;}this.logger('joyride:createComponent:'+(state.xPos<0?'pre-render':'render'),['component:',state.showTooltip||state.tooltip?'Tooltip':'Beacon','step:',currentStep]);if(target){if(state.showTooltip||state.tooltip){currentStep.position=state.position||currentStep.position;if(!state.tooltip){if(['continuous','guided'].indexOf(props.type)>-1){buttons.primary=props.locale.last;if(props.steps[state.index+1]){if(props.showStepsProgress){var next=props.locale.next;if(typeof props.locale.next==='string'){next=_react2.default.createElement('span',null,props.locale.next);}buttons.primary=_react2.default.createElement('span',null,next,' ',_react2.default.createElement('span',null,state.index+1+'/'+props.steps.length));}else{buttons.primary=props.locale.next;}}if(props.showBackButton&&state.index>0){buttons.secondary=props.locale.back;}}if(props.showSkipButton){buttons.skip=props.locale.skip;}}component=_react2.default.createElement(_Tooltip2.default,{animate:state.xPos>-1,buttons:buttons,cssPosition:cssPosition,disableOverlay:props.disableOverlay,showOverlay:showOverlay,step:currentStep,standalone:Boolean(state.tooltip),type:props.type,xPos:state.xPos,yPos:state.yPos,onClick:this.onClickTooltip});}else{component=_react2.default.createElement(_Beacon2.default,{cssPosition:cssPosition,step:currentStep,xPos:state.xPos,yPos:state.yPos,onTrigger:this.onClickBeacon,eventType:currentStep.type||'click'});}}return component;}},{key:'render',value:function render(){var state=this.state;var props=this.props;var hasStep=Boolean(props.steps[state.index]);var component=void 0;var standaloneTooltip=void 0;if(state.play&&state.xPos<0&&hasStep){this.logger('joyride:render',['step:',props.steps[state.index]]);}else if(!state.play&&state.tooltip){this.logger('joyride:render',['tooltip:',state.tooltip]);}if(state.tooltip){standaloneTooltip=this.createComponent();}else if(state.play&&hasStep){component=this.createComponent();}return _react2.default.createElement('div',{className:'joyride'},component,standaloneTooltip);}}]);return Joyride;}(_react2.default.Component),_class.propTypes={callback:_react2.default.PropTypes.func,completeCallback:_react2.default.PropTypes.func,debug:_react2.default.PropTypes.bool,disableOverlay:_react2.default.PropTypes.bool,keyboardNavigation:_react2.default.PropTypes.bool,locale:_react2.default.PropTypes.object,resizeDebounce:_react2.default.PropTypes.bool,resizeDebounceDelay:_react2.default.PropTypes.number,run:_react2.default.PropTypes.bool,scrollOffset:_react2.default.PropTypes.number,scrollToFirstStep:_react2.default.PropTypes.bool,scrollToSteps:_react2.default.PropTypes.bool,showBackButton:_react2.default.PropTypes.bool,showOverlay:_react2.default.PropTypes.bool,showSkipButton:_react2.default.PropTypes.bool,showStepsProgress:_react2.default.PropTypes.bool,stepCallback:_react2.default.PropTypes.func,steps:_react2.default.PropTypes.array,tooltipOffset:_react2.default.PropTypes.number,type:_react2.default.PropTypes.string},_class.defaultProps={debug:false,keyboardNavigation:true,locale:{back:'Back',close:'Close',last:'Last',next:'Next',skip:'Skip'},resizeDebounce:false,resizeDebounceDelay:200,run:false,scrollToSteps:true,scrollOffset:20,scrollToFirstStep:false,showBackButton:true,showOverlay:true,showSkipButton:false,showStepsProgress:false,steps:[],tooltipOffset:15,type:'single'},_temp);exports.default=Joyride;