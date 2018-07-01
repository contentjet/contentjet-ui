import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import marked from 'marked';
import insert from 'underscore.string/insert';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import IconButton from 'lib/components/IconButton';
import MediaPickerModal from 'lib/components/MediaPickerModal';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import markdownMark from 'images/markdown-mark.svg';
import s from './MarkdownInput.css';


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: false,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

// Below function comes from here -
// http://stackoverflow.com/questions/263743/caret-position-in-textarea-in-characters-from-the-start
function getCaret(el) {
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (document.selection) {
    el.focus();
    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }
    var re = el.createTextRange();
    var rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length;
  }
  return 0;
}

class MarkdownInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      modalOpen: false,
      caretPosition: 0
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onImageButtonClick = this.onImageButtonClick.bind(this);
    this.getRenderedMarkdown = this.getRenderedMarkdown.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  onBlur(e) {
    this.setState({'caretPosition': getCaret(e.target)});
  }

  onChange(e) {
    const value = e.target.value;
    this.setState({'caretPosition': getCaret(e.target)});
    this.props.onChange(value, this.props.name);
  }

  onAcceptModal(selections) {
    if (selections.isEmpty()) return;
    const textToInsert = selections.reduce((text, media) => {
      const {description, file} = media;
      return text + `![${description}](${file})\n`;
    }, '');
    const value = insert(this.props.value, this.state.caretPosition, textToInsert);
    this.props.onChange(value, this.props.name);
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onImageButtonClick() {
    this.setState({ modalOpen: true });
  }

  getRenderedMarkdown() {
    if (!this.state.fullscreen) return null;
    return {
      __html: marked(this.props.value || '')
        .replace(
          /(<img .*?>)/g, `<div class="${s.previewImgHolder}">$1</div>`
        )
    };
  }

  toggleFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      if (this.state.fullscreen) this._textArea.focus();
    });
  }

  render() {
    const className = classnames(
      s.markdownInput,
      {
        [s.hasError]: _.get(this.props, 'errors.length'),
        [s.fullscreen]: this.state.fullscreen
      },
      this.props.className
    );

    var input;
    if (this.state.fullscreen) {
      input = (
        <textarea
          ref={(textArea) => this._textArea = textArea}
          {..._.omit(this.props, inputWrapperProps, 'projectId')}
          value={this.props.value || ''}
          className={s.input}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      );
    } else {
      input = (
        <Textarea
          minRows={3}
          ref={(textArea) => this._textArea = textArea}
          {..._.omit(this.props, inputWrapperProps, 'projectId')}
          value={this.props.value || ''}
          className={s.input}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      );
    }

    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelAsSpan
      >
        <div className={s.controls}>
          <IconButton
            iconName="picture-o"
            tabIndex="-1"
            onClick={this.onImageButtonClick}
            title="Insert image"
          />
          <IconButton
            iconName="arrows-alt"
            tabIndex="-1"
            onClick={this.toggleFullscreen}
            title="Toggle fullscreen"
          >
            Toggle fullscreen
          </IconButton>
        </div>

        <div className={s.row}>
          <div className={s.column}>
            { input }
          </div>
          <div className={s.column}>
            <div
              className={s.preview}
              dangerouslySetInnerHTML={this.getRenderedMarkdown()}
            />
          </div>
        </div>

        <div className={s.footer}>
          <img className={s.markdownIcon} src={markdownMark} />
          <span>
            <a
              href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
              target="_blank"
              rel="noopener noreferrer"
            >
              markdown cheatsheet
            </a>
          </span>
        </div>

        <MediaPickerModal
          mimeTypes={['image/gif', 'image/jpeg', 'image/png']}
          maxSelections={1}
          projectId={this.props.projectId}
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        />
      </InputWrapper>
    );
  }

}

MarkdownInput.propTypes = {
  name: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default MarkdownInput;
