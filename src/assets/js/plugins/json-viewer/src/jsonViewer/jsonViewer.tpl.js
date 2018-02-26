angular.module("jv.json-viewer").run(["$templateCache", function($templateCache) {$templateCache.put("jsonViewer/jsonViewer.tpl.html","<div id=\"main\" class=\"beautify\">\n  <div class=\"ui-editor\" ng-show=\"editor\">\n    <textarea class=\"ui-field json\" id=\"editor\" ng-model=\"editorText\" ng-change=\"analyzeJson()\" spellcheck=\"false\" contenteditable=\"true\"></textarea>\n    <div class=\"ui-resizer\"></div>\n  </div>\n  <div class=\"ui-aside\">\n    <div class=\"ui-notification\" id=\"status\"><b>Invalid JSON</b> &nbsp; 1&nbsp;error&nbsp;found</div>\n    <div class=\"ui-menu\">\n      <div class=\"ui-menu-dropdown\">\n        <div class=\"ui-menu-panel\">\n          <div class=\"ui-menu-item ui-option\" id=\"beautify\">Beautify</div>\n          <div class=\"ui-menu-item ui-option\" id=\"show-types\">Show Types</div>\n          <div class=\"ui-menu-item ui-option\" id=\"show-indexes\">Show Indexes</div>\n          <div class=\"ui-menu-item about\" style=\"display:none\">About</div>\n        </div>\n      </div>\n    </div>\n    <div class=\"ui-treeview json\" id=\"result\">\n    </div>\n  </div>\n</div>\n");}]);