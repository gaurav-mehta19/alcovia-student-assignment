import { Component, ReactNode } from 'react';
import { Screen } from './Screen';
import { StateView } from './StateView';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <Screen>
          <StateView
            icon="bug-outline"
            title="Something went wrong"
            subtitle="The app hit an unexpected error. Try again — your data is safe."
            actionLabel="Try again"
            onAction={this.reset}
          />
        </Screen>
      );
    }
    return this.props.children;
  }
}
