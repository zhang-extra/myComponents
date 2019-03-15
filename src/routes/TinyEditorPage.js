/** @format */

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './TinyEditorPage.less';
require('tinymce/tinymce');
require('tinymce/themes/modern/theme');
require.context(
  '!file?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins', 
  true, 
  /.*/
)
// Plugins
require('tinymce/plugins/image');
require('tinymce/plugins/link');
require('tinymce/plugins/code');

const handleEditorChange = (e) => {
  console.log('Content was updated:', e.target.getContent());
}

const TinyEditorPage = props => {

  return (
  <div className={styles.tinyEdior} >
    <Editor
      initialValue="<p>This is the initial content of the editor</p>"
      init={{
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',
        images_upload_url: '',
        menubar: false,
      }}
      onChange={handleEditorChange}
    />
  </div>

  );
};

export default TinyEditorPage;
