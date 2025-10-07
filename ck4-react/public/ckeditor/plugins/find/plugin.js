/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.plugins.add('find', {
    requires: 'dialog',
    // jscs:disable maximumLineLength
    lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength
    icons: 'find,find-rtl,replace', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%
    init: function(editor) {
        var findCommand = editor.addCommand('find', new CKEDITOR.dialogCommand('find')),
            replaceCommand = editor.addCommand('replace', new CKEDITOR.dialogCommand('find', {
                tabId: 'replace'
            }));

        findCommand.canUndo = false;
        findCommand.readOnly = 1;

        replaceCommand.canUndo = false;

        if (editor.ui.addButton) {
            editor.ui.addButton('Find', {
                label: editor.lang.find.find,
                command: 'find',
                toolbar: 'find,10'
            });

            editor.ui.addButton('Replace', {
                label: editor.lang.find.replace,
                command: 'replace',
                toolbar: 'find,20'
            });
        }

        CKEDITOR.dialog.add('find', this.path + 'dialogs/find.js');
        // ! 1996922: Find and Replace last search text - 20_APR_2024_YA		
        var CHECK_MODULE = setInterval(function() {
            if (typeof IS_TRACK_VIEW != "undefined" && IS_TRACK_VIEW) {
                clearInterval(CHECK_MODULE);
            } else if (typeof iFIND_REPLACE != "undefined") {
                iFIND_REPLACE.GET_LIST_RES(null, {
                    Init: !0
                });
                clearInterval(CHECK_MODULE);
            }
            debug.log("INTERVAL-FIND-REPLACE-MODULE");
        }, 500);
    }
});

/**
 * Defines the style to be used to highlight results with the find dialog.
 *
 *		// Highlight search results with blue on yellow.
 *		config.find_highlight = {
 *			element: 'span',
 *			styles: { 'background-color': '#ff0', color: '#00f' }
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.find_highlight = {
    element: 'span',
    styles: {
        'background-color': '#004',
        color: '#fff'
    }
};