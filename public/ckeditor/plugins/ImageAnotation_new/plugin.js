CKEDITOR.plugins.add('ImageAnotationN', {
    init: function (editor) {
        var pluginName = 'ImageAnotation';       
        editor.addCommand('editImgCmd', {
            exec: function () {
                openImageBox();       
            }
        });
/*         var editImgCmd = {
            label: 'Image Annotation',
            command: 'editImgCmd',
            group: 'image'
        }; */
        if (editor.contextMenu) {
            editor.addMenuGroup('image');
            editor.addMenuItems({
                editImgCmd: {
                    label: 'Image Annotation',
                    command: 'editImgCmd',
                    group: 'image',
                    icon: CKEDITOR.plugins.getPath('ImageAnotation_new') + 'img_icon.png'
                }
            });
        }
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function (element, selection) {
                if (element.getAscendant('img', true)) {
                    if ((element.getAscendant('img', true) && $(element.$).parent().prop('tagName').toLowerCase() != 'equations')) {
                        return {
                            editImgCmd: CKEDITOR.TRISTATE_OFF
                        };
                    }
                }
            });
        }
    }
});