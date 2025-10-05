CKEDITOR.plugins.add('zoomout', {
    icons: "zoomout",
    init: function (editor) {
        editor.addCommand('izoomout', {
            exec: function (editor) {
                window.CKEditorZoomController.zoomOut(editor);
            }
        });
        editor.ui.addButton('zoomout', {
            label: 'Zoom Out',
            command: 'izoomout',
            toolbar: 'tools'
        });
    }
});
CKEDITOR.plugins.add('zoomin', {
    icons: "zoomin",
    init: function (editor) {
        editor.addCommand('izoomin', {
            exec: function (editor) {
                window.CKEditorZoomController.zoomIn(editor);
            }
        });
        editor.ui.addButton('zoomin', {
            label: 'Zoom In',
            command: 'izoomin',
            toolbar: 'tools'
        });
    }
});


CKEDITOR.plugins.add('save', {
    icons: "save",
    init: function (editor) {
        editor.addCommand('saveimpact', {
            exec: function (editor) {
                IMPACT_SAVE.iSave();
            }
        });
        editor.ui.addButton('save', {
            label: 'Save',
            command: 'saveimpact',
            toolbar: 'document'
        });
    }
});
CKEDITOR.plugins.add('comment', {
    icons: "comment",
    init: function (editor) {
        editor.addCommand('add_comment', {
            exec: function (editor) {
                console.log('toolbar click');
                NewQueryModule.show('note');
            }
        });
        editor.ui.addButton('comment', {
            label: 'Add Comment',
            command: 'add_comment',
            toolbar: 'insert'
        });
    }
});
CKEDITOR.plugins.add('ImgAnnotate', {
    icons: "image",
    init: function (editor) {
        editor.addCommand('add_comment', {
            exec: async function (editor) {
                console.log('context menu click');
                try {
                    const annotationDialog = await commonMethods.getModule('AnntationDialog');
                    if (annotationDialog) {
                        annotationDialog.show();
                        return;
                    } else ErrorLogTrace('AnntationDialog', err.message);
                } catch (err) {
                    ErrorLogTrace('AnntationDialog', err.message);
                }
            }
        });
        editor.ui.addButton('comment', {
            label: 'Add Comment',
            command: 'add_comment',
            toolbar: 'insert'
        });
    }
});
CKEDITOR.plugins.add('AutoRenumber', {
    icons: "AutoRenumber",
    init: function (editor) {
        var thisPath = this.path;
        editor.addCommand('enableAutoRenumber', {
            exec: function (editor) {
                if (AutoRenumber) {
                    AutoRenumber = false;
                    $('.cke_button__autorenumber_icon').css('backgroundImage', 'url(' + thisPath + '/icons/AutoRenumber_disable.png)');
                }
                else {
                    AutoRenumber = true;
                    $('.cke_button__autorenumber_icon').css('backgroundImage', 'url(' + thisPath + '/icons/AutoRenumber.png)');
                }
            }
        });
        editor.ui.addButton('AutoRenumber', {
            label: 'Insert AutoRenumber',
            command: 'enableAutoRenumber',
            toolbar: 'insert'
        });
    }
});