// @flow
import * as React from 'react'

type Props = {
  children: React.Element<*>
    | ({windowWidth: number, windowHeight: number}) => React.Element<*>
}

type State = {
  windowWidth: number,
  windowHeight: number
}

export default class WindowDimensions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onResize = this.onResize.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  }

  onResize() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }

  componentWillMount() {
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  render() {
    if (typeof this.props.children === 'function') {
      const renderedChildren = this.props.children(this.state)
      return renderedChildren && React.Children.only(renderedChildren)
    }

    return React.Children.only(React.cloneElement(this.props.children, this.state))
  }
}
