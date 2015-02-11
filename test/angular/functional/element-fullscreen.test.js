describe('element-fullscreen template', function() {

  'use strict';

  var scope,
      template,
      html,
      templateText,
      content,
      Styleguide;

  beforeEach(module('sgApp'));

  beforeEach(function() {
    Styleguide = {};
    module(function($provide) {
      $provide.value('Styleguide', Styleguide);
    });
  });

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
    loadTemplate();
    compileTemplate();
  }));

  function loadTemplate() {
    var req = new XMLHttpRequest();
    req.open('GET', '/view/element-fullscreen.html', false);
    req.send(null);
    template = req.responseText;
  }

  function compileTemplate() {
    inject(function($compile) {
      html = $compile(template)(scope);
      scope.$digest();
      templateText = html.prop('outerHTML');
      content = angular.element(html.html()).html();
    });
  }

  function expectDirectiveWithoutValue(directive) {
    var regex = new RegExp('\\s+' + directive + '(\\s+|\\>)[^=]', 'g');
    expect(template).to.match(regex);
  }

  it('should be wrapped in shadow-dom element', function() {
    expect(templateText).to.match(/^<shadow-dom/);
    expect(templateText).to.match(/<\/shadow-dom>$/);
  });

  describe('should have directive', function() {

    it('dynamic-compile without value', function() {
      expectDirectiveWithoutValue('dynamic-compile');
    });

    it('ng-bind-html', function() {
      expect(template).to.match(/\s+ng-bind-html="/);
    });

  });

  describe('directive ng-bind-html', function() {

    it('should filter scope.markup through addWrapper and unsafe', function() {
      var dir = 'ng-bind-html="',
          start = template.indexOf(dir) + dir.length,
          value = template.substring(start, template.indexOf('"', start));
      expect(value).to.match(/markup\s*\|\s*addWrapper\s*\|\s*unsafe\s*/);
    });

  });

  describe('when commonClass is not defined', function() {

    describe('template contents should be', function() {

      it('an empty string if scope.markup is not set', function() {
        expect(content).to.eql('');
      });

      it('text from scope.markup', function() {
        scope.markup = 'hello';
        compileTemplate();
        expect(content).to.eql('hello');
      });

      it('html from scope.markup', function() {
        var expected = '<p>hello!</p>';
        scope.markup = expected;
        compileTemplate();
        expect(content).to.eql(expected);
      });

    });

  });

  describe('when commonClass is defined', function() {

    beforeEach(function() {
      Styleguide.config = {
        data: {
          commonClass: 'foobar'
        }
      };
    });

    it('should wrap scope.markup html in <sg-common-class-wrapper> element', function() {
      scope.markup = '<p>hello!</p>';
      compileTemplate();
      expect(content).to.contain('<p>hello!</p></sg-common-class-wrapper>');
    });

    it('wrapper element should have class defined in commonClass', function() {
      scope.markup = '<p>hello!</p>';
      compileTemplate();
      expect(content).to.contain('<sg-common-class-wrapper class="foobar"><p>hello!</p>');
    });

  });

});
