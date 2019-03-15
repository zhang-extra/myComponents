import React, { Component } from 'react';
import styles from './QueryBuilderPage.less';
import QueryBuild from '../components/QueryBuilder';

class QueryBuildPage extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <QueryBuild />
      </div>
    );
  }
}

export default QueryBuildPage;
