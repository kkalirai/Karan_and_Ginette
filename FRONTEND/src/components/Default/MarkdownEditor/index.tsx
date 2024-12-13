'use client';
import JoditEditor from 'jodit-react';
import React, { useMemo } from 'react';

import { KEYPAIR } from '@/types/interfaces';

interface MarkdownEditorProps {
  config?: KEYPAIR;
  content: string;
  onChange?: (newContent: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ config, content, onChange = () => {} }) => {
  const editorConfig = useMemo(() => {
    return {
      ...config,
    };
  }, [config]);

  const handleBlur = (newContent: string) => {
    onChange(newContent);
  };

  return <JoditEditor value={content} config={editorConfig} onBlur={handleBlur} />;
};

export default MarkdownEditor;
