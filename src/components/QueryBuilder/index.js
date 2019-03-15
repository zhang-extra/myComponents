/** @format */

import React, { Component } from 'react';
import styles from './index.less';
import QueryGroup from './QueryGroup';

class QueryBuild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        type: 'AND',
        conditions: [
          { name: 'status', op: null, value: [] },
          {
            type: 'OR',
            conditions: [
              { name: 'status', op: null, value: [] },
              { name: 'status', op: null, value: [] },
            ],
          },
        ],
      },
    };
  }

  onChange = value => {
    console.log('onChange', value);
    this.setState({ value });
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <button onClick={() => console.log(value)}>Button</button>
        <QueryGroup root value={this.state.value} onChange={this.onChange} />
      </div>
    );
  }
}

export default QueryBuild;
