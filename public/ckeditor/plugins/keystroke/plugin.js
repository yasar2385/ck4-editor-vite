CKEDITOR.plugins.add('keystroke', {
    init: function (editor) {
        editor.addCommand('PrevSelction', {
            exec: function (editor) {
				clearInterval(CITATION_POPUP.CitePopInterval);
                // $(CITATION_POPUP.Panel).hide();
                $(CITATION_POPUP.Panel).css('opacity','1').hide();
              if(!!CITATION_POPUP.prevElemPos){
                    CITATION_POPUP.prevElemPos.scrollIntoView(true);
                    CITATION_POPUP.prevElemPos=null;
				}  
            }
        });
        editor.setKeystroke( CKEDITOR.ALT + 37 /*Alt + Left Arrow*/, 'PrevSelction' );
    }
});