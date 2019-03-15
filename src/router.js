/** @format */
import React from 'react';
import { Router, Route, Switch, Link } from 'dva/router';
import { IntlProvider } from 'react-intl';
import zh from '../locales/zh.json';
import IndexPage from './routes/IndexPage';
import StepChart from './routes/StepChartPage';
import FormDesignPage from './routes/FormDesignPage';
import OrganizationChart from './routes/OrganizationChartPage';
import QueryBuild from './routes/QueryBuilderPage';
import FuncConfig from './components/dataflow/FunctionConfig';
import TablePage from './routes/TablePage';
import FormsPage from './routes/FormPage';
import AntdForm from './routes/AntdForm';
import TinyEditorPage from './routes/TinyEditorPage';
import SortablePage from './routes/SortablePage';
import CustomSortList from './routes/CustomSortList';
import ControlBoardPage from './routes/ControlBoardPage';
import LabelPage from './routes/LabelPage';
import GridLayoutPage from './routes/GridLayoutPage';
import DrInputPage from './routes/DrInputPage';
import IMPage from './routes/IMPage';
import NewIMPage from './routes/NewIMPage';
import IMClientPage from './routes/IMClientPage';
import GanttPage from './routes/GanttPage';
import DraggableTaskPage from './routes/DraggableTaskPage';
import TaskPage from './routes/TaskPage';
import CalendarPage from './routes/CalendarPage';
import TrendsPage from './routes/TrendsPage';
import FullScreenModal from './components/FullScreenModal';

import styles from './router.less';

function RouterConfig({ history }) {
  return (
    <IntlProvider locale="en" messages={zh}>
      <Router history={history}>
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to="/StepChart">stepChart</Link>
            </li>
            <li>
              <Link to="/FormDesign">FormDesignPage</Link>
            </li>
            <li>
              <Link to="/OrganizationChart">organizationChart</Link>
            </li>
            <li>
              <Link to="/QueryBuild">queryBuild</Link>
            </li>
            <li>
              <Link to="/Func">funcConfig</Link>
            </li>
            <li>
              <Link to="/TablePage">TablePage</Link>
            </li>
            <li>
              <Link to="/TinyEditor">TinyEditorPage</Link>
            </li>
            <li>
              <Link to="/FormsPage">FormsPage</Link>
            </li>
            <li>
              <Link to="/AntdForm">AntdForm</Link>
            </li>
            <li>
              <Link to="/SortablePage">SortablePage</Link>
            </li>
            <li>
              <Link to="/CustomSortList">CustomSortList</Link>
            </li>            
            <li>
              <Link to="/ControlBoardPage">ControlBoardPage</Link>
            </li>            
            <li>
              <Link to="/LabelPage">LabelPage</Link>
            </li>
            <li>
              <Link to="/GridLayoutPage">GridLayoutPage</Link>
            </li>
            <li>
              <Link to="/DrInputPage">DrInputPage</Link>
            </li>
            <li>
              <Link to="/IMPage">IMPage</Link>
            </li>
            <li>
              <Link to="/NewIMPage">NewIMPage</Link>
            </li>
            <li>
              <Link to="/IMClient">IMClientPage</Link>
            </li>
            <li>
              <Link to="/GanttPage">GanttPage</Link>
            </li>
            <li>
              <Link to="/DraggableTaskPage">DraggableTaskPage</Link>
            </li>
            <li>
              <Link to="/TaskPage">TaskPage</Link>
            </li>
            <li>
              <Link to="/CalendarPage">CalendarPage</Link>
            </li>
            <li>
              <Link to="/TrendsPage">TrendsPage</Link>
            </li>
            <li>
              <Link to="/FullScreenModal">FullScreenModal</Link>
            </li>
          </div>
          <div className={styles.content}>
            <Switch>
              <Route path="/" exact component={IndexPage} />
              <Route path="/StepChart" exact component={StepChart} />
              <Route path="/FormDesign" exact component={FormDesignPage} />
              <Route path="/OrganizationChart" exact component={OrganizationChart} />
              <Route path="/QueryBuild" exact component={QueryBuild} />
              <Route path="/Func" exact component={FuncConfig} />
              <Route path="/TablePage" exact component={TablePage} />
              <Route path="/TinyEditor" exact component={TinyEditorPage} />
              <Route path="/FormsPage" exact component={FormsPage} />
              <Route path="/AntdForm" exact component={AntdForm} />
              <Route path="/SortablePage" exact component={SortablePage} />
              <Route path="/CustomSortList" exact component={CustomSortList} />
              <Route path="/ControlBoardPage" exact component={ControlBoardPage} />
              <Route path="/LabelPage" exact component={LabelPage} />
              <Route path="/GridLayoutPage" exact component={GridLayoutPage} />
              <Route path="/DrInputPage" exact component={DrInputPage} />
              <Route path="/IMPage" exact component={IMPage} />
              <Route path="/NewIMPage" exact component={NewIMPage} />
              <Route path="/IMClient" exact component={IMClientPage} />
              <Route path="/GanttPage" exact component={GanttPage} />
              <Route path="/DraggableTaskPage" exact component={DraggableTaskPage} />
              <Route path="/TaskPage" exact component={TaskPage} />
              <Route path="/CalendarPage" exact component={CalendarPage} />
              <Route path="/TrendsPage" exact component={TrendsPage} />
              <Route path="/FullScreenModal" exact component={FullScreenModal} />
              <Route 
                component={() => {
                  return <div>没有找到呢</div>;
                }}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </IntlProvider>
  );
}

export default RouterConfig;
