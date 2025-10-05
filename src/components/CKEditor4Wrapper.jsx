import React, { useEffect, useRef } from 'react';

export default function CKEditor4Wrapper({ id = 'editor1', data = '', readOnly = false, onChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        // Ensure CKEditor script is loaded from /public
        const scriptId = 'ckeditor4-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = '/ckeditor/ckeditor.js';
            script.onload = () => initEditor();
            document.body.appendChild(script);
        } else {
            initEditor();
        }

        function initEditor() {
            if (!window.CKEDITOR) return;

            // Destroy existing instance if any
            if (window.CKEDITOR.instances[id]) {
                window.CKEDITOR.instances[id].destroy(true);
            }

            window.CKEDITOR.replace(id, {
                height: 300,
                extraPlugins: '',
                toolbar: [
                    { name: 'clipboard', items: ['Undo', 'Redo'] },
                    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
                    '/',
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
                    { name: 'tools', items: ['Maximize'] },
                ],
            });

            const instance = window.CKEDITOR.instances[id];

            instance.on('change', () => {
                const value = instance.getData();
                if (onChange) onChange(value);
            });

            editorRef.current = instance;
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy(true);
                editorRef.current = null;
            }
        };
    }, [id, readOnly]);

    return <textarea id={id} defaultValue={data}></textarea>;
}
