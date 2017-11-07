import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'lib/components/Alert';


const ErrorsListAlert = (props) => {
  let { errors, message, className } = props;
  if (!message) {
    message = (
      <span><strong>Whoops!</strong> The following errors occurred:</span>
    );
  }
  return (
    <Alert className={className} danger>
      {message}
      <ul>
        {
          errors.map(error => {
            return (
              <li key={error}>{error}</li>
            );
          })
        }
      </ul>
    </Alert>
  );
};
ErrorsListAlert.propTypes = {
  errors: PropTypes.array.isRequired,
  message: PropTypes.string
};


export default ErrorsListAlert;
