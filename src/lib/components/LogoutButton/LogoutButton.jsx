import React from 'react';
import IconButton from 'lib/components/IconButton';


function LogoutButton(props) {
  return (
    <IconButton
      btnStyle="link"
      icon="power-off"
      {...props}
    >
      Logout
    </IconButton>
  );
}

export default LogoutButton;
