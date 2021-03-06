import { observer } from 'mobx-react';
import * as React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import detail from './detail';
import list from './list';

@observer
export default class Audit extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <Switch>
                <Route exact path='/management/custorm/list/detail/:id' component={detail} />
                <Route component={list}  />
            </Switch>
        );
    }
}
