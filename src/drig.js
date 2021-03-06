/*
  Dependencies.
 */

var $ = window.$; //require('jquery');

/**
 * Initialization plugin function which is publish in jquery.
 * @param  {[type]} options
 * @return {[type]}
 */
var drig = function drigJqueryPluginFromHtml(options) {
  options = require('./optionsParsing').parse(options);
  var events = require('./events');
  var changePageEvents = require('./changePageEvents');
  var parser = require('./parser');
  if (options.isData) {
    var html = processData(options.data, options);
    this.html(html);
  }
  var element = this[0];
  events.register(element);
  changePageEvents.register(element);

  //Handle custom events.
  element.addEventListener('application:change-order', function(event) {
    console.info('application:change-order');
    parser.parse(element);
  }, false);
  element.addEventListener('application:parse', function(data) {
    if (options.callback) {
      options.callback(data);
    } else {
      console.log('new appOrder', data);
    }
  }, false);
  return this;
};

/**
 * Process the data and display a grid.
 * @param  {data to display.} data
 * @return {[type]}
 */
function processData(data, options) {
  options = options || {};
  options.perPage = options.perPage || 4;
  var templates = require('./templates');
  var domElement = document.createElement('div');
  domElement.innerHTML = templates.grid({
    grid: 'drig'
  }, options);
  var applications = data.applications;
  var pages = [
    []
  ];
  var currentPage = 0,
    newLength;
  applications.forEach(function(application) {
    application.currentPage = currentPage;
    newLength = pages[currentPage].push(application);
    //If the number of app is greater than the max page.
    if (newLength === options.perPage) {
      currentPage++;
      pages[currentPage] = [];
    }
  });

  //console.log('pages', pages);

  pages.forEach(function(page, pageIndex) {
    $('div.pageContainer', domElement).append(templates.page({
      page: pageIndex,
      perPage: options.perPage,
      isHidden: pageIndex !== 0
    }, options));
    var apps = page;
    var pageSelector = ".page[data-page='" + pageIndex + "']";
    apps.forEach(function(application) {
      //console.log("application", application);
      $(pageSelector, domElement).append(templates.application(application, options));
    });

  });

  return domElement;
}

module.exports = drig;