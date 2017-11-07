import React from 'react';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import s from './NotFound.css';


function NotFound() {
  return (
    <CenteredPanelView className={s.notFound}>
      <h2>Not found</h2>
      <p>There is nothing to see here.</p>
    </CenteredPanelView>
  );
}

export default NotFound;
