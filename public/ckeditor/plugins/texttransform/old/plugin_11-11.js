/**
 * @authors: Önder Ceylan <onderceylan@gmail.com>, PPKRAUSS https://github.com/ppKrauss
 * @license Licensed under the terms of GPL, LGPL and MPL licenses.
 * @version 1.1
 * @history v1.0 at 2013-05-09 by onderceylan, v1.1 at 2013-08-27 by ppkrauss.
 */

CKEDITOR.plugins.add('texttransform',
    {

        // define lang codes for available lang files here
        lang: 'en,tr,fr,es,bg',

        // plugin initialise
        init: function(editor)
        {
            // set num for switcher loop
            var num = 0;

            //applies a transformation function to the editor's selected text
            var transformSelectedText = function (editor, tag, transformFunc) {
				console.log(tag);
                var selection = editor.getSelection();
                if (selection.getSelectedText().length > 0) {
                var selected_text = editor.getSelection().getSelectedText();
                var startElement = editor.getSelection().getStartElement();
					if (startElement.getName() == 'span' && startElement.hasAttribute('data-case') ){
						if (startElement.getAttribute('data-case') == tag){
                            if (startElement.$.innerText.length == selected_text.length){
                                startElement.remove(true);
							}
                            // alert('Already apply the Small caps tags. So Please remove format small caps and apply change case styles.');
							return;
						}else{
							if (startElement.$.innerText.length == selected_text.length){
								startElement.remove(true);
                            }
                            var style = new CKEDITOR.style({element: 'span',attributes: {'data-case':tag}});
                                editor.applyStyle(style);
						}
					}else{
						var style = new CKEDITOR.style({element: 'span',attributes: {'data-case':tag}});
						editor.applyStyle(style);
					}

                    var range = selection.getRanges()[0],
                        walker = new CKEDITOR.dom.walker(range),
                        node,
                        nodeText;

                    //Transform only the selected sections of the first and last nodes,
                    //but all of the intermediate nodes
                    while ((node = walker.next())) {

                        if (node.type == CKEDITOR.NODE_TEXT && node.getText()) {

                            nodeText = node.$.textContent;

                            if (node.equals(range.startContainer)) {

                                nodeText = nodeText.substr(0, range.startOffset) +
                                    transformFunc(nodeText.substr(range.startOffset));
                            }
                            else if (node.equals(range.endContainer)) {

                                nodeText = transformFunc(nodeText.substr(0, range.endOffset)) +
                                    nodeText.substr(range.endOffset);
                            }
                            else {

                                nodeText = transformFunc(nodeText);
                            }

                            node.$.textContent = nodeText;

                        }
                    }
                    var elementt = editor.document.find( '[data-case="uppercase"],[data-case="lowercase"],[data-case="titlecase"]' );
                       for (var i=0;i<elementt.count();i++){
                        elementt.getItem(i).remove(true);
                    }
					// var elementt = editor.document.find( '#uniqueID' );
						// for (var i=0;i<elementt.count();i++){
						// console.log(elementt.getItem(i).$.id);
						// editor.document.findOne( '#'+elementt.getItem(i).$.id ).remove(true);
                    // }
					// editor.updateElement();
					// var elementt = editor.document.getElementsByTag( 'case' );
						// for (var i=0;i<elementt.count();i++){
						// elementt.getItem(i).remove(true);
					// }
                }
            }

            // add transformTextSwitch command to be used with button
            editor.addCommand('transformTextSwitch',
                {
                    exec: function () {
						// alert('ok');
                        // var selection = editor.getSelection();
						transformSelectedText(editor, 'sc', function (text) {
                            if (editor.langCode == "tr") {
                                return text;
                            } else {
                                return text;
                            }
                        });
                        // var commandArray = ['transformTextToUppercase', 'transformTextToLowercase', 'transformTextCapitalize'];
                        // if (selection.getSelectedText().length > 0) {

                            // selection.lock();

                            // editor.execCommand(commandArray[num]);

                            // selection.unlock(true);

                            // if (num < commandArray.length - 1) {
                                // num++;
                            // } else {
                                // num = 0;
                            // }

                        // }
                    }
                });

            // add transformTextToUppercase command to be used with buttons and 'execCommand' method
            editor.addCommand('transformTextToUppercase',
                {
                    exec: function () {
                        transformSelectedText(editor, 'uppercase', function (text) {

                            if (editor.langCode == "tr") {
                                return text.trToUpperCase();
                            } else {
                                return text.toLocaleUpperCase();
                            }
                        });
                    }
                });

            // add transformTextToUppercase command to be used with buttons and 'execCommand' method
            editor.addCommand('transformTextToLowercase',
                {
                    exec: function () {
                        transformSelectedText(editor, 'lowercase', function (text) {

                            if (editor.langCode == "tr") {
                                return text.trToLowerCase();
                            } else {
                                return text.toLocaleLowerCase();
                            }
                        });
                    }
                });

            // add transformTextCapitalize command to be used with buttons and 'execCommand' method
            editor.addCommand('transformTextCapitalize',
                {
                    exec: function () {
                        transformSelectedText(editor, 'titlecase', function (text) {

                            return text.replace(/[^\s]\S*/g,
                                function (word) {
                                    if (editor.langCode == "tr") {
                                        return word.charAt(0).trToUpperCase() +
                                            word.substr(1).trToLowerCase();
                                    } else {
                                        return word.charAt(0).toLocaleUpperCase() +
                                            word.substr(1).toLocaleLowerCase();
                                    }
                                }
                            );
                        });
                    }
                });

            // add TransformTextSwitcher button to editor
            editor.ui.addButton('TransformTextSwitcher',
                {
                    label: editor.lang.texttransform.transformTextSwitchLabel,
                    command: 'transformTextSwitch',
                    icon: this.path + 'images/transformSwitcher.png',
                    toolbar: 'texttransform'
                } );

            // add TransformTextToLowercase button to editor
            editor.ui.addButton('TransformTextToLowercase',
                {
                    label: editor.lang.texttransform.transformTextToLowercaseLabel,
                    command: 'transformTextToLowercase',
                    icon: this.path + 'images/transformToLower.png',
                    toolbar: 'texttransform'
                } );

            // add TransformTextToUppercase button to editor
            editor.ui.addButton('TransformTextToUppercase',
                {
                    label: editor.lang.texttransform.transformTextToUppercaseLabel,
                    command: 'transformTextToUppercase',
                    icon: this.path + 'images/transformToUpper.png',
                    toolbar: 'texttransform'
                } );

            // add TransformTextCapitalize button to editor
            editor.ui.addButton('TransformTextCapitalize',
                {
                    label: editor.lang.texttransform.transformTextCapitalizeLabel,
                    command: 'transformTextCapitalize',
                    icon: this.path + 'images/transformCapitalize.png',
                    toolbar: 'texttransform'
                } );
        }
    } );
