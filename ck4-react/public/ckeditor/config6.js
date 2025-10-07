console.log("config6.js");
var _ROOT = DOMAIN_ROOT + (IS_LOCAL_HOST ? "dist/" : "");
var { mathwflow, client } = SHARED_KEY;
CKEDITOR.editorConfig = function (config) {
    config.MathML_InitialRendering = false;
    config.wiriseditorparameters = {
        mml: "MathML",
        editMode: (mathwflow && mathwflow != "") ? mathwflow : "latex"
        //(/PLOS/gi.test(client) ? "MathML" : "latex")
    };
    config.height = '100%';
    config.width = '100%';
    config.language = 'en';
    config.extraPlugins = ['lite', 'liststyle', 'menu', 'floatpanel', 'panel', 'forms', 'notification', 'tableresize', 'symbol', 'texttransform', 'find', 'save', 'maximize', 'wsc', 'zoomin', 'zoomout', 'comment', 'keystroke', 'htmlwriter', 'pastefromword', 'pastetools', 'ajax', 'xml'];
    config.removeFormatTags = 'b,big,cite,code,del,dfn,em,font,i,kbd,q,s,samp,small,strike,strong';
    config.removeFormatAttributes = 'valign';
    config.allowedContent = true;
    config.extraAllowedContent = '*(*)[*]{*}';
    config.shiftEnterMode = CKEDITOR.ENTER_BR;
    config.autoParagraph = false;
    config.ignoreEmptyParagraph = false;
    config.entities = false;
    config.entities_greek = false;
    config.entities_latin = false;
    config.htmlEncodeOutput = false;
    config.entities_processNumerical = true;
    config.entities_processNumerical = 'force'; // Converts from '&nbsp;' into '&#160;';
    config.tabSpaces = 4;
    config.fillEmptyBlocks = false;
    config.stylesSet = 'my_styles';
    config.contentsCss = [];
    ["_default", "cke_custom_", "client"].forEach((name, idx, arr) => {
        let filename = name;
        if (idx == 1) {
            filename = name + (USER_INFO.IS_AUTHOR ? "author" : "all");
        } else if (idx == 0) {
            filename = ("specific/" + (SHORT_TITLE ? SHORT_TITLE : name));
        } else if (idx == 2 && SHARED_KEY[name]) {
            filename = ("specific/" + (SHARED_KEY[name]));
            if (config.contentsCss.some(e => e.includes(filename))) {
                return console.log("already exits: ===> " + filename);
            }
        }
        config.contentsCss.push(_ROOT + `assets/${iVersion}/css/${filename}.css`);

    });
    config.removePlugins = ['showblocks', 'resize', 'iframe', 'smiley', 'flash', 'a11ychecker', 'balloonpanel', 'divarea', 'texzilla', 'format', 'contents', 'balloontoolbar', 'letterspacing', 'newpage', 'magicline', 'codesnippet', 'toc', 'stylesheetparser', 'footnotes', 'crossreference', 'div', 'elementspath', 'scayt', 'link'];
    config.templates = 'customtemplates,default';
    config.templates_files = [
        DOMAIN_ROOT + `ckeditor-${iVersion}/plugins/templates/templates/default.js`,
        DOMAIN_ROOT + `ckeditor-${iVersion}/plugins/templates/templates/customtemplates.js`,
        DOMAIN_ROOT + `ckeditor-${iVersion}/plugins/ckeditor_wiris/integration/WIRISplugins.js?viewer=image`
    ];
    config.removeDialogTabs = 'table:advanced;link:target;link:advanced;image:Link;image:advanced';
    config.disableNativeSpellChecker = true;

    let TrackChange = config.lite || {},
        User_Name = localStorage.getItem(`xmleditor:username:${DOC_ID}`),
        lite_user_id = localStorage.getItem(`xmleditor:usercolor:${DOC_ID}`),
        G = new Date();

    config.lite = TrackChange;
    config.lite.sessionId = sessionStorage.getItem("sessionid") || (String.fromCharCode(65 + Math.round(Math.random() * 26)) + G.getDate() + G.getDay() + G.getHours() + G.getMinutes() + G.getMilliseconds())
    config.lite.userName = User_Name;
    config.lite.ignoreSelectors = [];
    config.lite.userId = (([null, undefined, 'undefined', 'null'].includes(lite_user_id)) ? (Math.floor(1000 + Math.random() * 9000)) : lite_user_id);
    /* beautify preserve:start */
    config.lite.userStyles = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 };
    config.lite.tooltips = { show: !0, delay: 200, cssPath: "css/opentip.css", classPath: "OpentipAdapter" };
    config.copyFormatting_allowRules = 'b; s; u; strong; span; p; table; thead; tbody; ' + 'tr; td; th; ol; ul; li; (*)[*]{*}';
    config.filebrowserBrowseUrl = 'browsefiles.html?docid=' + DOC_ID + '';
    config.filebrowserImageUploadUrl = API_PATH + 'ckupload';
    config.filebrowserUploadMethod = 'xhr';
    config.fileTools_requestHeaders = { appkey: localStorage.getItem("xmleditor:appkey"), apikey: localStorage.getItem("xmleditor:apikey") };
    /* beautify preserve:end */
    config.linkJavaScriptLinksAllowed = true;
    config.forcePasteAsPlainText = 'allow-word';
    // ? https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-pasteFilter
    config.pasteFilter = 'semantic-content';

    config.blockedKeystrokes = [];
    config.toolbar = 'Full';
    config.toolbar_Basic = [
        ['Source', 'Bold', 'Italic', 'htmlcomments']
    ];
    config.toolbar_Full = [{
        name: 'document',
        items: ['save']
    },
    {
        name: 'basicstyles',
        groups: ['basicstyles', 'cleanup'],
        items: ['Bold', 'Italic', /*'Underline',  'Strike',  */ 'Subscript', 'Superscript', 'SmallCaps' /*, '-', 'RemoveFormat'  'CopyFormatting', */]
    },
    {
        name: 'clipboard',
        items: ['Undo', 'Redo', '-', 'Cut', 'Copy ' /*, 'Paste' */]
    },
    {
        name: 'insert',
        items: [ /* 'SpecialChar', */ 'Symbol', 'comment']
    },
    {
        name: 'paragraph',
        items: ['NumberedList', 'BulletedList', '-', /* 'Auto_ReNumber_AG_AFF', */ '-', 'Find' /*, 'Replace', '-','scayt' 'Outdent', 'Indent', '-', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'*/]
    },
    {
        name: 'tools',
        items: ['Maximize', 'zoomout', 'zoomin']
    }
    ];
    if (typeof FormattingHandler != "undefined") {
        config.coreStyles_bold = FormattingHandler.rule.b;
        config.coreStyles_italic = FormattingHandler.rule.i;
        config.coreStyles_strike = FormattingHandler.rule.str;
        config.coreStyles_subscript = FormattingHandler.rule.sub;
        config.coreStyles_superscript = FormattingHandler.rule.sup;
        config.coreStyles_underline = FormattingHandler.rule.u;
        config.coreStyles_smallcaps = FormattingHandler.rule.sc;
    }
    console.log("config6.js-mid");
    if (IS_LOCAL_HOST) { }
    if (IS_TRACK_VIEW) {
        config.readOnly = true;
        config.removePlugins.push('table', 'tableresize', 'tableselection', 'tabletools', 'tab', 'wsc');
    } else {
        config.removePlugins.push('tableselection', 'tableresize', 'tab');
    }
    let ck_wiris = 'ckeditor_wiris';
    if (navigator.onLine) {
        config.extraPlugins.push(ck_wiris);
    } else {
        let idx = config.extraPlugins.indexOf(ck_wiris);
        if (idx > -1) config.extraPlugins.slice(idx, 1);
    }
    var browser_name = 'chrome';
    if (typeof IMPACT.USER_ENV_INFO !== 'undefined' && IMPACT.USER_ENV_INFO.isFirefox) {
        browser_name = 'firefox';
    } else {
        let userAgent = navigator.userAgent;
        browser_name = userAgent.includes('Firefox') ? 'firefox' : 'chrome';
    }

    var formatKey_1 = browserKeyStrokes[browser_name]['superscript'];

    //* Ctrl+Shift+/ *//* //Ctrl+Shift+, */ ,/* //Ctrl++ */
    config.keystrokes = [
        [CKEDITOR.CTRL + CKEDITOR.SHIFT + 191, 'strike'],
        [CKEDITOR.CTRL + formatKey_1, 'superscript'],
        [CKEDITOR.CTRL + CKEDITOR.SHIFT + formatKey_1, 'subscript']
    ];
};
CKEDITOR.dtd.$removeEmpty.insert = false;
for (var tag in CKEDITOR.dtd.$removeEmpty) {
    CKEDITOR.dtd.$removeEmpty[tag] = false;
}

CKEDITOR.plugins.addExternal('zoomout', _ROOT + `ckeditor-${iVersion}/plugins/impact/plugin.js`);
CKEDITOR.plugins.addExternal('zoomin', _ROOT + `ckeditor-${iVersion}/plugins/impact/plugin.js`);
CKEDITOR.plugins.addExternal('save', _ROOT + `ckeditor-${iVersion}/plugins/impact/plugin.js`);
CKEDITOR.plugins.addExternal('comment', _ROOT + `ckeditor-${iVersion}/plugins/impact/plugin.js`);
console.log("config6.js-end");