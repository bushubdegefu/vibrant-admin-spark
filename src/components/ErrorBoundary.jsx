import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has been caught
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an external service here if needed
    console.error('Error occurred:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong!</h2>
          {this.state.errorInfo && <details>{this.state.errorInfo.componentStack}</details>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;