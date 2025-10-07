CKEDITOR.plugins.add('maximize',{
    icons: "maximize",
    init: function (editor) {
        var thisPath = this.path;
        editor.addCommand('maximize', {
            exec: function (editor) {                
                editor.execCommand('maximize');
                console.log('maximize called here');
            }
        });
        editor.ui.addButton('maximize',{
                label: 'Maximize',
                command: 'maximize'    
        });            
    }
});