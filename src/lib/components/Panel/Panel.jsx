import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import s from './Panel.css';


function PanelHeader(props) {

  let children = props.children;
  if (_.isString(children)) {
    children = (
      <h3 className={s.headerHeading}>{ children }</h3>
    );
  }
  const className = classnames(
    s.panelHeader,
    {
      [s.textLeft]: props.textAlign === 'left',
      [s.textCenter]: props.textAlign === 'center',
      [s.textRight]: props.textAlign === 'right'
    },
    props.className
  );
  return (
    <header className={className}>
      {children}
    </header>
  );

}
PanelHeader.propTypes = {
  textAlign: PropTypes.oneOf(['left', 'center', 'right'])
};


function PanelFooter(props) {

  const className = classnames(
    s.panelFooter,
    {
      [s.textLeft]: props.textAlign === 'left',
      [s.textCenter]: props.textAlign === 'center',
      [s.textRight]: props.textAlign === 'right'
    },
    props.className
  );
  return (
    <footer className={className}>
      {props.children}
    </footer>
  );

}
PanelFooter.propTypes = {
  textAlign: PropTypes.oneOf(['left', 'center', 'right'])
};


function Panel(props) {

  const className = classnames(s.panel, props.className);

  if (props.header) {
    var header = (
      <PanelHeader
        className={props.headerClassName}
        textAlign={props.headerTextAlign}
      >
        {props.header}
      </PanelHeader>
    );
  }

  if (props.footer) {
    var footer = (
      <PanelFooter
        className={props.footerClassName}
        textAlign={props.footerTextAlign}
      >
        {props.footer}
      </PanelFooter>
    );
  }

  return (
    <section className={className}>
      {header}
      <div className={s.panelBody}>
        {props.children}
      </div>
      {footer}
    </section>
  );

}
Panel.propTypes = {
  header: PropTypes.node,
  headerClassName: PropTypes.string,
  headerTextAlign: PropTypes.oneOf(['left', 'center', 'right']),
  footer: PropTypes.node,
  footerClassName: PropTypes.string,
  footerTextAlign: PropTypes.oneOf(['left', 'center', 'right'])
};


export default Panel;
