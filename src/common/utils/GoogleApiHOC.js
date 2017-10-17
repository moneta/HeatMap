// Inspired from: https://gist.github.com/auser/1d55aa3897f15d17caf21dc39b85b663
import React from 'react';

import cache from './ScriptCache';
import GoogleApi from './GoogleApi';

export const wrapper = (options) => (WrappedComponent) => {
  const apiKey = options.apiKey;
  const libraries = options.libraries || ['places'];

  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.state = {
        loaded: false,
        google: null,
      }
    }

    componentDidMount() {
      this.scriptCache.google.onLoad((err, tag) => {
        this.setState({
          loaded: true,
          google: window.google,
        })
      });
    }

    componentWillMount() {
      this.scriptCache = cache({
        google: GoogleApi({
          apiKey: apiKey,
          libraries: libraries
        })
      });
    }

    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        google: this.state.google,
      })
      return (
        <WrappedComponent {...props} />
      )
    }
  }

  return Wrapper;
}

export default wrapper;