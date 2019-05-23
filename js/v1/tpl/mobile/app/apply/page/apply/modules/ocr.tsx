import { Button } from 'common/antd/mobile/button';
import { List } from 'common/antd/mobile/list';
import { NavBarBack, NavBarTitle } from 'common/app';
import * as _ from 'lodash';
import { ModuleUrls } from 'mobile/app/apply/common/publicData';
import { withAppState, WithAppState } from 'mobile/common/appStateStore';
import { toJS } from 'mobx';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { style } from 'typestyle';

export class OcrView extends React.Component<RouteComponentProps<any> & WithAppState, {}> {
    constructor(props: any) {
        super(props);
        NavBarBack(() => {
            if (this.props.data.parentPageUrl) {
                const state = this.props.data.parentPageUrl.state || {};

                this.props.history.push(_.assign({}, this.props.data.parentPageUrl, {
                    state: _.assign({}, state, {
                        unauto: true,
                    }),
                }));
            } else {
                window.history.back();
            }
        });
        NavBarTitle(() => {
            this.props.data.pageTitle = '身份证OCR';
        });
    }

    render() {
        return (
            <div>
                <List>
                    <List.Item extra={'extra content'}>姓名</List.Item>
                    <List.Item extra={'extra content'}>身份证</List.Item>
                </List>
                <Button type='primary'
                    style={{ marginTop: '80px' }}
                    onClick={this.handleSubmit}>下一步</Button>
                <div className={style({
                    fontSize: '14px',
                    textAlign: 'center',
                    margin: '15px',
                })}>若信息有误，请<span className={style({ color: '#E55800' })} onClick={this.resetPhone}>重新拍摄</span></div>
            </div>
        );
    }

    private resetPhone = () => {
        console.log('resetPhone');
    }

    private handleSubmit = () => {
        const { steps, stepNumber } = this.props.location.state;
        if (stepNumber === steps.length - 1) {
            const stepInfo = this.props.data.stepInfo.steps[this.props.data.stepInfo.stepNumber + 1];
            if (stepInfo) {
                this.props.history.push(`/apply/module/${stepInfo.page_type === 1 ? 'single' : 'multiple'}/${stepInfo.id}`);
            } else {
                this.props.history.push(`/apply/home`);
            }
        } else {
            const info = steps[stepNumber + 1];

            this.props.history.push({
                pathname: ModuleUrls[info.key],
                state: {
                    steps: toJS(steps),
                    stepNumber: stepNumber + 1,
                },
            });
        }
    }

}

export const Ocr = withRouter(withAppState(OcrView));
