import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';


class Authenticated extends Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isAuthenticated) {
      this.context.router.replace('/login');
    }
  }

  shouldComponentUpdate() {
    return this.props.isAuthenticated;
  }

  render() {
    return this.props.children;
  }

}
Authenticated.propTypes = {
  isAuthenticated: PropTypes.bool
};
Authenticated.contextTypes = {
  router: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    isAuthenticated: AuthenticationSelectors.isAuthenticated(state)
  };
};

export default connect(
  mapStateToProps
)(Authenticated);
