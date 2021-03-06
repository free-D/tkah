import { Button } from 'common/antd/button';
import { Card } from 'common/antd/card';
import { Col } from 'common/antd/col';
import { Input } from 'common/antd/input';
import { message } from 'common/antd/message';
import { Row } from 'common/antd/row';
import { Select } from 'common/antd/select';
import { mutate } from 'common/component/restFull';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
const Option = Select.Option;
@observer
export default class Product extends React.Component<{}, any> {
    @observable private limitFields: any[] = [{value: ''}];
    @observable private product_id: any = '';
    @observable private orderFields: any[] = [{dayValue: '', principalRatioValue: '', interestRatioValue: ''}];
    @observable private exhibitionFields: any = {exhibitionRatioValue: '', allow: '0', dayValue: ''};
    @observable private interestFields: any = {dayRate: '', max: ''};
    @observable private chargeFields: any[] = [{nameValue: '', amountSelect: '', amountInput: '', paymentValue: ''}];
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/products',
            method: 'get',
        }).then(r => {
            if (r.status_code === 200) {
                this.product_id = r.data.product_id;
                this.limitFields = r.data.grantLimitRule.map((item: any) => {
                    return {value: item.amount};
                });
                this.orderFields = r.data.period.map((item: any) => {
                    return {dayValue: item.day_num, principalRatioValue: item.repay_capital_rate, interestRatioValue: item.repay_interest_rate};
                });
                this.chargeFields = r.data.serviceCharge.map((item: any) => {
                    return {nameValue: item.name, amountSelect: item.type, amountInput: item.value, paymentValue: item.paymentValue};
                });
                this.interestFields = {dayRate: r.data.faxi.faxi_day_rate, max: r.data.faxi.faxi_upper_limit};
                this.exhibitionFields = {exhibitionRatioValue: r.data.faxi.extension_charge, dayValue: r.data.faxi.extension_time, allow: r.data.faxi.is_self_extension};
            } else {
                message.error(r.message);
            }
        });
    }
    saveLimit() {
        const grantLimitRule = this.limitFields.map((item, index) => {
            return {loan_num: index, amount: item.value};
        });
        const json = {
            product_id: this.product_id,
            grantLimitRule,
        };
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/grantLimitRules',
            method: 'post',
            variables: json,
        }).then(r => {
            if (r.status_code === 200) {
                message.success('操作成功');
            } else {
                message.error(r.message);
            }
        });
    }
    saveOrder() {
        const period = this.orderFields.map((item, index) => {
            return {period: index, day_num: item.dayValue, repay_capital_rate: item.principalRatioValue, repay_interest_rate: item.interestRatioValue};
        });
        const json = {
            product_id: this.product_id,
            period,
        };
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/periods',
            method: 'post',
            variables: json,
        }).then(r => {
            if (r.status_code === 200) {
                message.success('操作成功');
            } else {
                message.error(r.message);
            }
        });
    }
    saveCharge() {
        const serviceCharge = this.chargeFields.map((item, index) => {
            return {name: item.nameValue, type: item.amountSelect, value: item.amountInput, payment: item.paymentValue};
        });
        const json = {
            product_id: this.product_id,
            serviceCharge,
        };
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/servicecharges',
            method: 'post',
            variables: json,
        }).then(r => {
            if (r.status_code === 200) {
                message.success('操作成功');
            } else {
                message.error(r.message);
            }
        });
    }
    saveInterest() {
        const json = {
            product_id: this.product_id,
            faxi_day_rate: this.interestFields.dayRate,
            faxi_upper_limit: this.interestFields.max,
        };
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/faxis/' + this.product_id,
            method: 'put',
            variables: json,
        }).then(r => {
            if (r.status_code === 200) {
                message.success('操作成功');
            } else {
                message.error(r.message);
            }
        });
    }
    saveExhibition() {
        const json = {
            product_id: this.product_id,
            extension_charge: this.exhibitionFields.exhibitionRatioValue,
            extension_time: this.exhibitionFields.dayValue,
            is_self_extension: this.exhibitionFields.allow,
        };
        mutate<{}, any>({
            url: '/api/admin/basicconfig/product/extensions/' + this.product_id,
            method: 'put',
            variables: json,
        }).then(r => {
            if (r.status_code === 200) {
                message.success('操作成功');
            } else {
                message.error(r.message);
            }
        });
    }
    render() {
        const limitContent = (
            <div>
                {
                    this.limitFields.map((item, index) => {
                        return (<Row key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px'}}>
                                    <Col span={3} style={{lineHeight : '31px'}}>
                                        {
                                            index === 0 ? '首次借款额度:' : index + 1 + '次借款额度:'
                                        }
                                    </Col>
                                    <Col span={7}>
                                        <Input  placeholder='请输入' style={{width: '200px'}} onChange={(e) => this.limitFields[index].value = e.target.value} value={item.value}/><span style={{marginLeft: '20px'}}>（元）</span>
                                    </Col>
                                    <Col span={14}>
                                        {
                                            index === 0 ? '' : <Button  style={{float: 'right'}} onClick={() => this.limitFields.splice(index, 1)}>删除</Button>
                                        }
                                    </Col>
                                </Row>);
                    })
                }
                <div style={{float: 'right'}}>
                    <Button onClick={() => {
                        this.limitFields.push({value: ''});
                    }}>添加续借次数</Button>
                </div>
            </div>
        );
        const orderContent = (
            <div>
                {
                    this.orderFields.map((item, index) => {
                        return (<Row key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px'}}>
                            <Col span={1} style={{lineHeight : '31px',  textAlign: 'left'}}>
                                第{index + 1}期
                            </Col>
                            <Col span={2} style={{ textAlign: 'left', lineHeight : '31px' }}>
                                账单天数：
                            </Col>
                            <Col span={2} style={{ textAlign: 'left'}}>
                                <Input placeholder='请输入' style={{ width: '80px'}} onChange={(e) => this.orderFields[index].dayValue = e.target.value} value={item.dayValue}/>
                            </Col>
                            <Col span={7} style={{lineHeight : '31px', textAlign: 'right', marginLeft: '-20px'}}>
                                应还本金比例（占授信金额百分比）：
                            </Col>
                            <Col span={2}  style={{ textAlign: 'left'}}>
                                <Input  placeholder='请输入' style={{ width: '80px'}} onChange={(e) => this.orderFields[index].principalRatioValue = e.target.value} value={item.principalRatioValue}/>
                            </Col>
                            <Col span={7} style={{lineHeight : '31px', textAlign: 'right', marginLeft: '-20px'}}>
                                应还利息比例（占授信金额百分比）：
                            </Col>
                            <Col span={2}   style={{ textAlign: 'left'}}>
                                <Input placeholder='请输入' style={{ width: '80px'}} onChange={(e) => this.orderFields[index].interestRatioValue = e.target.value} value={item.interestRatioValue}/>
                            </Col>
                            <Col>
                                {
                                    index === 0 ? '' : <Button  style={{float: 'right'}} onClick={() => this.orderFields.splice(index, 1)}>删除</Button>
                                }
                            </Col>
                        </Row>);
                    })
                }
                <div style={{float: 'right'}}>
                    <Button onClick={() => {
                        this.orderFields.push({dayValue: '', principalRatioValue: '', interestRatioValue: ''});
                    }}>添加账单</Button>
                </div>
            </div>
        );
        const chargeContent = (
            <div>
                {
                    this.chargeFields.map((item, index) => {
                        return (<Row key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px'}}>
                            <Col span={6} style={{ textAlign: 'left'}}>
                                名称：<Input style={{ width: '170px'}} onChange={(e) => this.chargeFields[index].nameValue = e.target.value} value={item.nameValue}/>
                            </Col>
                            <Col span={8}  style={{ textAlign: 'left'}}>
                                金额设置：
                                <Select placeholder='请选择'  value={item.amountSelect} onChange={(data) => this.chargeFields[index].amountSelect = data} style={{width: 120, margin: '0 20px 0 0'}}>
                                    <Option value='1'>借款金额比例（%）</Option>
                                    <Option value='2'>固定金额（元）</Option>
                                </Select>
                                <Input  placeholder='请输入' style={{ width: '80px'}} onChange={(e) => this.chargeFields[index].amountInput = e.target.value} value={item.amountInput}/>
                            </Col>
                            <Col span={7}   style={{ textAlign: 'left'}}>
                                支付方式：
                                <Select placeholder='请选择' value={item.paymentValue} onChange={(data) => this.chargeFields[index].paymentValue = data} style={{width: 140, margin: '0 20px 0 10px'}}>
                                    <Option value='1'>放款后支付</Option>
                                    <Option value='2'>如期支付</Option>
                                    <Option value='3'>放款前扣款</Option>
                                </Select>
                            </Col>
                            <Col>
                                {
                                    index === 0 ? '' : <Button  style={{float: 'right'}} onClick={() => this.orderFields.splice(index, 1)}>删除</Button>
                                }
                            </Col>
                        </Row>);
                    })
                }
                <div style={{float: 'right'}}>
                    <Button onClick={() => {
                        this.chargeFields.push({nameValue: '', amountSelect: '', amountInput: '', paymentValue: ''});
                    }}>添加手续费</Button>
                </div>
            </div>
        );
        const interestContent = (
            <div>
                 <Row style={{paddingBottom: '20px', marginBottom: '20px'}}>
                    <Col span={6} style={{lineHeight : '31px',  textAlign: 'right'}}>
                        罚息日利率（%）：
                    </Col>
                     <Col span={5} style={{ textAlign: 'left'}}>
                         <Input style={{ width: '160px'}} onChange={(e) => this.interestFields.dayRate = e.target.value} value={this.interestFields.dayRate}/>
                     </Col>
                    <Col span={6} style={{ textAlign: 'right', lineHeight : '31px'}}>
                        罚息最高上限（占本金百分比）：
                    </Col>
                    <Col span={4} style={{ textAlign: 'left'}}>
                        <Input style={{ width: '160px'}} onChange={(e) => this.interestFields.max = e.target.value} value={this.interestFields.max}/>
                    </Col>
                </Row>
            </div>
        );
        const exhibitionContent = (
            <div>
                <Row style={{ marginBottom: '20px'}}>
                    <Col span={6} style={{ textAlign: 'right', lineHeight : '31px'}}>
                        展期费用（占账单本金百分比）：
                    </Col>
                    <Col span={5} style={{ textAlign: 'left'}}>
                        <Input style={{ width: '120px'}} onChange={(e) => this.exhibitionFields.exhibitionRatioValue = e.target.value} value={this.exhibitionFields.exhibitionRatioValue}/><span style={{marginLeft: '20px'}}>（%）</span>
                    </Col>
                    <Col span={2} style={{ textAlign: 'right', lineHeight : '31px'}}>
                        展期时间：
                    </Col>
                    <Col span={5} style={{ textAlign: 'left'}}>
                        <Input style={{ width: '120px'}} onChange={(e) => this.exhibitionFields.dayValue = e.target.value} value={this.exhibitionFields.dayValue}/><span style={{marginLeft: '20px'}}>（天）</span>
                    </Col>
                </Row>
                <Row style={{ paddingBottom: '20px', marginBottom: '20px'}}>
                    <Col span={6} style={{ textAlign: 'right', lineHeight : '31px'}}>
                        借款人是否可以自己展期：
                    </Col>
                    <Col span={8} style={{ textAlign: 'left'}}>
                        <Select  style={{ width: '160px'}} onChange={(data) => this.exhibitionFields.allow = data} value={this.exhibitionFields.allow}>
                            <Option value='1'>允许</Option>
                            <Option value='0'>不允许</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                <CardClass title='授信额度规则' topButton={<Button type='primary' onClick={() => this.saveLimit()}>保存</Button>} content={limitContent} />
                <CardClass title='账单配置' topButton={<Button type='primary' onClick={() => this.saveOrder()}>保存</Button>} content={orderContent} />
                <CardClass title='手续费' topButton={<Button type='primary' onClick={() => this.saveCharge()}>保存</Button>} content={chargeContent} />
                <CardClass title='罚息' topButton={<Button type='primary' onClick={() => this.saveInterest()}>保存</Button>} content={interestContent} />
                <CardClass title='展期配置' topButton={<Button type='primary' onClick={() => this.saveExhibition()}>保存</Button>} content={exhibitionContent}/>
            </div>
        );
    }

}
class CardClass extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
                <div style={{marginBottom: '20px'}}>
                    <Card
                        headStyle={{borderBottom: 'none'}}
                        title={<span style={{color: '#0099FF', borderBottom: '3px solid #0099FF', padding: '0 0px 10px 0', display: 'inline-block', width: 120}}>{this.props.title}</span>}
                        extra={this.props.topButton}
                    >
                        {
                            this.props.content
                        }
                    </Card>
                </div>
        );
    }

}
