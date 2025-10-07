// ck4-react/src/components/CKEditor4Wrapper.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ReportTemplate,
  ArticleTemplate,
  MeetingNotesTemplate,
  ProductOverviewTemplate,
} from "./customTemplates/index";
import { editorConfig, defaultUserData } from "./customTemplates/editorConfig";
import useEditorSocketBridge from "../core/editorSocketBridge";

export default function

  CKEditor4Wrapper({
    id = "editor1",
    data = "",
    onEvent,
    refCallback,
  }) {
  const editorRef = useRef(null);
  const [instanceReady, setInstanceReady] = useState(false);

  // ✅ pass onEvent callback here
  const { bindEditorEvents } = useEditorSocketBridge(
    null,
    window.USER_INFO?.MAIL_ID || "Guest",
    onEvent
  );

  useEffect(() => {
    const scriptId = "ckeditor4-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "/ckeditor/ckeditor.js";
      script.onload = initEditor;
      document.body.appendChild(script);
    } else {
      initEditor();
    }

    function initEditor() {
      if (!window.CKEDITOR) return;
      if (editorRef.current) return;
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true);
      }

      const templates = [
        ReportTemplate("Alex_Designer"),
        ArticleTemplate("Exploring Modern Editors", "Maria_Writer"),
        MeetingNotesTemplate("Weekly Project Sync"),
        ProductOverviewTemplate("CKEditor Integration Demo"),
      ];
      const initialData = templates[0];

      const instance = window.CKEDITOR.replace(id, editorConfig);
      window.GlobalEditor = instance;
      if (typeof refCallback === "function") refCallback(instance);

      instance.on("instanceReady", () => {
        instance.setData(initialData);
        const lite = instance.plugins.lite;
        if (lite?.setUserData) lite.setUserData(defaultUserData);
        editorRef.current = instance;
        setInstanceReady(true);
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy(true);
        editorRef.current = null;
      }
    };
  }, [id]);

  // ✅ bind when ready
  useEffect(() => {
    if (instanceReady && editorRef.current) {
      bindEditorEvents(editorRef.current);
    }
  }, [instanceReady]);

  return <textarea id={id} defaultValue={data}></textarea>;
}
