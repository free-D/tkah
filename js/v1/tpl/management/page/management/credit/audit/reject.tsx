import { Button } from 'common/antd/button';
import { Card } from 'common/antd/card';
import { Col } from 'common/antd/col';
import { DatePicker } from 'common/antd/date-picker';
import { Form } from 'common/antd/form';
import { Icon } from 'common/antd/icon';
import { Input } from 'common/antd/input';
import { message } from 'common/antd/message';
import { Modal } from 'common/antd/modal';
import { Row } from 'common/antd/row';
import { Select } from 'common/antd/select';
import { Spin } from 'common/antd/spin';
import { Table } from 'common/antd/table';
import {mutate, Querier} from 'common/component/restFull';
import {SearchTable, TableList} from 'common/component/searchTable';
import { BaseForm, ComponentFormItem, TypeFormItem } from 'common/formTpl/baseForm';
import * as _ from 'lodash';
import { observable, toJS, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {
    Link,
    Route,
    Switch,
} from 'react-router-dom';
import {withAppState} from '../../../../common/appStateStore';
import CardClass from '../../../../common/CardClass';
import Title from '../../../../common/TitleComponent';
interface RejectPropsType {
    rejectVisible: boolean;
    rejectCancel: () => void;
    id?: string | number;
    onOk: (values: any) => any;
    form?: any;
}
@observer
class RejectComponent extends React.Component<RejectPropsType, any> {
    private query: Querier<any, any> = new Querier(null);
    private disposers: Array<() => void> = [];
    @observable private loading: boolean = false;
    @observable private black_status: any = '';
    @observable private products: any = { auditRules: {}};
    constructor(props: any) {
        super(props);
    }
    componentWillUnmount() {
        this.disposers.forEach(f => f());
        this.disposers = [];
    }
    componentDidMount() {
        this.query.setReq({
            url: '/api/admin/basicconfig/product/products',
            method: 'get',
        });
        this.disposers.push(reaction(() => {
            return (_.get(this.query.result, 'result.data') as any) || [];
        }, searchData => {
            this.products = searchData;
            if (this.products.auditRules.is_black === 1 ) {
                this.black_status = '2';
            }
        }));
    }
    pass() {
        if (this.loading) {
            return;
        }
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                const json: any = _.assign({}, values);
                if (json.black_expired_at) {
                    json.black_expired_at = json.black_expired_at.format('YYYY-MM-DD');
                }
                if (this.props.onOk) {
                    this.loading = true;
                    this.props.onOk(json).then(() => {
                        this.loading = false;
                    });
                }
            }
        });
    }
    cancel() {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({ black_status: '1' });
        this.black_status = '1';
        this.props.rejectCancel();
    }
    render() {
        const formItem: Array<TypeFormItem | ComponentFormItem> = [
            {
                itemProps: { label: '是否拉黑' },
                required: true,
                typeComponentProps: { onChange: (data: any) => { this.black_status = data; } },
                initialValue: this.products.auditRules.is_black === 1 ? '2' : '1', key: 'black_status', type: 'select', options: [{ label: '拉黑', value: '2' }, { label: '不拉黑', value: '1' }],
            },
            { itemProps: { label: '拒绝有效期' }, required: true, key: 'black_expired_at', type: 'datePicker' },
        ];
        if (this.black_status === '2') {
            formItem.splice(1, 1);
        }
        return (<Modal
            title={'批量拒绝'}
            visible={this.props.rejectVisible}
            onOk={() => this.pass()}
            onCancel={() => this.cancel()}
        >
            <Spin spinning={this.loading}>
                <BaseForm item={formItem} form={this.props.form} />
            </Spin>
        </Modal>);
    }
}
const Reject: any = Form.create()(RejectComponent);
export default Reject;
